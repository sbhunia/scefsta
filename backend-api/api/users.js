"use strict";
const Constants = require("../api-constants");

async function getUser(req, res, connection) {
  let walletId = req.query.walletId;
  let query = `SELECT *
            FROM ${Constants.Users} WHERE ${Constants.walletId} = '${walletId}';`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(results);
  });
}

module.exports = {
  getUser,
};
