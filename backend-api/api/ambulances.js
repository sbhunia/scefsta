"use strict";
const Constants = require("../api-constants");

async function addAmbulance(req, res, connection) {
  let transportCompany = req.body.transportCompany;
  let licensePlate = req.body.licensePlate;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let accountType = "transport";
  let query = `INSERT INTO ${Constants.Users} (${Constants.transportCompany}, ${Constants.walletId}, ${Constants.address},
            ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.licensePlate}, ${Constants.accountType})
            VALUES ('${transportCompany}', '${walletId}', '${address}', '${city}', '${state}', '${zipcode}', '${licensePlate}', '${accountType}');`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

async function getAmbulances(req, res, connection) {
  let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
            ${Constants.address}, ${Constants.city}, ${Constants.zipcode},
            ${Constants.state}, ${Constants.licensePlate}, ${Constants.transportCompany}
            FROM ${Constants.Users}
            WHERE ${Constants.accountType} = 'transport';`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(results);
  });
}

async function deleteAmbulance(req, res, connection) {
  let walletIds = req.body;
  let formattedWalletIds = "'" + walletIds.join("','") + "'";

  let query = `DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

module.exports = {
  addAmbulance,
  getAmbulances,
  deleteAmbulance,
};
