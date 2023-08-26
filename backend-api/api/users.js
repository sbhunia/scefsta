"use strict";
const Constants = require("../api-constants");

async function getUser(req, res) {
  let walletId = req.query.walletId;
  let query = `SELECT *
            FROM ${Constants.Users} WHERE ${Constants.walletId} = '${walletId}';`;

  return query;
}

module.exports = {
  getUser,
};
