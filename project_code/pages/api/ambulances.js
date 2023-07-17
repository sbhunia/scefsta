"use strict";

import * as Constants from "../constants";
import { resolve } from "path";

import mysqlLib from "../../config_database/mysqlLib";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      return getAmbulances(req, res);
    }
    case "POST": {
      return addAmbulance(req, res);
    }
    case "DELETE": {
      return deleteAmbulance(req, res);
    }
  }
}

async function addAmbulance(req, res) {
  try {
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

    await mysqlLib.executeQuery(query);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}

async function getAmbulances(req, res) {
  try {
    let query = `SELECT ${Constants.walletId}, ${Constants.firstName}, ${Constants.lastName}, ${Constants.email},
            ${Constants.address}, ${Constants.city}, ${Constants.zipcode},
            ${Constants.state}, ${Constants.licensePlate}, ${Constants.transportCompany}
            FROM ${Constants.Users}
            WHERE ${Constants.accountType} = 'transport';`;
    const result = await mysqlLib.executeQuery(query);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}

async function deleteAmbulance(req, res) {
  try {
    let walletIds = JSON.parse(req.body);
    let formattedWalletIds = "'" + walletIds.join("','") + "'";

    let query = `DELETE FROM ${Constants.Users}
            WHERE ${Constants.walletId}
            IN (${formattedWalletIds});`;
    await mysqlLib.executeQuery(query);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }

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
