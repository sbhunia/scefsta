'use strict';
const mysqlLib = require('../../config_database/mysqlLib');
import * as Constants from '../constants';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET': {
            return getPatients(req, res);
        }
        case 'POST': {
            return addPatient(req, res);
        }
        case 'DELETE': {
            return deletePatient(req, res);
        }
    }
}

async function addPatient(req, res) {
    console.log(req.body);
    let name = JSON.parse(req.body)["name"];
    let gender = JSON.parse(req.body)["gender"];
    let age = JSON.parse(req.body)["age"];
    let address = JSON.parse(req.body)["address"];
    let city = JSON.parse(req.body)["city"];
    let state = JSON.parse(req.body)["state"];
    let status = JSON.parse(req.body)["status"];
    let injuries = JSON.parse(req.body)["injury"];
    let mech = JSON.parse(req.body)["mechanism_of_injury"];

    let cols = `${Constants.name}, ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.status}, ${Constants.injuries}, ${Constants.mech}`;
    let data = `'${name}', '${address}', '${city}', '${state}', '${status}', '${injuries}', '${mech}'`;
    let query = `INSERT INTO ${Constants.Patients} (${cols}) VALUES(${data});`;
    
    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(query).then((d) => {
            console.log(d);
            res.status(200).send({ success: true });
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send({ success: false });
            resolve();
        });
    });
}

async function getPatients(req, res) {
    return new Promise((resolve, reject) => {
        mysqlLib.executeQuery(`SELECT * FROM ${Constants.Patients}`).then((d) => {
            console.log(d);
            res.status(200).send(d);
            resolve();
        }).catch(e => {
            console.log(e);
            res.status(500).send('Sorry, something went wrong!');
            resolve();
        });
    });
}

async function deletePatient(req, res) {
    try {
        const client = await clientPromise;

        const database = client.db('ais_main');

        await database.collection('patients').deleteOne({
            tender_id: parseInt(req.body)
        });

        return res.json({
            message: 'Patient deleted successfully',
            success: true
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
