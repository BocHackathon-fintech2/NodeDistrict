import docker
import json

from flask_restful import reqparse
from flask_restful import Resource
from helpers import wagerr_cli
from Model import Node
from run import WAGERR_VERSION

class NodeStats(Resource):
    def __init__(self):
        self.client = docker.from_env()
        self.parser = reqparse.RequestParser()

    def get_node_stats(self, node):
        docker_stats = self.client.api.stats(container=node.container_id, stream=False)
        container = self.client.containers.get(node.container_id)
        masternode_status = container.exec_run("/bin/bash -c \"~/wagerr-" + WAGERR_VERSION + "/bin/wagerr-cli --testnet masternode status\"", tty=True)
        masternode_status = masternode_status.output.decode('utf-8')
        masternode_status = masternode_status[masternode_status.find('{'):]
        masternode_status = json.loads(masternode_status)

        node_stat = {'node_name': node.name}
        node_stat['docker_stats']=docker_stats
        node_stat['masternode_status']=masternode_status
        node_stat['up'] = 'code' not in masternode_status

        return node_stat

    def get(self):
        self.parser.add_argument('nodeid')
        args = self.parser.parse_args()

        stats = []
        if args['nodeid']:
            node = Node.query.get(args['nodeid'])
            return self.get_node_stats(node)
        else:
            nodes = Node.query.all()
            for node in nodes:
                stats.append(self.get_node_stats(node))

        return stats

