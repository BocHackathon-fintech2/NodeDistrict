import json

from flask import request
from flask_restful import Resource
from flask_restful import reqparse
from helpers import wagerr_cli, add_masternode_conf, available_resource
from Model import db, Node, NodeSchema
from helpers import wagerr_cli, available_resource, restart_wallet

node_schema = NodeSchema()
nodes_schema = NodeSchema(many=True)

class NodeResource(Resource):
    def get(self):
        nodes = Node.query.all()
        nodes = nodes_schema.dump(nodes).data
        available_resource()
        return {'status': 'success', 'data': nodes}, 200
    
    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = node_schema.load(json_data)
        if errors:
            return errors, 422
        node = Node.query.filter_by(collateral_key=data['collateral_key']).first()
        mnkey = wagerr_cli("masternode genkey").decode('utf-8').strip()
        if node:
            return {'message': 'Colatteral address already used'}, 400

        try:
            wagerr_cli("importprivkey %s lolol" % data['collateral_key'])
        except Exception as e:
            return {'message': 'Error importing private key'}, 400

        # This will work only for one node need ot figure out how to identify
        # unsused transaction in the list. ( Can check masternode.conf )
        masternode_ouputs = json.loads(wagerr_cli("masternode outputs"))
        if len(masternode_ouputs) == 0:
            return {'message': 'Cannot find 25000 wagerr in address'}, 400

        ip, port = available_resource()
        node = Node(
            name=data['name'],
            ip=ip,
            port=port,
            collateral_key=data['collateral_key'],
            mnkey=mnkey,
            output_txhash=masternode_ouputs[0]['txhash'],
            output_txid=masternode_ouputs[0]['outputidx'])

        db.session.add(node)
        db.session.commit()

        add_masternode_conf(node.name, node.ip, node.port, node.mnkey, node.output_txhash, node.output_txid)
        restart_wallet()

        result = node_schema.dump(node).data

        return { "status": 'success', 'data': result }, 201
    