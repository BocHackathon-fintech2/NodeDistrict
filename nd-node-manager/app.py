from flask import Blueprint
from flask_restful import Api
from resources.NodeDeploy import NodeDeploy
from resources.Node import NodeResource
from resources.NodeStart import NodeStart
from resources.NodeStats import NodeStats
from resources.NodeStop import NodeStop


api_bp = Blueprint('api', __name__)
api = Api(api_bp)

# Route
api.add_resource(NodeResource, '/nodes')
api.add_resource(NodeStart, '/nodes/start')
api.add_resource(NodeStop, '/nodes/stop')
api.add_resource(NodeStats, '/nodes/stats')
api.add_resource(NodeDeploy, '/nodes/deploy')

