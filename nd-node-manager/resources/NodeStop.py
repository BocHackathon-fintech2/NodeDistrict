import docker
import json

from flask_restful import reqparse
from flask_restful import Resource
from helpers import wagerr_cli
from Model import Node
from run import WAGERR_VERSION

class NodeStop(Resource):
    def __init__(self):
        self.client = docker.from_env()
        self.parser = reqparse.RequestParser()

    def get(self):
        self.parser.add_argument('nodeid', required=True)
        args = self.parser.parse_args()
        
        node = Node.query.get(args['nodeid'])
        try:
            container = self.client.containers.get(node.container_id)
            container.stop()
            container.remove()
            return {'status': 'Masternode stopped'}
        except Exception as e:
            return {'status': 'Container not found. Maybe node is not running!'}

        

