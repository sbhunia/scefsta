"use strict";
const mysqlLib = require("../../config_database/mysqlLib");
import * as Constants from "../constants";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      return getSalts(req, res);
    }
    case "POST": {
      return addSalt(req, res);
    }
    case "DELETE": {
      return deleteSalt(req, res);
    }
  }
}

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

  return new Promise((resolve, reject) => {
    mysqlLib
      .executeQuery(query)
      .then((d) => {
        res.status(200).send({ success: true });
        resolve();
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send({ success: false });
        resolve();
      });
  });
}

async function getSalts(req, res) {
  let walletId = req.query.walletId;
  let query = `SELECT *
                FROM ${Constants.Salts}
                LEFT JOIN ${Constants.Patients} ON
                ${Constants.Patients}.${Constants.patientId} = ${Constants.Salts}.${Constants.patientId}
                WHERE ${Constants.walletId} = '${walletId}';`;

  console.log("query: ", query);
  return new Promise((resolve, reject) => {
    mysqlLib
      .executeQuery(query)
      .then((d) => {
        console.log(d);
        res.status(200).send(d);
        resolve();
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send({ success: false });
        resolve();
      });
  });
}

async function deleteSalt(req, res) {
  let walletId = JSON.parse(req.body)["walletId"];
  let patientId = JSON.parse(req.body)["patientId"];
  let bidId = JSON.parse(req.body)["bidId"];

  let query = `DELETE FROM ${Constants.Salts}
                    WHERE ${Constants.walletId} = ${walletId} AND
                    ${Constants.patientId} = ${patientId} AND
                    ${Constants.bidId} = ${bidId};`;

  return new Promise((resolve, reject) => {
    mysqlLib
      .executeQuery(query)
      .then((d) => {
        res.status(200).send({ success: true });
        resolve();
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send({ success: false });
        resolve();
      });
  });
}
