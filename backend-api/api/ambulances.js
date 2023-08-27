"use strict";
const Constants = require("../api-constants");

async function addAmbulance(req, res) {
  let transportCompany = req.body.transportCompany;
  let licensePlate = req.body.licensePlate;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let accountType = req.body.transport;
  let query = `INSERT INTO ${Constants.Users} (${Constants.transportCompany}, ${Constants.walletId}, ${Constants.address},
            ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.licensePlate}, ${Constants.accountType})
            VALUES ('${transportCompany}', '${walletId}', '${address}', '${city}', '${state}', '${zipcode}', '${licensePlate}', '${accountType}');`;
  return query;
}

async function getAmbulances(req, res) {
  let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
            ${Constants.address}, ${Constants.city}, ${Constants.zipcode},
            ${Constants.state}, ${Constants.licensePlate}, ${Constants.transportCompany}
            FROM ${Constants.Users}
            WHERE ${Constants.accountType} = 'transport';`;
  return query;
}

async function deleteAmbulance(req, res) {
  let walletIds = req.body;
  let formattedWalletIds = "'" + walletIds.join("','") + "'";

  let query = `DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});`;
  return query;
}

module.exports = {
  addAmbulance,
  getAmbulances,
  deleteAmbulance,
};
