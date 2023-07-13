'use strict';
const mysqlLib = require('../../config_database/mysqlLib')
import * as Constants from '../constants';

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getPolice(req, res)
        }
        case 'POST': {
            let header = JSON.parse(req.header)['X-method'];
            if (header === "emergency") {
                return addPolice(req, res);
            } else if (header === "private") {
                return addPrivate(req, res);
            } else if (header === "interfacility") {
                return addInterfacility(req, res);
            }
            return addPolice(req, res)
        }
        case 'DELETE': {
            return deletePolice(req, res)
        }
    }
}

async function addPolice(req, res) {
    let policeDept = JSON.parse(req.body)["policeDept"];
    let station = JSON.parse(req.body)["station"];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let zipcode = JSON.parse(req.body)[Constants.zipcode];
    let walletId = JSON.parse(req.body)["walletId"];
    let accountType = "initiator";
    let initiatorType = "emergency";

    let query = `INSERT INTO ${Constants.Users} 
                        (${Constants.walletId}, ${Constants.policeDept}, ${Constants.station}, 
                        ${Constants.address}, ${Constants.city}, ${Constants.state}, 
                        ${Constants.zipcode}, ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${walletId}', '${policeDept}', '${station}', '${address}', '${city}', 
                        '${state}', '${zipcode}', '${accountType}', '${initiatorType}');`;

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

async function addPrivate(req, res) {
    let fName = JSON.parse(req.body)[Constants.firstName];
    let lName = JSON.parse(req.body)[Constants.lastName];
    let email = JSON.parse(req.body)[Constants.email];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let zipcode = JSON.parse(req.body)[Constants.zipcode];
    let walletId = JSON.parse(req.body)["walletId"];
    let accountType = "initiator";
    let initiatorType = "private";

    let query = 
        `INSERT INTO ${Constants.Users} 
        (${Constants.firstName}, ${Constants.lastName}, ${Constants.email}, 
            ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
            ${Constants.accountType}, ${Constants.initiatorType}) 
        VALUES ('${fName}', '${lName}', '${email}', 
            '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
            '${accountType}', '${initiatorType}');`;

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

async function addInterfacility(req, res) {
    let facilityName = JSON.parse(req.body)[Constants.hospitalSystem];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let zipcode = JSON.parse(req.body)[Constants.zipcode];
    let walletId = JSON.parse(req.body)["walletId"];
    let accountType = "initiator";
    let initiatorType = "interfacility";

    let query = 
        `INSERT INTO ${Constants.Users} 
        (${Constants.hospitalSystem}, 
            ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
            ${Constants.accountType}, ${Constants.initiatorType}) 
        VALUES ('${facilityName}', 
            '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
            '${accountType}', '${initiatorType}');`;

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
async function getPolice(req, res) {
    //console.log(req.query.printerModel);
    // console.log('inside get function');

    let query = "   SELECT  " + Constants.walletId + ",  \
                            " + Constants.address + ", " + Constants.city + ", " + Constants.state + ", " + Constants.policeDept + ", \
                            " + Constants.station + ", " + Constants.licensePlate + ", " + Constants.initiatorType + "   \
                    FROM    " + Constants.Users + "                                                       \
                    WHERE   " + Constants.accountType + "  = 'initiator';"

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
async function deletePolice(req, res) {

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
