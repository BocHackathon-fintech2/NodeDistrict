var express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    mysql = require('../../services/mysqldb'),
    jwt = require('jsonwebtoken'),
    Joi = require('joi');


router.get('/', passport.authenticate('jwt-user',{ session: false }), (req, res) => { 
    var sql = `SELECT nodes.id,SUM(users_own_nodes.amount) AS total_amount,
            nodes.total_tokens AS node_total_tokens FROM users_own_nodes 
            INNER JOIN nodes ON nodes.id = users_own_nodes.node_id
            INNER JOIN tokens ON tokens.id = nodes.token_id
            WHERE users_own_nodes.user_id = '${req.user.id}' AND nodes.deleted_at IS NULL GROUP BY nodes.id`
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
        INNER JOIN users_own_nodes ON users_own_nodes.node_id = nodes.id
        WHERE nodes.id = '${req.body.node_id}'`;
    mysql.selectOne(sql, (err, node) => {
        if(err)
            res.status(500).send(err)
        else {
            if(node) {
                if(node.total_user_amount <= req.body.amount) {
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
                    res.stastus(400).send(`insufficient balance`)
            }
            else
                res.status(400).send(`Node not found`)
        }
    })
});

router.post('withdrawl', passport.authenticate('jwt-user',{ session: false }), (req, res) => { 
    var sql = `SELECT  users_nodes_rewards.* FROM users_nodes_rewards 
            INNER JOIN nodes ON nodes.id = users_nodes_rewards.node_id
            INNER JOIN tokens ON tokens.id = nodes.token_id
            WHERE users_nodes_rewards.node_id = '${req.body.node_id}' AND users_nodes_rewards.user_id = '${req.user.id}' AND users_nodes_rewards.withdrawl_at IS NULL  `
    mysql.select(sql, (err, users_nodes_rewards) => {
        if(err)
            res.status(500).send(err)
        else {
            if(users_nodes_rewards.length > 0) {
                var total_money = 0;
                for(var i=0; i < users_nodes_rewards.length; i++) {
                    total_money += users_nodes_rewards[i].amount
                }
                var sql = `UPDATE users_nodes_rewards set withdrawl = ? WHERE node_id = '${req.body.node_id}' AND user_id = '${req.user.id}'`
                mysql.update(sql,[
                    new Date().toISOString().slice(0, 19).replace('T', ' ')
                ], (err, effect_row) => {
                    if(err)
                        res.status(500).send(err)
                    else {
                        
                        res.status(200).json({
                            message: "success"
                        })
                    }
                });
               
            }
            else
                res.status(400).send(`Next payment in 36 hours`)
        }
    })
});



module.exports = router;