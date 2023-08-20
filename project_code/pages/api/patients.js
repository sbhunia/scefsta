"use strict";
const mysqlLib = require("../../config_database/mysqlLib");
import * as Constants from "../../constants";

export default async function handler(req, res) {
  const header = req.headers['x-method'];

  switch (req.method) {
    case "GET": {
      return getPatients(req, res);
    }
    case "POST": {
      if (header === "insert") {
        return addPatient(req, res);
      } else if (header === "update") {
        return updatePatient(req, res);
      }
    }
    case "DELETE": {
      return deletePatient(req, res);
    }
  }
}

async function addPatient(req, res) {
  try {
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let zipcode = JSON.parse(req.body)["zipcode"];
    let injuries = JSON.parse(req.body)["injury"];
    let mech = JSON.parse(req.body)["mechanism_of_injury"];
    let severity = JSON.parse(req.body)["severity"];
    let status = "pending";

    let cols = `${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.status}, ${Constants.injuries}, ${Constants.mech}, ${Constants.severity}`;
    let data = `'${address}', '${city}', '${state}', '${zipcode}', '${status}', '${injuries}', '${mech}', '${severity}'`;
    let query = `INSERT INTO ${Constants.Patients} (${cols}) VALUES(${data});`;

    console.log(query);
    await mysqlLib.executeQuery(query);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}

async function updatePatient(req, res) {
  try {
    let patientId = JSON.parse(req.body)["patientId"];
    let status = JSON.parse(req.body)["status"];
    let query = `UPDATE ${Constants.Patients} SET ${Constants.status} = '${status}' WHERE ${Constants.patientId} = '${patientId}'`;

    console.log(query);
    await mysqlLib.executeQuery(query);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}

async function getPatients(req, res) {
  return new Promise((resolve, reject) => {
    mysqlLib
      .executeQuery(`SELECT * FROM ${Constants.Patients}`)
      .then((d) => {
        console.log(d);
        res.status(200).send(d);
        resolve();
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Sorry, something went wrong!");
        resolve();
      });
  });
}

async function deletePatient(req, res) {
  try {
    const client = await clientPromise;

    const database = client.db("ais_main");

    await database.collection("patients").deleteOne({
      tender_id: parseInt(req.body),
    });

    return res.json({
      message: "Patient deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
