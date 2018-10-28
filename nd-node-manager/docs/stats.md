# Node Stats

Statistics of all nodes.

If a `nodeid` is provided then that stats for that particular node are returned.

**URL** : `/api/nodes/stats`

**Method** : `GET`


**Query Parameters**

| Param         | Description   |
| ------------- |:-------------:|
| nodeid        | (Optional) the id of the node to deploy |

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
    {
        "node_name": "mnode1",
        "docker_stats": {
            "read": "2018-10-27T17:41:04.701165837Z",
            "preread": "2018-10-27T17:41:03.701234772Z",
            "pids_stats": {
                "current": 21
            },
            "blkio_stats": {
                "io_service_bytes_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Read",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Write",
                        "value": 285077504
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Sync",
                        "value": 284872704
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Async",
                        "value": 204800
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Total",
                        "value": 285077504
                    }
                ],
                "io_serviced_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Read",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Write",
                        "value": 6369
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Sync",
                        "value": 6367
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Async",
                        "value": 2
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Total",
                        "value": 6369
                    }
                ],
                "io_queue_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Read",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Write",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Sync",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Async",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Total",
                        "value": 0
                    }
                ],
                "io_service_time_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Read",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Write",
                        "value": 114144009699
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Sync",
                        "value": 114143546930
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Async",
                        "value": 462769
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Total",
                        "value": 114144009699
                    }
                ],
                "io_wait_time_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Read",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Write",
                        "value": 77368671
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Sync",
                        "value": 77340978
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Async",
                        "value": 27693
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Total",
                        "value": 77368671
                    }
                ],
                "io_merged_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Read",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Write",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Sync",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Async",
                        "value": 0
                    },
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "Total",
                        "value": 0
                    }
                ],
                "io_time_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "",
                        "value": 1692048524
                    }
                ],
                "sectors_recursive": [
                    {
                        "major": 8,
                        "minor": 0,
                        "op": "",
                        "value": 556792
                    }
                ]
            },
            "num_procs": 0,
            "storage_stats": {},
            "cpu_stats": {
                "cpu_usage": {
                    "total_usage": 33251984737,
                    "percpu_usage": [
                        13958208087,
                        8486338315,
                        7380188447,
                        3427249888,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "usage_in_kernelmode": 8870000000,
                    "usage_in_usermode": 23990000000
                },
                "system_cpu_usage": 15253230000000,
                "throttling_data": {
                    "periods": 0,
                    "throttled_periods": 0,
                    "throttled_time": 0
                }
            },
            "precpu_stats": {
                "cpu_usage": {
                    "total_usage": 33250342079,
                    "percpu_usage": [
                        13958138674,
                        8486338315,
                        7378672909,
                        3427192181,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],
                    "usage_in_kernelmode": 8870000000,
                    "usage_in_usermode": 23990000000
                },
                "system_cpu_usage": 15249240000000,
                "throttling_data": {
                    "periods": 0,
                    "throttled_periods": 0,
                    "throttled_time": 0
                }
            },
            "memory_stats": {
                "usage": 213102592,
                "max_usage": 213958656,
                "stats": {
                    "active_anon": 153944064,
                    "active_file": 851968,
                    "cache": 55435264,
                    "dirty": 0,
                    "hierarchical_memory_limit": 9223372036854771712,
                    "inactive_anon": 45056,
                    "inactive_file": 54538240,
                    "mapped_file": 25501696,
                    "pgfault": 49719,
                    "pgmajfault": 0,
                    "pgpgin": 62451,
                    "pgpgout": 11319,
                    "rss": 154001408,
                    "rss_huge": 0,
                    "shmem": 45056,
                    "total_active_anon": 153944064,
                    "total_active_file": 851968,
                    "total_cache": 55435264,
                    "total_dirty": 0,
                    "total_inactive_anon": 45056,
                    "total_inactive_file": 54538240,
                    "total_mapped_file": 25501696,
                    "total_pgfault": 49719,
                    "total_pgmajfault": 0,
                    "total_pgpgin": 62451,
                    "total_pgpgout": 11319,
                    "total_rss": 154001408,
                    "total_rss_huge": 0,
                    "total_shmem": 45056,
                    "total_unevictable": 57344,
                    "total_writeback": 0,
                    "unevictable": 57344,
                    "writeback": 0
                },
                "limit": 16796557312
            },
            "name": "/competent_galileo",
            "id": "6d0fab8db5ffad7dc75f5c7f3f3785735134b6b59b7634779a83192ab4572b33",
            "networks": {
                "eth0": {
                    "rx_bytes": 9353357,
                    "rx_packets": 4172,
                    "rx_errors": 0,
                    "rx_dropped": 0,
                    "tx_bytes": 822144,
                    "tx_packets": 3557,
                    "tx_errors": 0,
                    "tx_dropped": 0
                }
            }
        },
        "masternode_status": {
            "txhash": "e92d074ab1a6da2428971242f6db1662f62432bca0bccbee7aa356117256e1fb",
            "outputidx": 0,
            "netaddr": "51.136.17.64:55004",
            "addr": "TKb9c9sbuxNwjU2DS7qLoV6W724Bxd1PqD",
            "status": 4,
            "message": "Masternode successfully started"
        },
        "up": true
    }
]


```

