"use strict";
const Constants = require("../api-constants");

async function addAdmin(req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let adminAccount = "admin";
  let query = `INSERT INTO ${Constants.Users} (${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email}, ${Constants.address},
            ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.accountType})
            VALUES ('${walletId}', '${firstName}', '${lastName}', '${email}', '${address}', '${city}', '${state}', '${zipcode}', '${adminAccount}');`;

  return query;
}

async function getAdmins(req, res) {
  let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
        ${Constants.address}, ${Constants.city},
        ${Constants.state}, ${Constants.licensePlate}, ${Constants.accountType}, ${Constants.zipcode}
        FROM ${Constants.Users}
        WHERE ${Constants.accountType} = 'admin';`;

  return query;
}

async function deleteAdmin(req, res) {
  let walletIds = req.body;
  let formattedWalletIds = "'" + walletIds.join("','") + "'";

  let query = `DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});`;
  return query;
}

module.exports = {
  addAdmin,
  getAdmins,
  deleteAdmin,
};
