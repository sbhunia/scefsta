// import clientPromise from  '../../util/mongodb'
"use strict";
const Constants = require("../api-constants");

async function addHospital(req, res) {
  let hospitalSystem = JSON.parse(req.body)[Constants.hospitalSystem];
  let address = JSON.parse(req.body)["address"];
  let city = JSON.parse(req.body)["city"];
  let state = JSON.parse(req.body)["state"];
  let zipcode = JSON.parse(req.body)["zipcode"];
  let walletId = JSON.parse(req.body)["walletId"];
  let accountType = "facility";

  const isFacilityQuery = `SELECT COUNT(*) FROM Users WHERE (${Constants.walletId} = '${walletId}' AND ${Constants.accountType} = 'initiator' AND ${Constants.initiatorType} = 'facility');`;
  const result = await mysqlLib.executeQuery(isFacilityQuery);
  let rows = result[0]["COUNT(*)"];

  // if the entry is not already a ininitiator then add as facility
  // if already a initiator set type to inter-facility
  if (rows === 0) {
    const query = `INSERT INTO ${Constants.Users} (${Constants.walletId}, ${Constants.address}, ${Constants.city}, ${Constants.state}, 
            ${Constants.hospitalSystem}, ${Constants.zipcode}, ${Constants.accountType})
            VALUES ('${walletId}', '${address}', '${city}', '${state}', '${hospitalSystem}', '${zipcode}', '${accountType}');`;

    return query;
  } else if (rows === 1) {
    accountType = "interfacility";
    const query = `UPDATE ${Constants.Users} SET ${Constants.accountType} = '${accountType}' 
                        WHERE ${Constants.walletId} = '${walletId}';`;

    return query;
  }
}

// Queries the database for hospitals and reuturns the results
async function getHospitals(req, res) {
  let query = `
                    SELECT  * 
                    FROM ${Constants.Users}   
                    WHERE (${Constants.accountType} = 'facility' OR ${Constants.accountType} = 'interfacility'); 
                `;

  return query;
}

// Deletes hospitals from the database
async function deleteHospital(req, res) {
  let walletIds = JSON.parse(req.body);
  let formattedWalletIds = "'" + walletIds.join("','") + "'";

  let query = `
            DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});
        `;

  return query;
}

module.exports = {
  addHospital,
  getHospitals,
  deleteHospital,
};
