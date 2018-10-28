var express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    mysql = require('../../services/mysqldb'),
    jwt = require('jsonwebtoken'),
    request = require('request'),
    Web3 = require('web3'),
    EthereumTx = require('ethereumjs-tx'),
    Joi = require('joi');

const receipt_ABI = require('../../services/receiptABI.json'),
      web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_ENDPOINT));

router.get('/', passport.authenticate('jwt-user',{ session: false }), (req, res) => { 
    var sql = `SELECT nodes.id, nodes.title, nodes.total_tokens,nodes.daily_rewards,SUM(users_own_nodes.amount) AS total_user_amount FROM nodes 
                LEFT JOIN users_own_nodes ON users_own_nodes.node_id = nodes.id
                WHERE deleted_at IS NULL GROUP BY nodes.id`
    mysql.select(sql, (err, nodes) => {
        if(err)
            res.status(500).send(err)
        else {
            if(nodes.length > 0) {
                res.status(200).json({
                    nodes: nodes
                })
            }
            else 
                res.status(400).send(`Nodes not found`)
        }
    })
});

    
router.post('/buy',passport.authenticate('jwt-user',{ session: false }), (req, res) => { 
    var sql = `SELECT nodes.total_tokens,nodes.daily_rewards,SUM(users_own_nodes.amount) AS total_user_amount FROM nodes 
        LEFT JOIN users_own_nodes ON users_own_nodes.node_id = nodes.id
        WHERE nodes.id = '${req.body.node_id}'`;
    mysql.selectOne(sql, (err, node) => {
        if(err)
            res.status(500).send(err)
        else {
            if(node) {
                if(req.body.amount <= node.total_tokens - node.total_user_amount ) {
                    mysql.insertOne("users_own_nodes", {
                        user_id : req.user.id,
                        node_id: req.body.node_id,
                        amount: req.body.amount,
                        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    }, (err, users_own_node_id) => {
                        if(err)
                            res.status(500).send(err)
                        else {
                            var user_percentage_reward = req.body.amount / node.total_tokens ;
                            var daily_rewards_amount = node.daily_rewards * user_percentage_reward
                            mysql.insertOne("users_nodes_rewards", {
                                user_id: req.user.id,
                                node_id: req.body.node_id,
                                amount: daily_rewards_amount,
                                paid_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                            }, (err, users_nodes_reward_id) => {
                                if(err)
                                    res.status(500).send(err)
                                else {
                                     res.status(200).json({
                                        users_own_node_id : users_own_node_id,
                                        users_nodes_reward_id: users_nodes_reward_id
                                    })
                                }
                            })               
                        }
                    })
                }
                else
                    res.status(400).send(`insufficient balance`)
            }
            else
                res.status(400).send(`Node not found`)
        }
    })
});

router.post('/withdrawl', passport.authenticate('jwt-user',{ session: false }), (req, res) => { 
    var sql = `SELECT  users_nodes_rewards.* FROM users_nodes_rewards 
            INNER JOIN nodes ON nodes.id = users_nodes_rewards.node_id
            INNER JOIN tokens ON tokens.id = nodes.token_id
            WHERE users_nodes_rewards.user_id = '${req.user.id}' AND users_nodes_rewards.withdrawl_at IS NULL  `
    mysql.select(sql, (err, users_nodes_rewards) => {
        if(err)
            res.status(500).send(err)
        else {
            if(users_nodes_rewards.length > 0) {
                let total_money = 0;
                for(var i=0; i < users_nodes_rewards.length; i++) {
                    total_money += users_nodes_rewards[i].amount
                }
                 let actions = users_nodes_rewards.map((users_nodes_reward) => {
                    return new Promise((resolve, reject) => {
                        var sql = `UPDATE users_nodes_rewards set withdrawl_at = ? WHERE users_nodes_rewards.id = '${users_nodes_reward.id}' AND node_id = '${users_nodes_reward.node_id}' AND user_id = '${req.user.id}'`
                        
                        mysql.update(sql,[
                            new Date().toISOString().slice(0, 19).replace('T', ' ')
                        ], (err, effect_row) => {
                            if(err)
                                reject(err)
                            else {
                                resolve({
                                    id: users_nodes_reward.id,
                                    withdraw_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                                })
                            }
                        });
                    });
                });
                return Promise.all(actions).then((withdrawls) => {
                    var receipt_contract = new web3.eth.Contract(receipt_ABI, process.env.RECEIPT_ADDRESS);
                    web3.eth.getTransactionCount(process.env.ADMIN_PUBLIC_ADDRESS, (err, count_val) => {
                         var rawTransactionObj = {
                            from: process.env.ADMIN_PUBLIC_ADDRESS,
                            to: process.env.RECEIPT_ADDRESS,
                            nonce: count_val,
                            gasPrice: web3.utils.toHex(99000000000),
                            gasLimit: web3.utils.toHex(100000),
                            value: "0x0",
                            data : receipt_contract.methods.addPersonDetails(
                                web3.utils.fromAscii(req.user.id),
                                web3.utils.fromAscii(total_money)
                            ).encodeABI()
                        }
                        var privKey = new Buffer(process.env.ADMIN_PRIVATE_KEY.toLowerCase().replace('0x', ''), 'hex');
                        var tx = new EthereumTx(rawTransactionObj);
                        tx.sign(privKey);
                        var serializedTx = tx.serialize();
                        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                            if (err)
                                return res.status(500).send('Oops! Something went wrong. Please try again!', null)
                            else {
                                
                            }

                           
                        });

                    });
                    res.status(200).json({
                        withdrawls: withdrawls
                    })
                }).catch(err => {
                   res.status(500).send(err)
                })
               
            }
            else
                res.status(400).send(`Next payment in 36 hours`)
        }
    })
});

module.exports = router;