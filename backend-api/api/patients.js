"use strict";
const Constants = require("../api-constants");

async function addPatient(req, res) {
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
  return query;
}

async function updatePatient(req, res) {
  let patientId = req.body.patientId;
  let status = req.body.status;
  let query = `UPDATE ${Constants.Patients} SET ${Constants.status} = '${status}' WHERE ${Constants.patientId} = '${patientId}'`;
  return query;
}

async function getPatients(req, res) {
  let query = `SELECT * FROM ${Constants.Patients}`;
  return query;
}

module.exports = {
  addPatient,
  updatePatient,
  getPatients,
};
