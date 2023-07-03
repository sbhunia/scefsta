'use strict';
const mysqlLib = require('../../config_database/mysqlLib')
import * as Constants from '../constants'

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getSalt(req, res)
        }
        case 'POST': {
            return addSalt(req, res)
        }
        case 'DELETE': {
            return deleteSalt(req, res)
        }
    }
}

async function addSalt(req, res) {
    let walletId = JSON.parse(req.body)['walletId'];
    let patientId = JSON.parse(req.body)['patientId'];
    let bidId = JSON.parse(req.body)['bidId'];
    let saltVal = JSON.parse(req.body)['saltVal'];

    let query = "   INSERT INTO " + Constants.Salts + " (   " + Constants.walletId + ", " + Constants.patientId + ", " + Constants.bidId + ", \
                                                            " + Constants.saltVal + ") \
                    VALUES ('" + walletId + "', '" + patientId + "', '" + bidId + "', '" + saltVal + "');";

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            //console.log(d);
            res.status(200).send({success: true});
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({success: false});
            resolve();
        }); 
    });
}

// Queries the database for police and returns the results
async function getSalt(req, res) {
    let walletId = JSON.parse(req.body)['walletId'];
    let patientId = JSON.parse(req.body)['patientId'];
    let bidId = JSON.parse(req.body)['bidId'];

    let query = "   SELECT  " + Constants.saltId + ", " + Constants.walletId + ", " + Constants.patientId + ",    \
                            " + Constants.saltVal + ", " + Constants.bidId + "                                    \
                    FROM    " + Constants.Salts + "                                                       \
                    WHERE   " + Constants.walletId + " = " + walletId + " AND                                 \
                            " + Constants.patientId + " = " + patientId + " \
                            " + Constants.bidId + " = " + bidId + ";";

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            //console.log(d);
            res.status(200).send(d);
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({success: false})
            resolve();
        });  
    });
}

// Deletes police from the database
async function deleteSalt(req, res) {
    let walletId = JSON.parse(req.body)['walletId'];
    let patientId = JSON.parse(req.body)['patientId'];
    let bidId = JSON.parse(req.body)['bidId'];

    let query = "   DELETE FROM " + Constants.Salts + " \
                    WHERE   " + Constants.walletId + " = " + walletId + " AND                                 \
                    " + Constants.patientId + " = " + patientId + " \
                    " + Constants.bidId + " = " + bidId + ";";

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            //console.log(d);
            res.status(200).send({success: true});
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({success: false});
            resolve();
        }); 
    });
}
