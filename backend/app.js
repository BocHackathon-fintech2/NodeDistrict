const os = require('os');
const cluster = require('cluster');

if(cluster.isMaster) {
    // Master process
    var n_cpus = os.cpus().length;
 
    console.log(`Forking ${n_cpus} CPUs`);
    for(var i=0; i < n_cpus; i++) {
        cluster.fork();
    }
}
else {

    var express = require('express'),
        bodyParser = require('body-parser'),
        helmet = require('helmet'),
        cors = require('cors'),
        path = require('path'),
        https = require('https'),
        fs = require('fs'),
        app = express();

    require('dotenv').config();

    const port = process.env.PORT;

    var adminAuthRouter = require('./src/routes/admin/authRoutes'),
        adminAdminUserRouter = require('./src/routes/admin/adminUsersRoutes'),
        adminUserRouter = require('./src/routes/admin/userRoutes'),
        adminTokenRouter = require('./src/routes/admin/tokenRoutes'),
        adminNodeRouter = require('./src/routes/admin/nodeRoutes');
    
    var userAuthRouter = require('./src/routes/user/authRoutes'),
        userHomeRouter = require('./src/routes/user/homeRoutes'),
        userBuyRouter = require('./src/routes/user/buyRoutes');

    app.use(helmet()); // helping to secure express app
    app.use(bodyParser.json({limit: '50mb'})); // checking if a package coming as a json
    app.use(bodyParser.urlencoded({ extended: false }));

    const originsWhitelist = [
        'http://localhost:4200'
    ];

    const corsOptions = {
      origin: function(origin, callback){
            var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
      },
      credentials:true
    }

    app.use(cors(corsOptions));

    require('./src/config/passport')(app);
    
    app.use('/admin/auth', adminAuthRouter);
    app.use('/admin/users', adminUserRouter);
    app.use('/admin/admin-users', adminAdminUserRouter);
    app.use('/admin/tokens', adminTokenRouter);
    app.use('/admin/nodes', adminNodeRouter);

    app.use('/user/auth', userAuthRouter);
    app.use('/user/home', userHomeRouter);
    app.use('/user/buy', userBuyRouter);
    
    app.use("/public", express.static(path.join(__dirname, 'public')));

    // running the server
    app.listen(port, (err) => {
        var pid = process.pid;
        console.log(`running server process ${pid} on port ${port}`);
    });
}
