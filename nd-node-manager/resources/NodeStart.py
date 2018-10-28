import docker
import json

from flask_restful import reqparse
from flask_restful import Resource
from helpers import wagerr_cli
from Model import Node


class NodeStart(Resource):
    def __init__(self):
        self.client = docker.from_env()
        self.parser = reqparse.RequestParser()

    def get(self):
        self.parser.add_argument('nodeid', required=True)
        args = self.parser.parse_args()

        node = Node.query.get(args['nodeid'])
        result = wagerr_cli("startmasternode alias false %s" % node.name)
        return json.loads(result.decode('utf-8'))

