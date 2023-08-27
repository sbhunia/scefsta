"use strict";
const Constants = require("../api-constants");

async function addPatient(req, res, connection) {
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let injuries = req.body.injury;
  let mech = req.body.mechanism_of_injury;
  let severity = req.body.severity;
  let status = "pending";

  let cols = `${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.status}, ${Constants.injuries}, ${Constants.mech}, ${Constants.severity}`;
  let data = `'${address}', '${city}', '${state}', '${zipcode}', '${status}', '${injuries}', '${mech}', '${severity}'`;
  let query = `INSERT INTO ${Constants.Patients} (${cols}) VALUES(${data});`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

async function updatePatient(req, res, connection) {
  let patientId = req.body.patientId;
  let status = req.body.status;
  let query = `UPDATE ${Constants.Patients} SET ${Constants.status} = '${status}' WHERE ${Constants.patientId} = '${patientId}'`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

async function getPatients(req, res, connection) {
  let query = `SELECT * FROM ${Constants.Patients}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(results);
  });
}

module.exports = {
  addPatient,
  updatePatient,
  getPatients,
};
