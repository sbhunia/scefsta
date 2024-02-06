// import clientPromise from  '../../util/mongodb'
"use strict";
const Constants = require("../api-constants");

async function addHospital(req, res, connection) {
  let hospitalSystem = req.body.facilityName;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let accountType = "facility";

  const isFacilityQuery = `SELECT COUNT(*) FROM Users WHERE (${Constants.walletId} = '${walletId}' AND ${Constants.accountType} = 'initiator' AND ${Constants.initiatorType} = 'facility');`;
  let rows;
  await connection
    .promise()
    .query(isFacilityQuery)
    .then((results) => {
      rows = results[0][0]["COUNT(*)"];
    })
    .catch((err) => {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    });

  // if the entry is not already a ininitiator then add as facility
  // if already a initiator set type to inter-facility
  if (rows === 0) {
    const query = `INSERT INTO ${Constants.Users} (${Constants.walletId}, ${Constants.address}, ${Constants.city}, ${Constants.state}, 
            ${Constants.hospitalSystem}, ${Constants.zipcode}, ${Constants.accountType})
            VALUES ('${walletId}', '${address}', '${city}', '${state}', '${hospitalSystem}', '${zipcode}', '${accountType}');`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }

      return res.status(200).json({ data: results, success: true });
    });
  } else if (rows === 1) {
    accountType = "interfacility";
    const query = `UPDATE ${Constants.Users} SET ${Constants.accountType} = '${accountType}' 
                        WHERE ${Constants.walletId} = '${walletId}';`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }

      return res.status(200).json({ data: results, success: true });
    });
  } else {
    res.status(500).json({ success: false });
  }
}

// Queries the database for hospitals and reuturns the results
async function getHospitals(req, res, connection) {
  let query = `
                    SELECT  * 
                    FROM ${Constants.Users}   
                    WHERE (${Constants.accountType} = 'facility' OR ${Constants.accountType} = 'interfacility'); 
                `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(results);
  });
}

// Deletes hospitals from the database
async function deleteHospital(req, res, connection) {
  let walletIds = req.body;
  let formattedWalletIds = "'" + walletIds.join("','") + "'";

  let query = `
            DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});
        `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    res.status(200).json({ data: results, success: true });
  });
}

module.exports = {
  addHospital,
  getHospitals,
  deleteHospital,
};
