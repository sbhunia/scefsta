'use strict';

import * as Constants from '../../constants';

import mysqlLib from '../../config_database/mysqlLib';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET': {
            return getUsers(req, res);
        }
    }
}

async function getUsers(req, res) {
    try {
        let walletId = req.query.walletId;
        let query = `SELECT *
            FROM ${Constants.Users} WHERE ${Constants.walletId} = '${walletId}';`;

        console.log(query);
        const result = await mysqlLib.executeQuery(query);
        res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
}
 