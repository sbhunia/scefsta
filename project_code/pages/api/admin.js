// import clientPromise from  '../../util/mongodb'
'use strict';

import * as Constants from '../constants';
import { resolve } from 'path';

//const mysqlLib = require(Constants.mysqlLib);
const mysqlLib = require('../../config_database/mysqlLib')

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getAdmins(req, res)
        }
        case 'POST': {
            return addAdmin(req, res)
        }
        case 'DELETE': {
            return deleteAdmin(req, res)
        }
    }
}

// Adds an admin to the database
async function addAdmin(req, res) {

    let firstName = JSON.parse(req.body)["firstName"];
    let lastName = JSON.parse(req.body)["lastName"];
    let email = JSON.parse(req.body)["email"];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let walletId = JSON.parse(req.body)["walletId"];

    let query = "   INSERT INTO " + Constants.Users + " (   " + Constants.walletId + ", " + Constants.firstName + ", " + Constants.lastName + ", " + Constants.email + ", " + Constants.address + ", \
                                                            " + Constants.city + ", " + Constants.state + ", " + Constants.licensePlate + ") \
                    VALUES ('" + walletId + "', '" + firstName + "', '" + lastName + "', '" + email + "', '" + address + "', '" + city + "', '" + state + "', '" + licensePlate + "' );";

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

// Queries the database for admins and returns the results
async function getAdmins(req, res) {
    //console.log(req.query.printerModel);
    // console.log('inside get function');
    
    let query = "   SELECT  " + Constants.walletId + ", " + Constants.firstName + ", " + Constants.lastName + ", " + Constants.email + ", \
                            " + Constants.ipAddress + ", " + Constants.username + ", " + Constants.address + ", " + Constants.city + ", \
                            " + Constants.state + ", " + Constants.licensePlate + "    \
                    FROM    " + Constants.Users + "                                                       \
                    WHERE   " + Constants.station + "         IS NULL         AND                         \
                            " + Constants.policeDept + "      IS  NULL        AND                         \
                            " + Constants.licensePlate + "   IS NOT NULL;"

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

// Deletes admins from the database
async function deleteAdmin(req, res) {

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