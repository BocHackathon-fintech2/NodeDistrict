var passport = require('passport'),
    bcrypt = require('bcryptjs'),
    passportJWT = require("passport-jwt"),
    mysql = require('../../services/mysqldb'),

    ExtractJwt = passportJWT.ExtractJwt,
    JwtStrategy = passportJWT.Strategy;

module.exports = () => {
    passport.use('jwt-user',new JwtStrategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:process.env.JWT_SECRET,
    },(jwt_payload, next) => {
        var sql = `SELECT id FROM users WHERE users.id = '${jwt_payload.id}' AND deleted_at IS NULL`
        mysql.selectOne(sql, (err, user) => {
            if(err)
                next(null, false);
            else {
                if(user)
                    next(null, user)
                else
                   next("User Not found!", false); 
            }
        });
    }));
    
    passport.use('jwt-admin',new JwtStrategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:process.env.JWT_SECRET,
    },(jwt_payload, next) => {
        var sql = `SELECT id, is_active FROM admin_users WHERE admin_users.id = '${jwt_payload.id}' AND deleted_at IS NULL`
        mysql.selectOne(sql, (err, admin) => {
            if(err)
                next(null, false);
            else {
                if(!admin)
                    next("Admin Not found!", false);
                else {
                    if(!admin.is_active)
                        next("Admin User is not Active", false);
                    else
                        next(null, admin)
                }
            }
        });
    }));
};