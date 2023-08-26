"use strict";
const Constants = require("../api-constants");

async function addPatient(req, res) {
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
  return query;
}

async function updatePatient(req, res) {
  let patientId = JSON.parse(req.body)["patientId"];
  let status = JSON.parse(req.body)["status"];
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
