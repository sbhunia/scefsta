// import clientPromise from  '../../util/mongodb'
'use strict';
const mysqlLib = require('../../config_database/mysqlLib')
import * as Constants from '../constants';

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getHospitals(req, res)
        }
        case 'POST': {
            return addHospital(req, res)
        }
        case 'DELETE': {
            return deleteHospital(req, res)
        }
    }
}

async function addHospital(req, res) {

    let hospitalSystem = JSON.parse(req.body)["hospitalSystem"];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let walletId = JSON.parse(req.body)["walletId"];

    let query = "   INSERT INTO " + Constants.Users + " (" + Constants.walletId + ", " + Constants.address + ", " + Constants.city + ", " + Constants.state + ", " + Constants.hospitalSystem + ") \
                    VALUES ('" + walletId + "', '" + address + "', '" + city + "', '" + state + "', '" + hospitalSystem + "' );";
    console.log(query);
    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            console.log(d);
            res.status(200).send({success: true});
            resolve();
        }).catch(e => {
            console.log(e);
            let fail = {success: false};
            res.status(500).send(fail);
            resolve();
        }); 
    });
}

// Queries the database for hospitals and reuturns the results
async function getHospitals(req, res) {
    //console.log(req.query.printerModel);
    //console.log('inside get function');

    let query = "   SELECT  *, " + Constants.walletId + ", " + Constants.address + ", " + Constants.city + ", " + Constants.state + ", " + Constants.hospitalSystem + "      \
                    FROM    " + Constants.Users + "                                               \
                    WHERE   " + Constants.hospitalSystem + "  IS NOT NULL ";

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            //console.log(d);
            res.status(200).send(d)
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({success: false});
            resolve();
        });
    });
}

// Deletes hospitals from the database
async function deleteHospital(req, res) {

    let walletIds = JSON.parse(req.body)
    let formattedWalletIds = "'" + walletIds.join("','") + "'";

    let query = "   DELETE FROM " + Constants.Users + " \
                    WHERE " + Constants.walletId +" \
                    IN (" + formattedWalletIds +");"

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