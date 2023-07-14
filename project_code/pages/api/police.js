'use strict';
const mysqlLib = require('../../config_database/mysqlLib')
import * as Constants from '../constants';

export default async function handler(req, res) {
    
    switch (req.method) {
        case 'GET': {
            return getPolice(req, res)
        }
        case 'POST': {
            const header = req.headers['x-method'];
            console.log("head", header);

            if (header === "emergency") {
                return addPolice(req, res);
            } else if (header === "private") {
                return addPrivate(req, res);
            } else if (header === "interfacility") {
                return addInterfacility(req, res);
            }
            break;
        }
        case 'DELETE': {
            return deletePolice(req, res)
        }
    }
}

async function addPolice(req, res) {
    try {
      const { policeDept, station, address, city, state, zipcode, walletId } = req.body;
      const accountType = "initiator";
      const initiatorType = "emergency";
  
      const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.walletId}, ${Constants.policeDept}, ${Constants.station}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, 
                    ${Constants.zipcode}, ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${walletId}', '${policeDept}', '${station}', '${address}', '${city}', 
                    '${state}', '${zipcode}', '${accountType}', '${initiatorType}');`;
  
      await mysqlLib.executeQuery(query);
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
  
  async function addPrivate(req, res) {
    try {
      const { firstName, lastName, email, address, city, state, zipcode, walletId } = req.body;
      const accountType = "initiator";
      const initiatorType = "private";
  
      const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.firstName}, ${Constants.lastName}, ${Constants.email}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
                    ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${firstName}', '${lastName}', '${email}', 
                    '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
                    '${accountType}', '${initiatorType}');`;
  
      await mysqlLib.executeQuery(query);
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
  
  async function addInterfacility(req, res) {
    try {
        let facilityName = JSON.parse(req.body)[Constants.hospitalSystem];
        let address = JSON.parse(req.body)["address"];
        let city = JSON.parse(req.body)["city"];
        let state = JSON.parse(req.body)["state"];
        let zipcode = JSON.parse(req.body)[Constants.zipcode];
        let walletId = JSON.parse(req.body)["walletId"];
        let accountType = "initiator";
        let initiatorType = "facility";

        const isFacilityQuery = `SELECT COUNT(*) FROM Users WHERE (${Constants.walletId} = '${walletId}' AND ${Constants.accountType} = 'facility');`;
        const result = await mysqlLib.executeQuery(isFacilityQuery);
        let rows = result[0]['COUNT(*)']

        // if the entry is not already a facility then initiator type is facility
        // if already a facility set type to inter-facility
        if (rows === 0) {
            const query = 
                `INSERT INTO ${Constants.Users} 
                    (${Constants.hospitalSystem}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
                    ${Constants.accountType}, ${Constants.initiatorType}) 
                 VALUES ( 
                    '${facilityName}', '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
                    '${accountType}', '${initiatorType}');`;
                    
            console.log(query);
            await mysqlLib.executeQuery(query);
        } else if (rows === 1) {
            accountType = 'interfacility';
            const query = 
                `UPDATE ${Constants.Users} SET ${Constants.accountType} = ${accountType} WHERE ${Constants.walletId} = ${walletId};`;
            console.log(query);
            await mysqlLib.executeQuery(query);
        }
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

// Queries the database for police and returns the results
async function getPolice(req, res) {
    try {
      const query = `
        SELECT
          ${Constants.walletId},
          ${Constants.address},
          ${Constants.city},
          ${Constants.state},
          ${Constants.policeDept},
          ${Constants.station},
          ${Constants.licensePlate},
          ${Constants.initiatorType}
        FROM
          ${Constants.Users}
        WHERE
          ${Constants.accountType} = 'initiator';
      `;
  
      const result = await mysqlLib.executeQuery(query);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

// Deletes police from the database
async function deletePolice(req, res) {
    try {
        const walletIds = JSON.parse(req.body);
        const formattedWalletIds = walletIds.map((id) => `'${id}'`).join(',');
    
        const query = `
          DELETE FROM ${Constants.Users}
          WHERE ${Constants.walletId} IN (${formattedWalletIds});
        `;
    
        await mysqlLib.executeQuery(query);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
      }
}
