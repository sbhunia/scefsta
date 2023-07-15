'use strict';

import * as Constants from '../constants';
import { resolve } from 'path';

import mysqlLib from '../../config_database/mysqlLib';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET': {
            return getAdmins(req, res);
        }
        case 'POST': {
            return addAdmin(req, res);
        }
        case 'DELETE': {
            return deleteAdmin(req, res);
        }
    }
}

async function addAdmin(req, res) {
    let firstName = JSON.parse(req.body)["firstName"];
    let lastName = JSON.parse(req.body)["lastName"];
    let email = JSON.parse(req.body)["email"];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let zipcode = JSON.parse(req.body)[Constants.zipcode];
    let walletId = JSON.parse(req.body)["walletId"];
    let adminAccount = 'admin';
    let query = `INSERT INTO ${Constants.Users} (${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email}, ${Constants.address},
        ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.accountType})
        VALUES ('${walletId}', '${firstName}', '${lastName}', '${email}', '${address}', '${city}', '${state}', '${zipcode}', '${adminAccount}');`;

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            console.log(d);
            console.log("query: ", query);
            res.status(200).send({ success: true });
            resolve();
        }).catch(e => {
            console.log(e);
            console.log("query: ", query);
            res.status(500).send({ success: false });
            resolve();
        });
    });
}

async function getAdmins(req, res) {
    let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
        ${Constants.address}, ${Constants.city},
        ${Constants.state}, ${Constants.licensePlate}, ${Constants.accountType}, ${Constants.zipcode}
        FROM ${Constants.Users}
        WHERE ${Constants.station} IS NULL AND
            ${Constants.policeDept} IS NULL AND
            ${Constants.accountType} = 'admin' AND
            ${Constants.licensePlate} IS NULL;`;

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            res.status(200).send(d);
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({ success: false });
            resolve();
        });
    });
}

async function deleteAdmin(req, res) {
    let walletIds = JSON.parse(req.body);
    let formattedWalletIds = "'" + walletIds.join("','") + "'";

    let query = `DELETE FROM ${Constants.Users}
        WHERE ${Constants.walletId}
        IN (${formattedWalletIds});`;

    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            res.status(200).send({ success: true });
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({ success: false });
            resolve();
        });
    });
}
