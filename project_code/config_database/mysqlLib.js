// Must run npm install mysql

// Need to Add logging support

// Creates connection to database, and logs in as test user
const mysql = require('mysql');
//const logger = require('./databaseLogger.txt');
const mysqlConfig = {
  host: "ambulance-blockchain.sec.csi.miamioh.edu",
  port: 3306,
  user: "ais_user",
  password: "zebra",
  database: "AIS"
}

var pool = mysql.createPool(mysqlConfig);

module.exports.connect = function (cb) {
  return new Promise((resolve, reject) => {
    pool.on('connection', function (connection) {
      connection.on('error', function (err) {
        //logger.error('MySQL error event', err)
      });
      connection.on('close', function (err) {
        //logger.warn('MySQL close event', err)
      });
    });
    resolve()
  })
}

// Executes a query in the database thats passed in as a parameter
async function executeQuery (query) {
  //logger.debug(`query: `, query)
  return new Promise((resolve, reject) => {
    try{
      pool.query(query, (e, r, f) => {
        if(e){
          reject(e)
        }
        else{
          //logger.debug(r,f)
          resolve(r)
        }
      });
    }
    catch(ex){
      reject(ex)
    }
  })  
}

// Executes a desired store procedure
async function execSP(spName, params){
  return new Promise((resolve, reject) => {
    try{
      var paramPlaceHolder = ''
      if(params && params.length){
        for(var i = 0; i < params.length; i++){
          paramPlaceHolder += '?,'
        }
      }
      if(paramPlaceHolder.length){
        paramPlaceHolder = paramPlaceHolder.slice(0, -1)
      }
      //logger.debug('final SP call', `CALL ${spName}(${params})`)
      pool.query(`CALL ${spName}(${paramPlaceHolder})`, params, (e, r, f) => {
        if(e){
          reject(e)
        }
        else{
          resolve(r[0])
        }
      });
    }
    catch(ex){
      reject(ex)
    }
  })
}
module.exports.executeQuery = executeQuery
module.exports.execSP = execSP

// Run this in mysql if you get 'ER_NOT_SUPPORTED_AUTH_MODE' for the user your trying to connect with
// ALTER USER 'test'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// flush privileges;




