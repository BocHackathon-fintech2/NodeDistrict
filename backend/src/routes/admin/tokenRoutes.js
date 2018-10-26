var express = require('express'),
    router = express.Router(),
    passport = require("passport"),
    mysql = require('../../services/mysqldb'),
    jwt = require('jsonwebtoken'),
    Joi = require('joi');

router.get('/', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var sql = `SELECT * FROM tokens WHERE tokens.deleted_at IS NULL ORDER BY title ASC`;
    mysql.select(sql, (err, tokens) => {
        if(err)
            res.status(500).send(`Error: ${err}`);
        else {
            if(tokens && tokens.length > 0)
                res.status(200).send(tokens)
            else
                res.status(400).send(`Tokens not found!`);
        }
    })
});

router.post('/add', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var valid_schema = Joi.object().keys({
        title: Joi.string().max(30).required(),
        symbol: Joi.string().max(4).required(),
        price: Joi.required()
    });
    Joi.validate({
        title: req.body.title,
        symbol: req.body.symbol,
        price: req.body.price
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send(err.details[0].message);
        else {
            mysql.insertOne("tokens",{
                title: value.title,
                symbol: value.symbol,
                price: value.price
            }, (err, token_id) => {
                if(err)
                    res.status(500).send(err);
                else {
                    res.status(200).json({id : token_id});
                }
            })
        }
    })
});


router.get('/view/:id', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    if(req.params.id) {
        var sql = `SELECT * FROM tokens WHERE id = '${req.params.id}' AND deleted_at IS NULL`
        mysql.selectOne(sql, (err, token) => {
            if(err)
                res.status(500).send(`Error: ${err}`);
            else {
                if(!token)
                    res.status(400).send("Token not found");
                else {
                    res.status(200).send(token);
                }
            }
        })
    }
    else
        res.status(400).send("id not found")
    
})

router.get('/edit/:id', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
     if(req.params.id) {
        var sql = `SELECT * FROM tokens WHERE id = '${req.params.id}'`
        mysql.selectOne(sql, (err, token) => {
            if(err)
                res.status(500).send(`Error: ${err}`);
            else {
                if(!token)
                    res.status(400).send("Token not found");
                else
                    res.status(200).send(token);
            }
        })
    }
    else
        res.status(400).send("id not found")
})

router.post('/edit', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
     var valid_schema = Joi.object().keys({
        id: Joi.required(),
        title: Joi.string().max(30).required(),
        symbol: Joi.string().max(4).required(),
        price: Joi.required()
    });
    Joi.validate({
        id: req.body.id,
        title: req.body.title,
        symbol: req.body.symbol,
        price: req.body.price
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `SELECT * FROM tokens WHERE id = '${value.id}'`
            mysql.selectOne(sql, (err, token) => {
                if(err)
                    res.status(500).send(`Error: ${err}`);
                else {
                    if(!token)
                        res.status(400).send("Token not found");
                    else {
                        var sql = `UPDATE tokens SET title = ?, symbol = ? WHERE id = '${value.id}' AND deleted_at IS NULL`;
                        mysql.updateOne(sql,[
                            value.title,
                            value.symbol,
                            value.price
                        ], (err, changed_rows) => {
                            if(err)
                                res.status(500).send(`Error: ${err}`);
                            else
                                res.status(200).json({message: `The Token was successfully updated`});
                        })    
                    }
                }
            });
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
            var sql = `UPDATE tokens SET deleted_at = ? WHERE id = '${value.id}' AND deleted_at IS NULL`;
            mysql.softDeleteOne(sql, (err, changed_rows) => {
                if(err)
                    res.status(500).send(`Error: ${err}`);
                else {
                    if(changed_rows)
                        res.status(200).json({message: `The Token was successfully deleted`})
                    else
                        res.status(400).send(`Token not found`)
                }
            })
        }
    });
})

module.exports = router;