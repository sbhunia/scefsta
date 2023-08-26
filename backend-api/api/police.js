"use strict";
const Constants = require("../api-constants");

async function addPolice(req, res) {
  let policeDept = JSON.parse(req.body)["policeDept"];
  let station = JSON.parse(req.body)["station"];
  let address = JSON.parse(req.body)["address"];
  let city = JSON.parse(req.body)["city"];
  let state = JSON.parse(req.body)["state"];
  let zipcode = JSON.parse(req.body)[Constants.zipcode];
  let walletId = JSON.parse(req.body)["walletId"];
  let accountType = "initiator";
  let initiatorType = "emergency";

  const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.walletId}, ${Constants.policeDept}, ${Constants.station}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, 
                    ${Constants.zipcode}, ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${walletId}', '${policeDept}', '${station}', '${address}', '${city}', 
                    '${state}', '${zipcode}', '${accountType}', '${initiatorType}');`;

  return query;
}

async function addPrivate(req, res) {
  let fName = JSON.parse(req.body)[Constants.firstName];
  let lName = JSON.parse(req.body)[Constants.lastName];
  let email = JSON.parse(req.body)[Constants.email];
  let address = JSON.parse(req.body)["address"];
  let city = JSON.parse(req.body)["city"];
  let state = JSON.parse(req.body)["state"];
  let zipcode = JSON.parse(req.body)[Constants.zipcode];
  let walletId = JSON.parse(req.body)["walletId"];
  let accountType = "initiator";
  let initiatorType = "private";

  const query = `INSERT INTO ${Constants.Users} 
                    (${Constants.firstName}, ${Constants.lastName}, ${Constants.email}, 
                    ${Constants.address}, ${Constants.city}, ${Constants.state}, ${Constants.zipcode}, ${Constants.walletId}, 
                    ${Constants.accountType}, ${Constants.initiatorType}) 
                    VALUES ('${fName}', '${lName}', '${email}', 
                    '${address}', '${city}', '${state}', '${zipcode}', '${walletId}', 
                    '${accountType}', '${initiatorType}');`;

  return query;
}

async function addInterfacility(req, res) {
  let facilityName = JSON.parse(req.body)[Constants.hospitalSystem];
  let address = JSON.parse(req.body)["address"];
  let city = JSON.parse(req.body)["city"];
  let state = JSON.parse(req.body)["state"];
  let zipcode = JSON.parse(req.body)[Constants.zipcode];
  let walletId = JSON.parse(req.body)["walletId"];
  let accountType = "initiator";
  let initiatorType = "facility";

  const isFacilityQuery = `SELECT COUNT(*) FROM Users WHERE (${Constants.walletId} = '${walletId}' AND ${Constants.accountType} = 'facility');`;
  const result = await mysqlLib.executeQuery(isFacilityQuery);
  let rows = result[0]["COUNT(*)"];

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

    return query;
  } else if (rows === 1) {
    accountType = "interfacility";
    const query = `UPDATE ${Constants.Users} SET ${Constants.accountType} = '${accountType}' WHERE ${Constants.walletId} = '${walletId}';`;
    return query;
  }
}

// Queries the database for police and returns the results
async function getPolice(req, res) {
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

  return query;
}

const getPoliceType = async (req, res) => {
  const walletId = req.query.walletId;
  const query = `SELECT ${Constants.initiatorType} FROM ${Constants.Users} 
    WHERE ${Constants.walletId} = '${walletId}' AND 
      (${Constants.accountType} = 'initiator' OR ${Constants.accountType} = 'interfacility');
    `;
  return query;
};

// Deletes police from the database
async function deletePolice(req, res) {
  const walletIds = JSON.parse(req.body);
  const formattedWalletIds = walletIds.map((id) => `'${id}'`).join(",");

  const query = `
          DELETE FROM ${Constants.Users}
          WHERE ${Constants.walletId} IN (${formattedWalletIds});
        `;

  return query;
}

module.exports = {
  addPolice,
  getPolice,
  getPoliceType,
  deletePolice,
  addPrivate,
  addInterfacility,
};
