var express = require('express'),
    router = express.Router(),
    mysql = require('../../services/mysqldb'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken'),
    passport = require("passport"),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto');

const saltRounds = 10;

router.post('/login', (req, res) => {
    var valid_schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.required()
    });
    Joi.validate({
        email : req.body.email,
        password : req.body.password
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please fill all the require fields");
        else {
            var sql = `SELECT id, first_name, last_name, email, password, is_verified FROM users WHERE email = "${value.email}" `
            mysql.selectOne(sql, (err, user) => {
                if(err)
                    res.status(500).send(`Error occured: ${err} `);
                else {
                    if(user) {
                        bcrypt.compare(value.password, user.password, (err, response) => {
                            if(err)
                                res.status(500).send(`Error occured: ${err} `);
                            else {
                                if(response) {
                                    if(!user.is_verified)
                                        res.status(400).send('This Account is not verified. Please contact your Administrator');
                                    else {
                                        var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '24h' });
                                        var user_data = {
                                            full_name: `${user.first_name} ${user.last_name}`,
                                            is_verified : user.is_verified

                                        };
                                        var sql = `UPDATE users SET token = ?  WHERE id = '${user.id}' AND deleted_at IS NULL`;
                                        mysql.updateOne(sql,[
                                            token
                                        ], (err, changed_rows) => {
                                            if(err)
                                                res.status(500).send(`Error: ${err}`);
                                            else
                                                 res.status(200).json({token: "Bearer " + token, user: user_data});
                                                    
                                        })
                                    }
                                }
                                else
                                    res.status(400).send("The Email or Password you entered is not valid");
                            }
                        });
                    }
                    else
                        res.status(400).send("The Email or Password you entered is not valid");
                }
            })
        }
    });
});

module.exports = router;