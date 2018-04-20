let pg = require('pg'),
    logger = require('./../logger'),
    jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
    dbConfig = require('./../config/config_loader')[process.env.NODE_ENV || 'DEV'].db;


const initProperties = function(){

    if (process.env.NODE_ENV == "PROD") {
        const params = url.parse(process.env.DATABASE_URL || 'postgres://romvbjsleexqyx:9a6dfa433b3c829f4a66b7134de3a38cbc6165701f4cccf3e721554a18f887a9@ec2-54-247-99-159.eu-west-pg.js.compute.amazonaws.com:5432/d2il4m4csbg6oi');
        const auth = params.auth.split(':');
        this._host = params.hostname;
        this._user = auth[0];
        this._password = auth[1];
        this._database = params.pathname.split('/')[1];
        this.ssl = true;
    } else {
        this._host = dbConfig.host;
        this._user = dbConfig.username;
        this._password = dbConfig.password;
        this._database = dbConfig.database;
        this.ssl = false;
    }
    this.establishConnection()
};

const establishConnection = function(){
    // logger.info('DBHandler.prototype.establishConnection');
    if (this._pool) {
        // logger.info('DBHandler.prototype.establishConnection', 'DB Already connected');
        return;
    }
    this._pool = new pg.Pool({
        user: this._user,           // name of the user account
        host: this._host,           // name of the database
        database: this._database,
        password: this._password,
        port: 5432,
        max: 15,                    // max number of clients in the pool
        // idleTimeoutMillis: 5000,
        // reapIntervalMillis: 10000,
        application_name: 'tajurba',
        // refreshIdle: true,
        // ssl: this.ssl
    });
    this._pool.on('error', function (e, client) {
        // logger.info("DBHandler.prototype.establishConnection - Idle client error", e);
    });
};

var login = (data,successCb,errorCb)=>{
    // let query = "SELECT * FROM users WHERE username = $1 AND password = $2;";
    let query = "SELECT * FROM users WHERE username = $1;";
    self.getConnection((err,connection,done)=>{
        if(err){
            console.log(err)
            errorCb(err)
            done(err)
        }
        else {
            self.execLoginQuery(err, connection, done, query,[data.username/*, data.password*/], successCb, errorCb)
        }
    })
};

const getConnection = (callback)=>{
    self._pool.connect((err,connection,done)=>{
        callback(err,connection,done)
    })
}

const execLoginQuery = (err,connection,done,query,parm,successCb,errorCb)=>{
    connection.query(query,parm,(err,rows)=>{
        if(err) {
            errorCb.call(this, err)
            done(err)
        }
        else {
            let token = jwt.sign({ id: rows.rows[0].uid }, 'superSecret', {
                expiresIn: 86400 // expires in 24 hours
            });
            rows.rows[0].token = token
            let tokenQuery = 'UPDATE users SET token=$1 WHERE username = $2'
            self.updateToken(err,connection,done,tokenQuery,[token,parm[1]],successCb,errorCb)
        }
    })
}

const updateToken = (err,connection,done,query,parm,successCb,errorCb)=>{
    connection.query(query,parm,(err,rows)=>{
        if(err) {
            errorCb.call(this, err)
            done(err)
        }
        else {
            successCb.call(this, rows.command == 'UPDATE' ? rows.rowCount : rows.rows)
            done()
        }
    })
}

const execQuery = (err,connection,done,query,parm,successCb,errorCb)=>{
    connection.query(query,parm,(err,rows)=>{
        if(err) {
            errorCb.call(this, err)
            done(err)
        }
        else {
            successCb.call(this, rows.command == 'UPDATE' ? rows.rowCount : rows.rows)
            done()
        }
    })
}

var self = module.exports = {
    _host : null,
    _user : null,
    _password : null,
    _database : null,
    ssl : false,
    _pool : null,

    initProperties ,
    establishConnection ,
    login ,
    getConnection ,
    execQuery,
    updateToken,
    execLoginQuery,
}