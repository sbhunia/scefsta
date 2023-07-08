'use strict';
const mysqlLib = require('../../config_database/mysqlLib')
import * as Constants from '../constants';

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getPolice(req, res)
        }
        case 'POST': {
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
    let walletId = JSON.parse(req.body)["walletId"];

    let query = "   INSERT INTO " + Constants.Users + " (   " + Constants.walletId + ", " + Constants.policeDept + ", " + Constants.station + ", \
                                                            " + Constants.address + ", " + Constants.city + ", " + Constants.state + ") \
                    VALUES ('" + walletId + "', '" + policeDept + "', '" + station + "', '" + address + "', '" + city + "', '" + state + "');";

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
                            " + Constants.station + ", " + Constants.licensePlate + "    \
                    FROM    " + Constants.Users + "                                                       \
                    WHERE   " + Constants.station + "     IS NOT NULL AND                                 \
                            " + Constants.policeDept + "  IS NOT NULL;"

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
