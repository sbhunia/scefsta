'use strict';

import * as Constants from '../../constants';
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
    try {
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

        await mysqlLib.executeQuery(query);
        res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
}

async function getAdmins(req, res) {
    try {
    let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
        ${Constants.address}, ${Constants.city},
        ${Constants.state}, ${Constants.licensePlate}, ${Constants.accountType}, ${Constants.zipcode}
        FROM ${Constants.Users}
        WHERE ${Constants.station} IS NULL AND
            ${Constants.policeDept} IS NULL AND
            ${Constants.accountType} = 'admin' AND
            ${Constants.licensePlate} IS NULL;`;

        const result = await mysqlLib.executeQuery(query);
        res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
}

async function deleteAdmin(req, res) {
    try {
        let walletIds = JSON.parse(req.body);
        let formattedWalletIds = "'" + walletIds.join("','") + "'";

        let query = `DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});`;
        await mysqlLib.executeQuery(query);
  
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}
 