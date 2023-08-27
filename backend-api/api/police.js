"use strict";
const Constants = require("../api-constants");

async function addPolice(req, res, connection) {
  let policeDept = req.body.policeDept;
  let station = req.body.station;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let accountType = "initiator";
  let initiatorType = "emergency";

  const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.walletId}, ${Constants.policeDept}, ${Constants.station}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, 
                    ${Constants.zipcode}, ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${walletId}', '${policeDept}', '${station}', '${address}', '${city}', 
                    '${state}', '${zipcode}', '${accountType}', '${initiatorType}');`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

async function addPrivate(req, res, connection) {
  let fName = req.body.firstName;
  let lName = req.body.lastName;
  let email = req.body.email;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let accountType = "initiator";
  let initiatorType = "private";

  const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.firstName}, ${Constants.lastName}, ${Constants.email}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
                    ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${fName}', '${lName}', '${email}', 
                    '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
                    '${accountType}', '${initiatorType}');`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

async function addInterfacility(req, res, connection) {
  let facilityName = req.body.facilityName;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let walletId = req.body.walletId;
  let accountType = "initiator";
  let initiatorType = "facility";

  const isFacilityQuery = `SELECT COUNT(*) FROM Users WHERE (${Constants.walletId} = '${walletId}' AND ${Constants.accountType} = 'facility');`;
  let rows;
  await connection
    .promise()
    .query(isFacilityQuery)
    .then((results) => {
      rows = results[0][0]["COUNT(*)"];
    })
    .catch((err) => {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    });

  // if the entry is not already a facility then initiator type is facility
  // if already a facility set type to inter-facility
  if (rows === 0) {
    const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.hospitalSystem}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
                    ${Constants.accountType}, ${Constants.initiatorType}) 
                 VALUES ( 
                    '${facilityName}', '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
                    '${accountType}', '${initiatorType}');`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }

      return res.status(200).json({ data: results, success: true });
    });
  } else if (rows === 1) {
    accountType = "interfacility";
    const query = `UPDATE ${Constants.Users} SET ${Constants.accountType} = '${accountType}', ${Constants.initiatorType} ='${initiatorType}' WHERE ${Constants.walletId} = '${walletId}';`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }

      return res.status(200).json({ data: results, success: true });
    });
  }
}

// Queries the database for police and returns the results
async function getPolice(req, res, connection) {
  const query = `
      SELECT
        ${Constants.walletId},
        ${Constants.address},
        ${Constants.city},
        ${Constants.state},
        ${Constants.policeDept},
        ${Constants.station},
        ${Constants.licensePlate},
        ${Constants.initiatorType},
        ${Constants.hospitalSystem},
        ${Constants.zipcode},
        ${Constants.initiatorType},
        ${Constants.accountType},
        ${Constants.firstName},
        ${Constants.lastName},
        ${Constants.email}
      FROM
        ${Constants.Users}
      WHERE
        (${Constants.accountType} = 'initiator' OR ${Constants.accountType} = 'interfacility');
    `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(results);
  });
}

const getPoliceType = async (req, res, connection) => {
  const walletId = req.query.walletId;
  const query = `SELECT ${Constants.initiatorType} FROM ${Constants.Users} 
    WHERE ${Constants.walletId} = ${walletId} AND 
      (${Constants.accountType} = 'initiator' OR ${Constants.accountType} = 'interfacility' OR ${Constants.initiatorType} = 'private');
    `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    return res.status(200).json(results);
  });
};

// Deletes police from the database
async function deletePolice(req, res, connection) {
  const walletIds = req.body;
  const formattedWalletIds = walletIds.map((id) => `'${id}'`).join(",");

  const query = `
          DELETE FROM ${Constants.Users}
          WHERE ${Constants.walletId} IN (${formattedWalletIds});
        `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ data: results, success: true });
  });
}

module.exports = {
  addPolice,
  getPolice,
  getPoliceType,
  deletePolice,
  addPrivate,
  addInterfacility,
};
