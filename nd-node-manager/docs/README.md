# Node District - Node Manager

This is the node manager API documentation.

Node manager is the core component for managing masternodes (i.e. docker containers).

## Get started

The only thing you need to get started is a wagerr address with 25000 WGR in it.
Get the private key of this address and import a new node entity by executing a POST request the `api/nodes` endpoint (details below)

## Open Endpoints

Open endpoints require no Authentication.

* [Nodes](nodes.md) : `POST /api/nodes`
* [Node Start](start.md) : `GET /api/nodes/start`
* [Node Stop](stop.md) : `GET /api/nodes/stop`
* [Node Deploy](deploy.md) : `GET /api/nodes/deploy`
* [Node Stats](stats.md) : `GET /api/nodes/stats`

