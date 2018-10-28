import docker
import subprocess
import json
import time

from flask_restful import Resource
from flask_restful import reqparse
from helpers import wagerr_cli, add_masternode_conf, available_resource, restart_wallet
from Model import db, Node


class NodeDeploy(Resource):
    def __init__(self):
        self.client = docker.from_env()
        self.parser = reqparse.RequestParser()
    
    def get(self):
        self.parser.add_argument('nodeid')
        self.parser.add_argument('image')
        args = self.parser.parse_args()
        node = Node.query.get(args['nodeid'])

        containers = list(map(lambda c: c.attrs['Name'][1:], self.client.containers.list()))
        if node.container_name in containers:
            return {"status": "This node already has a container running"}

        start_time = time.time()
        container = self.client.containers.run(args['image'], environment=["MNPRIV_KEY=%s" % node.mnkey, "PORT=%d" % node.port],
                                               ports={'%d/tcp' % node.port:node.port, '%d/tcp' % (node.port+1):(node.port+1)}, detach=True, tty=True)

        node.container_name=container.attrs['Name'][1:]
        node.container_id=container.attrs['Id']
        db.session.commit()

        # Wait until docker is deployed
        container_logs = container.logs(stream=False, tail=10)
        while b'Synchronized' not in container_logs:
            container_logs = container.logs(stream=False, tail=10)
            time.sleep(1)
        
        # Start masternode
        wagerr_cli("listaddressgroupings")
        time.sleep(1)
        result = wagerr_cli("startmasternode alias false %s" % node.name)
        status = json.loads(result.decode('utf-8'))
        elapsed_time = time.time() - start_time
        status["seconds"] = "%s" % elapsed_time
        return status
    