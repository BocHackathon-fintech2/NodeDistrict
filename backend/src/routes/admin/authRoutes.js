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
            var sql = `SELECT id, first_name, last_name, email, password, is_active FROM admin_users WHERE email = "${value.email}" `
            mysql.selectOne(sql, (err, admin) => {
                if(err)
                    res.status(500).send(`Error occured: ${err} `);
                else {
                    if(admin) {
                        bcrypt.compare(value.password, admin.password, (err, response) => {
                            if(err)
                                res.status(500).send(`Error occured: ${err} `);
                            else {
                                if(response) {
                                    if(!admin.is_active)
                                        res.status(400).send('This Account is not active. Please contact your Administrator');
                                    else {
                                        var token = jwt.sign({id: admin.id}, process.env.JWT_SECRET, { expiresIn: '24h' });
                                        var admin_data = {
                                            full_name: `${admin.first_name} ${admin.last_name}`,
                                            is_active : admin.is_active

                                        };
                                        var sql = `UPDATE admin_users SET token = ?  WHERE id = '${admin.id}' AND deleted_at IS NULL`;
                                        mysql.updateOne(sql,[
                                            token
                                        ], (err, changed_rows) => {
                                            if(err)
                                                res.status(500).send(`Error: ${err}`);
                                            else
                                                 res.status(200).json({token: "Bearer " + token, admin: admin_data});
                                                    
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