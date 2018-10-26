var express = require('express'),
    router = express.Router(),
    mysql = require('../../services/mysqldb'),
    Joi = require('joi'),
    jwt = require('jsonwebtoken'),
    passport = require("passport"),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto');

const saltRounds = 10;

router.get('/', passport.authenticate('jwt-admin',{ session: false }), (req, res) => { 
    var sql = `SELECT id, first_name, last_name, email, (CASE WHEN is_active THEN 'Yes' ELSE 'No' END) as is_active FROM admin_users WHERE deleted_at IS NULL`
    mysql.select(sql, (err, admins) => {
        if(err)
            res.status(500).send(err);
        else {
            if(admins && admins.length > 0)
                res.status(200).send(admins);
            else
                res.status(400).send(`Admin Users not found`);
        }
    })
});

router.post('/add', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
     var valid_schema = Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string(),
        is_active: Joi.number().max(1).min(0)
    });
    Joi.validate({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email : req.body.email,
        password : req.body.password,
        is_active : req.body.is_active
    }, valid_schema, (err, value) => {
        if(err) {
            res.status(400).send("Please fill all the require fields");
        }
        else {
            var sql = `SELECT 1 FROM admin_users where email = '${value.email}'`
            mysql.selectOne(sql, (err ,admin) => {
                if(err)
                    res.status(500).send(`Error occured: ${err}`);
                else {
                    if(admin)
                        res.status(400).send("Admin User with this email Already exist");
                    else {
                        bcrypt.hash(value.password, saltRounds, (err, hash) => {
                            if(err)
                                res.status(500).send("Error occured: " + err);
                            else {
                                mysql.insertOne('admin_users',{
                                    first_name: value.first_name,
                                    last_name: value.last_name,
                                    email: value.email,
                                    password: hash,
                                    is_active: value.is_active,
                                    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                                }, (err, admin_user_id) => {
                                    if(err)
                                        res.status(500).send(`Error occured: ${err}`);
                                    else {
                                        res.status(200).json({id: admin_user_id});
                                    }
                                })
                            }
                        });
                    }
                }
            })
        }
    });           
});

router.get('/view/:id', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
    if(req.params.id) {
        var sql = `SELECT id, first_name, last_name, email, (CASE WHEN is_active THEN 'Yes' ELSE 'No' END) AS is_active FROM admin_users WHERE id = '${req.params.id}' AND deleted_at IS NULL`
        mysql.selectOne(sql, (err, admin_user) => {
            if(err)
                res.status(500).send(`Error: ${err}`);
            else {
                if(!admin_user)
                    res.status(400).send("Admin user not found");
                else {
                    res.status(200).send(admin_user);
                }
            }
        })
    }
    else
        res.status(400).send("id not found")
});

router.get('/edit/:id', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
    if(req.params.id) {
        var sql = `SELECT id, first_name, last_name, email, is_active FROM admin_users WHERE id = '${req.params.id}' AND deleted_at IS NULL`
        mysql.selectOne(sql, (err, admin_user) => {
            if(err)
                res.status(500).send(`Error: ${err}`);
            else {
                if(!admin_user)
                    res.status(400).send("Admin user not found");
                else {
                    res.status(200).send(admin_user);
                }
            }
        })
    }
    else
        res.status(400).send("id not found")
});

router.post('/edit/', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
     var valid_schema = Joi.object().keys({
        id: Joi.string().max(36).required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        is_active: Joi.number().max(1).min(0)
    });
    Joi.validate({
        id: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email : req.body.email,
        is_active: req.body.is_active
    }, valid_schema, (err, value) => {
        if(err) {
            res.status(400).send("Please fill all the require fields");
        }
        else {
            var sql = `SELECT * FROM admin_users WHERE id='${value.id}' AND deleted_at IS NULL`;
            mysql.selectOne(sql, (err, admin) => {
                if(err)
                    res.status(500).send(err);
                else {
                    if(admin) {
                        if(value.email && value.email != admin.email) {
                            sql = `SELECT 1 FROM admin_users where email = '${value.email}'`
                            mysql.selectOne(sql, (err ,email_exist) => {
                                if(err)
                                    res.status(500).send(`Error occured: ${err}`);
                                else {
                                    if(email_exist)
                                        res.status(400).send("Admin User with this email Already exist");
                                    else {
                                        if(req.body.password) {
                                            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                                                if(err)
                                                    res.status(500).send("Error occured: " + err);
                                                else {
                                                    sql = `UPDATE admin_users SET first_name = ?, last_name = ? email = ?, password = ?, is_active = ? WHERE id = '${admin.id}' AND deleted_at IS NULL`;
                                                    mysql.updateOne(sql,[
                                                        value.first_name,
                                                        value.last_name,
                                                        value.email,
                                                        hash,
                                                        value.is_active
                                                    ],(err, changed_rows) => {
                                                        if(err)
                                                            res.status(500).send(err);
                                                        else
                                                            res.status(200).json({message: `Admin user updated successfully`});
                                                    })
                                                }
                                            });
                                        }
                                        else {
                                            sql = `UPDATE admin_users SET first_name = ?, last_name = ?, email = ?, is_active = ? WHERE id = '${admin.id}' AND deleted_at IS NULL`;
                                            mysql.updateOne(sql,[
                                                value.first_name,
                                                value.last_name,
                                                value.email,
                                                value.is_active
                                            ],(err, changed_rows) => {
                                                if(err)
                                                    res.status(500).send(err);
                                                else
                                                    res.status(200).json({message: `Admin user updated successfully`});
                                            })
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            if(req.body.password) {
                                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                                    if(err)
                                        res.status(500).send("Error occured: " + err);
                                    else {
                                        sql = `UPDATE admin_users SET first_name = ?, last_name = ? , password = ?, is_active = ? WHERE id = '${admin.id}' AND deleted_at IS NULL`;
                                        mysql.updateOne(sql,[
                                            value.first_name,
                                            value.last_name,
                                            hash,
                                            value.is_active
                                        ],(err, changed_rows) => {
                                            if(err)
                                                res.status(500).send(err);
                                            else
                                                res.status(200).json({message: `Admin user updated successfully`});
                                        })
                                    }
                                });
                            }
                            else {
                                sql = `UPDATE admin_users SET first_name = ?, last_name = ?, is_active = ? WHERE id = '${admin.id}' AND deleted_at IS NULL`;
                                mysql.updateOne(sql,[
                                    value.first_name,
                                    value.last_name,
                                    value.is_active
                                ],(err, changed_rows) => {
                                    if(err)
                                        res.status(500).send(err);
                                    else
                                        res.status(200).json({message: `Admin user updated successfully`});
                                })
                            }
                        }
                    }
                    else
                        res.status(400).send(`Admin not found`);
                }
            })
        }
    });
});

router.post('/delete', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
    var valid_schema = Joi.object().keys({
        id: Joi.string().max(36).required()
    });
    Joi.validate({
        id: req.body.id
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `UPDATE admin_users SET deleted_at = ? WHERE id = '${value.id}' AND deleted_at IS NULL`;
            mysql.softDeleteOne(sql, (err, changed_rows) => {
                if(err)
                    res.status(500).send(`Error: ${err}`);
                else {
                    if(changed_rows)
                        res.status(200).json({message:`The Admin user was successfully deleted`})
                    else
                        res.status(400).send(`Admin User not found`)
                }
            })
        }
    });
});

router.post('/newpassword', passport.authenticate('jwt-admin',{ session: false }), (req, res) => {
    var valid_schema = Joi.object().keys({
        id: Joi.string().max(36).required(),
    });
    Joi.validate({
        id: req.body.id
    }, valid_schema, (err, value) => {
        if(err)
            res.status(400).send("Please feel all the require fields");
        else {
            var sql = `SELECT * FROM admin_users WHERE id= '${value.id}' AND deleted_at IS NULL`;
            mysql.selectOne(sql, (err, admin) => {
                if(err)
                    res.status(500).send(err);
                else {
                    if(admin) {
                        var newpassword = crypto.randomBytes(10).toString('hex');
                        bcrypt.hash(newpassword, saltRounds, (err, hash) => {
                            if(err)
                                res.status(500).send(`Error occured: ${err} `);
                            else {
                                var sql = `UPDATE admin_users SET password = ? WHERE id = "${admin.id}" AND deleted_at IS NULL`
                                mysql.updateOne(sql,[
                                    hash
                                ], (err, changed_rows) => {
                                    if(err)
                                        res.status(500).send(`Error occured: ${err} `);
                                    else {
                                        if(changed_rows) {
                                            emailLib.loadTemplate("generatepassword",{newpassword:newpassword}, (err,template) => {
                                                if(err)
                                                    res.status(500).send("Error occured: " + err.toString());
                                                else {
                                                    emailLib.send({ 
                                                        from: "From name",
                                                        to: admin.email,
                                                        subject: template.subject,
                                                        html: template.html,
                                                        text: template.text
                                                    });
                                                    res.status(200).send("A new password has been sent");
                                                }
                                            });                   
                                        }
                                        else
                                            res.status(400).send("Something went wrong. Please try again");
                                    }
                                });
                            }
                        });
                    }
                    else
                        res.status(400).send(`Admin not found`);
                }
            })
        }
    })
})

module.exports = router;