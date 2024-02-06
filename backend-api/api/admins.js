"use strict";
const Constants = require("../api-constants");

async function addAdmin(req, res, connection) {
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

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

async function getAdmins(req, res, connection) {
  let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
        ${Constants.address}, ${Constants.city},
        ${Constants.state}, ${Constants.licensePlate}, ${Constants.accountType}, ${Constants.zipcode}
        FROM ${Constants.Users}
        WHERE ${Constants.accountType} = 'admin';`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(results);
  });
}

async function deleteAdmin(req, res, connection) {
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
  addAdmin,
  getAdmins,
  deleteAdmin,
};
