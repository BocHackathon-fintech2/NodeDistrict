# Stop Node

Stops a node. (Stops the containers and removes it) 

**URL** : `/api/nodes/stop`

**Method** : `GET`


**Query Parameters**

| Param         | Description   |
| ------------- |:-------------:|
| nodeid        | the id of the node to stop |

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "status": "Masternode stopped"
}
```

