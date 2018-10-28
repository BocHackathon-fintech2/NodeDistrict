# Start Node

Start a node 

**URL** : `/api/nodes/start`

**Method** : `GET`


**Query Parameters**

| Param         | Description   |
| ------------- |:-------------:|
| nodeid        | the id of the node to start |

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "status": "success",
    "data": [
        {
            "port": 55004,
            "name": "mnode1",
            "output_txhash": "e92d074ab1a6da2428971242f6db1662f62432bca0bccbee7aa356117256e1fb",
            "collateral_key": "TGjBiqAKF3QQohH6yAYgnmxWEk6tHBbm3Wq5QLtoEB7fLueeviac",
            "mnkey": "6wTj9pAz5kPm97RTJcWiuqmHMPk7FAEM13Xs34DLUs4UWBJVKJ7",
            "output_txid": "0",
            "ip": "51.136.17.64",
            "container_id": "d736ed0aee93da6fa2d65896c0c9b20e04a2aeedd3f3d717dce06ddffe4b4934",
            "id": 1,
            "container_name": "relaxed_allen"
        }
    ]
}
```

