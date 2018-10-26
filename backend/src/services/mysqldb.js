var mysql = require('mysql');
var uuidv1 = require('uuid/v1');

//- Connection configuration
var db_config = {
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
};

////- Create the connection variable
//let connection = mysql.createConnection(db_config);
//
//
////- Establish a new connection
//connection.connect((err) =>{
//    if(err) {
//        // mysqlErrorHandling(connection, err);
//        console.log("\n\t *** Cannot establish a connection with the database. ***");
//
//        connection = reconnect(connection);
//    }else {
//        console.log("\n\t *** New connection established with the database. ***")
//    }
//});

//- Reconnection function
var reconnect = (connection) => {
    console.log("\n New connection tentative...");

    //- Destroy the current connection variable
    if(connection) connection.destroy();

    //- Create a new one
    var connection = mysql.createConnection(db_config);

    //- Try to reconnect
    connection.connect(function(err){
        if(err) {
            //- Try to connect every 2 seconds.
            setTimeout(reconnect, 2000);
        }else {
            console.log("\n\t New connection established with the database.")
            return connection;
        }
    });
}

////- Error listener
//connection.on('error', (err) => {
//
//    //- The server close the connection.
//    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
//        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//        connection = reconnect(connection);
//    }
//
//    //- Connection in closing
//    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
//        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//        connection = reconnect(connection);
//    }
//
//    //- Fatal error : connection variable must be recreated
//    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
//        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//        connection = reconnect(connection);
//    }
//
//    //- Error because a connection is already being established
//    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
//        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//    }
//
//    //- Anything else
//    else{
//        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//        connection = reconnect(connection);
//    }
//
//});

module.exports = {
    beginTransaction: (cb) => {
        var connection = mysql.createConnection(db_config);
        connection.beginTransaction((err) => {
            if(err)
                cb(err, null)
            else
                cb(null, connection);
        })  
    },
    closeConnection: (conn, cb) => {
        conn.end();
        cb(null, true);
    },
    rollback: (conn, cb) => {
        conn.rollback(() => {
            cb(true)
            conn.end();
        })
    },
    commit: (conn, cb) => {
        conn.commit((err) => {
            if(err) {
                conn.rollback(() => {
                    cb(err, null) 
                    conn.end();
                })
            }
            else {
                cb(null, true);
                conn.end();
            }
        })
    },
	select: (sql, cb) => {
        var connection = mysql.createConnection(db_config);
		connection.query(sql, (err, results, fields) => {
			if(err)
				cb(err, null)
			else
				cb(null, results)

            connection.end();
		});
	},
    
    selectWithConn: (conn, sql, cb) => {
		conn.query(sql, (err, results, fields) => {
			if(err)
				cb(err, null)
			else
				cb(null, results)
		});
    },
    
	selectOne : (sql, cb) => {
        var connection = mysql.createConnection(db_config);
		connection.query(`${sql} LIMIT 1`, (err, results, fields) => {
			if(err)
				cb(err, null)
			else
				cb(null, results[0])
            

            connection.end();
		});
	},
    
    selectOneWithConn: (conn, sql, cb) => {
		conn.query(`${sql} LIMIT 1`, (err, results, fields) => {
			if(err)
				cb(err, null)
			else
				cb(null, results[0])
		});
    },
    
    insert: (table,columns,values, cb) => {
        var connection = mysql.createConnection(db_config);
        var sql_insert_columns = "";
        
        for(var i =0; i < columns.length; i++) {
            if(i == 0) {
                sql_insert_columns += `${columns[i]}`;
            }
            else {
                sql_insert_columns += `, ${columns[i]}`;
            }
        }
        connection.query(`INSERT INTO ${table} (${sql_insert_columns}) VALUES  ?`, [values] , (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, true)
            
            connection.end();
        });
    },
    
    insertWithConn: (conn, table, columns, values, cb) => {
        var sql_insert_columns = "";
        
        for(var i =0; i < columns.length; i++) {
            if(i == 0) {
                sql_insert_columns += `${columns[i]}`;
            }
            else
                sql_insert_columns += `, ${columns[i]}`;
        }
        conn.query(`INSERT INTO ${table} (${sql_insert_columns}) VALUES  ?`, [values] , (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, true)
        });
    },

    insertOne: (table, values, cb) => {
        var connection = mysql.createConnection(db_config);
        values['id'] = uuidv1();
        connection.query(`INSERT INTO ${table} SET ?`, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, values.id)
            
            connection.end();
        });
    },
    
    insertOneWithConn: (conn, table, values, cb) => {
        values['id'] = uuidv1();
        conn.query(`INSERT INTO ${table} SET ?`, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, values.id)
        });
    },
    
    insertOneNoId: (table, values, cb) => {
        var connection = mysql.createConnection(db_config);
        connection.query(`INSERT INTO ${table} SET ?`, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results)
            
            connection.end();
        });
    },
    
    insertOneNoIdWithConn: (conn, table, values, cb) => {
        conn.query(`INSERT INTO ${table} SET ?`, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results)
        });
    },
    
    update: (sql, values, cb) => {
        var connection = mysql.createConnection(db_config);
        connection.query(`${sql} `, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.changedRows)
            
            connection.end();
        });
    },
    updateWithConn: (conn, sql, values, cb) => {
        conn.query(`${sql} `, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.changedRows)
        });
    },
    
    updateOne: (sql, values, cb) => {
        var connection = mysql.createConnection(db_config);
        connection.query(`${sql} LIMIT 1`, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.changedRows)
            
            connection.end();
        });
    },
    
    updateOneWithConn: (conn, sql, values, cb) => {
        conn.query(`${sql} LIMIT 1`, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.changedRows)
        });
    },
    
    insertOrUpdateOneNoIdWithConn: (conn, table, values, cb) => {
        var sql_update_columns = "";
        var first_key = false;
        for(var key in values) {
            if(!first_key) {
                sql_update_columns += `${key} = VALUES(${key})`
                first_key = true;
            }
            else
                sql_update_columns += `, ${key} = VALUES(${key})`
        }
        conn.query(`INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ${sql_update_columns} `, values, (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results)
        });
    },
    
    insertOrUpdate: (table, columns, values, cb) => {
        var connection = mysql.createConnection(db_config);
        var sql_insert_columns = "";
        var sql_update_columns = "";
        
        for(var i=0; i < values.length; i++) {
            if(!typeof values[i].id) {
                values[i]["id"] = uuidv1()
            }
        }
        
        for(var i =0; i < columns.length; i++) {
            if(i == 0) {
                sql_insert_columns += `${columns[i]}`;
                sql_update_columns += `${columns[i]} = VALUES(${columns[i]})`
            }
            else {
                sql_insert_columns += `, ${columns[i]}`;
                 sql_update_columns += `, ${columns[i]} = VALUES(${columns[i]})`
            }
        }
        connection.query(`INSERT INTO ${table} (${sql_insert_columns}) VALUES  ? ON DUPLICATE KEY UPDATE ${sql_update_columns} `, [values] , (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, true)
            
            connection.end();
        });
    },
    
    insertOrUpdateWithConn: (conn, table, columns, values, cb) => {
        var sql_insert_columns = "";
        var sql_update_columns = "";
        
        for(var i=0; i < columns.length; i++) {
            if(i == 0) {
                sql_insert_columns += `${columns[i]}`;
                sql_update_columns += `${columns[i]} = VALUES(${columns[i]})`
            }
            else {
                sql_insert_columns += `, ${columns[i]}`;
                 sql_update_columns += `, ${columns[i]} = VALUES(${columns[i]})`
            }
        }
        conn.query(`INSERT INTO ${table} (${sql_insert_columns}) VALUES  ? ON DUPLICATE KEY UPDATE ${sql_update_columns} `, [values] , (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, true)
        });
    },

    
    delete: (sql, cb) => {
        var connection = mysql.createConnection(db_config);
        connection.query(`${sql}`, (err, results, fields) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.affectedRows)
            
            connection.end();
        })
    },
    
    deleteWithConn: (conn, sql, cb) => {
        conn.query(`${sql}`, (err, results, fields) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.affectedRows)
        })
    },
    
    deleteOne: (sql, cb) => {
        var connection = mysql.createConnection(db_config);
        connection.query(`${sql} LIMIT 1`, (err, results, fields) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.affectedRows)
            
            connection.end();
        })
    },
    
    deleteOneWithConn: (conn, sql, cb) => {
        conn.query(`${sql} LIMIT 1`, (err, results, fields) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.affectedRows)
        })
    },
    
    deleteMultipleByIDWithConn: (conn ,table, values, cb) => {
        var in_values = "";
        for(var i=0; i < values.length; i++) {
            if(i == 0) {
                in_values += `'${values[i]}'`;
            }
            else {
                in_values += `, '${values[i]}'`;
            }
        }
        
        conn.query(`DELETE from ${table} WHERE id IN (${in_values});`, (err, results, fields) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.affectedRows)
        })
    },
    
    softDeleteOne: (sql, cb) => {
        var connection = mysql.createConnection(db_config);
        connection.query(`${sql} LIMIT 1`, [new Date()], (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.changedRows)
            
            connection.end();
        });
    },
    
    softDeleteOneWithConn: (conn, sql, cb) => {
        var connection = mysql.createConnection(db_config);
        conn.query(`${sql} LIMIT 1`, [new Date()], (err, results, field) => {
            if(err)
                cb(err, null)
            else
                cb(null, results.changedRows)
            
            connection.end();
        });
    }
    
    
};

