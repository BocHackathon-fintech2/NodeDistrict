var express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    mysql = require('../../services/mysqldb'),
    jwt = require('jsonwebtoken'),
    request = require('request'),
    Joi = require('joi');

router.get('/', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var sql = `SELECT nodes.*, tokens.symbol FROM nodes 
            INNER JOIN tokens ON tokens.id = nodes.token_id
            WHERE nodes.deleted_at IS NULL AND tokens.deleted_at IS NULL ORDER BY title ASC`;
    mysql.select(sql, (err, nodes) => {
        if(err)
            res.status(500).send(`Error: ${err}`);
        else {
            if(nodes && nodes.length > 0)
                res.status(200).send(nodes)
            else
                res.status(400).send(`Nodes not found!`);
        }
    })
});

router.get('/add', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
    var sql = `SELECT tokens.* FROM tokens WHERE tokens.deleted_at IS NULL ORDER BY title ASC`
    mysql.select(sql, (err, tokens) => {
        if(err)
            res.status(500).send(err)
        else
            res.status(200).json({tokens: tokens})
    })
})

router.post('/add', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var valid_schema = Joi.object().keys({
        title: Joi.string().required(),
        token_id: Joi.string().required(),
        total_tokens: Joi.required(),
        daily_rewards: Joi.required()
    });
    Joi.validate({
        title: req.body.title,
        token_id: req.body.token_id,
        total_tokens: req.body.total_tokens,
        daily_rewards: req.body.daily_rewards
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send(err.details[0].message);
        else {
            mysql.insertOne("nodes",{
                title: value.title,
                token_id: value.token_id,
                total_tokens: value.total_tokens,
                daily_rewards: value.daily_rewards,
            }, (err, node_id) => {
                if(err)
                    res.status(500).send(err);
                else {
                    res.status(200).json({id : node_id});
                }
            })
        }
    })
});


router.get('/view/:id', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    if(req.params.id) {
        var sql = `SELECT nodes.*, tokens.title as token_title, tokens.symbol AS token_symbol FROM nodes
            INNER JOIN tokens ON tokens.id = nodes.token_id
            WHERE nodes.id = '${req.params.id}' AND tokens.deleted_at IS NULL AND nodes.deleted_at IS NULL`
        mysql.selectOne(sql, (err, node) => {
            if(err)
                res.status(500).send(`Error: ${err}`);
            else {
                if(!node)
                    res.status(400).send("Node not found");
                else {
                    sql = `SELECT users_own_nodes.*, users.first_name, users.last_name FROM users_own_nodes 
                            INNER JOIN users ON users.id = users_own_nodes.user_id
                            WHERE node_id = '${node.id}'`
                    mysql.select(sql, (err, users_own_nodes) => {
                        if(err)
                            res.status(500).send(err)
                        else {
                            sql = `SELECT * FROM users_nodes_rewards WHERE node_id = '${node.id}'`
                            mysql.select(sql, (err, users_nodes_rewards) => {
                                if(err)
                                    res.status(500).send(err)
                                else {
                                    res.status(200).json({
                                        node: node,
                                        users_own_nodes: users_own_nodes,
                                        users_nodes_rewards: users_nodes_rewards
                                    });
                                }
                            });
                        }
                    })
                }
            }
        })
    }
    else
        res.status(400).send("id not found")
    
})

router.get('/edit/:id', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
     if(req.params.id) {
        var sql = `SELECT * FROM nodes WHERE id = '${req.params.id}' AND deleted_at IS NULL`
        mysql.selectOne(sql, (err, node) => {
            if(err)
                res.status(500).send(`Error: ${err}`);
            else {
                if(!node)
                    res.status(400).send("Node not found");
                else {
                    sql = `SELECT * FROM tokens WHERE deleted_at IS NULL`;
                    mysql.select(sql, (err, tokens) => {
                        if(err)
                            res.status(500).send(err)
                        else {
                            res.status(200).json({
                                node: node,
                                tokens: tokens
                            })
                        }
                    })
                }
            }
        })
    }
    else
        res.status(400).send("id not found")
})

router.post('/edit', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
     var valid_schema = Joi.object().keys({
        id: Joi.required(),
        title: Joi.string().required(),
        token_id: Joi.string().required(),
        total_tokens: Joi.required(),
        daily_rewards: Joi.required()
    });
    Joi.validate({
        id: req.body.id,
        title: req.body.title,
        token_id: req.body.token_id,
        total_tokens: req.body.total_tokens,
        daily_rewards: req.body.daily_rewards
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `SELECT * FROM nodes WHERE id = '${value.id}' AND deleted_at IS NULL`
            mysql.selectOne(sql, (err, node) => {
                if(err)
                    res.status(500).send(err)
                else {
                    if(node) {
                        var sql = `SELECT * FROM tokens WHERE id = '${value.token_id}' AND deleted_at IS NULL`
                        mysql.selectOne(sql, (err, token) => {
                            if(err)
                                res.status(500).send(`Error: ${err}`);
                            else {
                                if(!token)
                                    res.status(400).send("Token not found");
                                else {
                                    var sql = `UPDATE nodes SET title = ?, token_id = ?, total_tokens = ?, daily_rewards = ? WHERE id = '${value.id}' AND deleted_at IS NULL`;
                                    mysql.updateOne(sql,[
                                        value.title,
                                        value.token_id,
                                        value.total_tokens,
                                        value.daily_rewards
                                    ], (err, changed_rows) => {
                                        if(err)
                                            res.status(500).send(`Error: ${err}`);
                                        else
                                            res.status(200).json({message: `The Node was successfully updated`});
                                    })    
                                }
                            }
                        });
                    }
                    else
                        res.status(500).send(`Node not found`);
                }
            })
        }
    });
    
});

router.post('/deploy', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var valid_schema = Joi.object().keys({
        id: Joi.required()
    });
    Joi.validate({
        id: req.body.id
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `SELECT * FROM nodes WHERE id='${value.id}' AND deployment_at IS NULL`;
            mysql.selectOne(sql, (err, node) => {
                if(err)
                    res.status(500).send(err);
                else {
                    if(node) {

                        request.get(
                            'http://51.136.17.64:5000/api/nodes/deploy?nodeid=1&image=ce1788a5d212',(error, response, body) => {
                                if (!error && response.statusCode == 200) {
                                    console.log(error);
                                    console.log(body);
                                    request.get(
                                        'http://51.136.17.64:5000/api/nodes/start?nodeid=1',(error, response, body) => {}
                                    );    
                                      sql = `UPDATE nodes SET deployment_at = ? WHERE id = '${value.id}'`
                                        mysql.updateOne(sql,[
                                            new Date().toISOString().slice(0, 19).replace('T', ' ')
                                            ], (err, changed_rows) => {
                                            if(err)
                                                res.status(500).send(err)
                                            else {
                                                res.status(200).json({meesage: "ok"});
                                            }
                                    })
                                }
                            }
                        );
                                                

                      
                    }
                    else
                        res.status(500).send(`Node not found or is already deployed`)
                }
            })
        }
    });
});

router.post('/destroy', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var valid_schema = Joi.object().keys({
        id: Joi.required()
    });
    Joi.validate({
        id: req.body.id
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `SELECT * FROM nodes WHERE id='${value.id}' AND deployment_at IS NOT NULL`;
            mysql.selectOne(sql, (err, node) => {
                if(err)
                    res.status(500).send(err);
                else {
                    if(node) {

                        request.get(
                            'http://51.136.17.64:5000/api/nodes/stop?nodeid=1',(error, response, body) => {
                                if (!error && response.statusCode == 200) {
                                    console.log(error);
                                    console.log(body);
                                    sql = `UPDATE nodes SET deployment_at = ? WHERE id = '${value.id}'`
                                        mysql.updateOne(sql,[
                                            null
                                            ], (err, changed_rows) => {
                                            if(err)
                                                res.status(500).send(err)
                                            else {
                                                res.status(200).json({meesage: "ok"});
                                            }
                                    })
                                }
                            }
                        );
         
                    }
                    else
                        res.status(500).send(`Node not found or is already deployed`)
                }
            })
        }
    });
});

router.post('/delete', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
     var valid_schema = Joi.object().keys({
        id: Joi.required()
    });
    Joi.validate({
        id: req.body.id
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `UPDATE nodes SET deleted_at = ? WHERE id = '${value.id}' AND deleted_at IS NULL`;
            mysql.softDeleteOne(sql, (err, changed_rows) => {
                if(err)
                    res.status(500).send(`Error: ${err}`);
                else {
                    if(changed_rows)
                        res.status(200).json({message: `The Node was successfully deleted`})
                    else
                        res.status(400).send(`Node not found`)
                }
            })
        }
    });
})

module.exports = router;