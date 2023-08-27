const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser"); // Add this line
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { addAdmin, getAdmins, deleteAdmin } = require("./api/admins");
const {
  addAmbulance,
  getAmbulances,
  deleteAmbulance,
} = require("./api/ambulances");

const {
  addHospital,
  getHospitals,
  deleteHospital,
} = require("./api/hospitals");

const { getPatients, addPatient, updatePatient } = require("./api/patients");

const {
  addPolice,
  getPolice,
  getPoliceType,
  deletePolice,
  addPrivate,
  addInterfacility,
} = require("./api/police");

const { addSalt, getSalts, deleteSalt } = require("./api/salts");

const { getUser } = require("./api/users");

// Database connection configuration
const connection = mysql.createConnection({
  host: "ambulance-blockchain.sec.csi.miamioh.edu",
  port: 3306,
  user: "ais_user",
  password: "zebra",
  database: "AIS",
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");

  app.get("/api/admins", async (req, res, next) => {
    const query = await getAdmins(req, res);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.post("/api/admins", async (req, res, next) => {
	console.log(req);
	  const query = await addAdmin(req, res);

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json({data: results, success: true});
    });
  });

  app.delete("/api/admins", async (req, res, next) => {
    const query = await deleteAdmin(req, res);

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json({data: results, success: true});
    });
  });

  app.get("/api/ambulances", async (req, res, next) => {
    const query = await getAmbulances(req, res);

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.post("/api/ambulances", async (req, res, next) => {
    const query = await addAmbulance(req, res);
    console.log("query", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.delete("/api/ambulances", async (req, res, next) => {
    const query = await deleteAmbulance(req, res);
    console.log("query", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.get("/api/hospitals", async (req, res, next) => {
    const query = await getHospitals(req, res);
    console.log("query", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.post("/api/hospitals", async (req, res, next) => {
    const query = await addHospital(req, res);
    console.log("query", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.delete("/api/hospitals", async (req, res, next) => {
    const query = await deleteHospital(req, res);
    console.log("query", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });

  app.get("/api/patients", async (req, res, next) => {
    const query = await getPatients(req, res);
    console.log("query", query);
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ success: false });
      }
      console.log("Query results:", results);
      res.status(200).json(results);
    });
  });
});

app.post("/api/patients", async (req, res, next) => {
  let query;
  if (req.headers["x-mehod"] === "insert") {
    query = await addPatient(req, res);
  } else {
    query = await updatePatient(req, res);
  }

  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.get("/api/police", async (req, res, next) => {
  let query;
  if (req.query.walletId) {
    query = await getPoliceType(req, res);
  } else {
    query = await getPolice(req, res);
  }

  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.post("/api/police", async (req, res, next) => {
  const header = req.headers["x-method"];

  let query;
  if (header === "emergency") {
    query = await addPolice(req, res);
  } else if (header === "private") {
    query = await addPrivate(req, res);
  } else if (header === "interfacility") {
    query = await addInterfacility(req, res);
  }

  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.delete("/api/police", async (req, res, next) => {
  const query = await deletePolice(req, res);
  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.get("/api/salts", async (req, res, next) => {
  const query = await getSalts(req, res);
  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.post("/api/salts", async (req, res, next) => {
  const query = await addSalt(req, res);
  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.delete("/api/salts", async (req, res, next) => {
  const query = await deleteSalt(req, res);
  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

app.get("/api/users", async (req, res, next) => {
  const query = await getUser(req, res);
  console.log("query", query);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Query results:", results);
    res.status(200).json(results);
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on this port ${PORT}`));
