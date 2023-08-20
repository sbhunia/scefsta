// import clientPromise from  '../../util/mongodb'
'use strict';
const mysqlLib = require('../../config_database/mysqlLib')
import * as Constants from '../../constants';

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
    try {
        let hospitalSystem = JSON.parse(req.body)[Constants.hospitalSystem];
        let address = JSON.parse(req.body)["address"];
        let city = JSON.parse(req.body)["city"];
        let state = JSON.parse(req.body)["state"];
        let zipcode = JSON.parse(req.body)["zipcode"];
        let walletId = JSON.parse(req.body)["walletId"];
        let accountType = "facility";

        const isFacilityQuery = `SELECT COUNT(*) FROM Users WHERE (${Constants.walletId} = '${walletId}' AND ${Constants.accountType} = 'initiator' AND ${Constants.initiatorType} = 'facility');`;
        const result = await mysqlLib.executeQuery(isFacilityQuery);
        let rows = result[0]['COUNT(*)']

        
        // if the entry is not already a ininitiator then add as facility
        // if already a initiator set type to inter-facility
        if (rows === 0) {
            const query = `INSERT INTO ${Constants.Users} (${Constants.walletId}, ${Constants.address}, ${Constants.city}, ${Constants.state}, 
            ${Constants.hospitalSystem}, ${Constants.zipcode}, ${Constants.accountType})
            VALUES ('${walletId}', '${address}', '${city}', '${state}', '${hospitalSystem}', '${zipcode}', '${accountType}');`;
            
            console.log(query);
            await mysqlLib.executeQuery(query);
        } else if (rows === 1) {
            accountType = 'interfacility';
            const query = `UPDATE ${Constants.Users} SET ${Constants.accountType} = '${accountType}' 
                        WHERE ${Constants.walletId} = '${walletId}';`;
            
            console.log(query);
            await mysqlLib.executeQuery(query);
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}

// Queries the database for hospitals and reuturns the results
async function getHospitals(req, res) {
    try {
        let query = `
                    SELECT  * 
                    FROM ${Constants.Users}   
                    WHERE (${Constants.accountType} = 'facility' OR ${Constants.accountType} = 'interfacility'); 
                `;

        const result = await mysqlLib.executeQuery(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}

// Deletes hospitals from the database
async function deleteHospital(req, res) {
    try {
        let walletIds = JSON.parse(req.body)
        let formattedWalletIds = "'" + walletIds.join("','") + "'";

        let query = `
            DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});
        `;

        await mysqlLib.executeQuery(query);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}