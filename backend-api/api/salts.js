"use strict";
const Constants = require("../api-constants");

async function addSalt(req, res) {
  let walletId = JSON.parse(req.body)["walletId"];
  let patientId = JSON.parse(req.body)["patientId"];
  let bidId = JSON.parse(req.body)["bidId"];
  let saltVal = JSON.parse(req.body)["saltVal"];
  let bidVal = JSON.parse(req.body)["bidVal"];
  let penalty = JSON.parse(req.body)["penalty"];

  let query = `INSERT INTO ${Constants.Salts} (${Constants.walletId}, ${Constants.patientId}, ${Constants.bidId},
        ${Constants.saltVal}, ${Constants.bidVal}, ${Constants.penalty})
        VALUES ('${walletId}', '${patientId}', '${bidId}', '${saltVal}', '${bidVal}', '${penalty}');`;

  return query;
}

async function getSalts(req, res) {
  let walletId = req.query.walletId;
  let query = `SELECT *
                FROM ${Constants.Salts}
                LEFT JOIN ${Constants.Patients} ON
                ${Constants.Patients}.${Constants.patientId} = ${Constants.Salts}.${Constants.patientId}
                WHERE ${Constants.walletId} = '${walletId}';`;

  return query;
}

async function deleteSalt(req, res) {
  let walletId = JSON.parse(req.body)["walletId"];
  let patientId = JSON.parse(req.body)["patientId"];
  let bidId = JSON.parse(req.body)["bidId"];

  let query = `DELETE FROM ${Constants.Salts}
                    WHERE ${Constants.walletId} = ${walletId} AND
                    ${Constants.patientId} = ${patientId} AND
                    ${Constants.bidId} = ${bidId};`;

  return query;
}

module.exports = {
  addSalt,
  getSalts,
  deleteSalt,
};
