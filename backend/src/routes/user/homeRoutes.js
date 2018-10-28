var express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    mysql = require('../../services/mysqldb'),
    jwt = require('jsonwebtoken'),
    Joi = require('joi');


router.get('/', passport.authenticate('jwt-user',{ session: false }), (req, res) => { 
    var sql = `SELECT nodes.id,SUM(users_own_nodes.amount) AS total_amount,
            nodes.total_tokens AS node_total_tokens, nodes.daily_rewards, 
            nodes.token_id, tokens.symbol AS token_symbol FROM users_own_nodes 
            INNER JOIN nodes ON nodes.id = users_own_nodes.node_id
            INNER JOIN tokens ON tokens.id = nodes.token_id
            WHERE users_own_nodes.user_id = '${req.user.id}' AND nodes.deleted_at IS NULL GROUP BY nodes.id`
    mysql.select(sql, (err, nodes) => {
        if(err)
            res.status(500).send(err);
        else {
            sql = `SELECT users_nodes_rewards.*, nodes.title FROM users_nodes_rewards 
            INNER JOIN nodes ON nodes.id = users_nodes_rewards.node_id
            WHERE users_nodes_rewards.user_id = '${req.user.id}'`
            mysql.select(sql, (err, user_nodes_rewards) => {
                if(err)
                    res.status(500).send(err)
                else {
                    res.status(200).json({
                        nodes: nodes,
                        user_nodes_rewards: user_nodes_rewards
                    })
                }
            })
        }
    })
});


module.exports = router;