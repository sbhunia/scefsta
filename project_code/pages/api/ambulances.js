// import clientPromise from  '../../util/mongodb'
'use strict';

import * as Constants from '../constants';
import { resolve } from 'path';

//const mysqlLib = require(Constants.mysqlLib);
const mysqlLib = require('../../config_database/mysqlLib')

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getAmbulances(req, res)
        }
        case 'POST': {
            return addAmbulance(req, res)
        }
        case 'PUT': {
            return addBid(req, res)
        }
        case 'DELETE': {
            return deleteAmbulance(req, res)
        }
    }
}

// Adds an ambulance to the database
async function addAmbulance(req, res) {

    let licensePlate = JSON.parse(req.body)["licensePlate"];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let walletId = JSON.parse(req.body)["walletId"];

    let query = "   INSERT INTO " + Constants.Users + " (   " + Constants.walletId + ", " + Constants.address + ", \
                                                            " + Constants.city + ", " + Constants.state + ", " + Constants.licensePlate + ") \
                    VALUES ('" + walletId + "', '" + address + "', '" + city + "', '" + state + "', '" + licensePlate + "' );";

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

// Queries the database for ambulances and returns the results
async function getAmbulances(req, res) {
    //console.log(req.query.printerModel);
    // console.log('inside get function');
    
    let query = "   SELECT  " + Constants.walletId + ", " + Constants.firstName + ", " + Constants.lastName + ", " + Constants.email + ", \
                            " + Constants.address + ", " + Constants.city + ", \
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

// Deletes ambulances from the database
async function deleteAmbulance(req, res) {

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

// Not functional
async function addBid(req, res) {
    try {
        const client = await clientPromise;

        const database = client.db('ais_main');

        const obj = JSON.parse(req.body)

        const query = { walletId: obj.walletId }

        const bids = {}
        bids[obj.key] = obj.value;

        const update = { $set : {bids: bids}}

        const options = { upsert: true };

        await database.collection('ambulances').updateOne(query, update, options)

        return res.json({
            message: 'Bid added successfully',
            success: true,
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}