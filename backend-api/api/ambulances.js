"use strict";
const Constants = require("../api-constants");

async function addAmbulance(req, res) {
  let transportCompany = JSON.parse(req.body)[Constants.transportCompany];
  let licensePlate = JSON.parse(req.body)["licensePlate"];
  let address = JSON.parse(req.body)["address"];
  let city = JSON.parse(req.body)["city"];
  let state = JSON.parse(req.body)["state"];
  let zipcode = JSON.parse(req.body)[Constants.zipcode];
  let walletId = JSON.parse(req.body)["walletId"];
  let accountType = "transport";
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
  let walletIds = JSON.parse(req.body);
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
