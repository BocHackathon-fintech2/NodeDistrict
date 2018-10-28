# Deploy Node

Deploy a node 

**URL** : `/api/nodes/deploy`

**Method** : `GET`


**Query Parameters**

| Param         | Description   |
| ------------- |:-------------:|
| nodeid        | the id of the node to deploy |
| image        | Docker image identifier to use for deployment |

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "overall": "Successfully started 1 masternodes, failed to start 0, total 1",
    "detail": [
        {
            "alias": "mnode1",
            "result": "successful"
        }
    ],
    "seconds": "121.27649140357971"
}

```

