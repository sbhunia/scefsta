// Project naming
export const PROJECT_ABR = "SCEFSTA";
export const PROJECT_NAME = "Title";

// Page URLs
export const DevHomeURL = "/home";
export const DevAdminURL = "/admin";
export const DevHospitalURL = "/facility";
export const DevPoliceURL = "/initiator";
export const DevAmbulanceURL = "/transport";
export const DevProfileURL = "/profile";
export const DevAboutURL = "/about";

// Database constansts, used in queries with the database
// table names
export const Users = "Users";
export const Patients = "Patients";
export const Salts = "Salts";

// user table variables
export const walletId = "walletId";
export const firstName = "firstName";
export const lastName = "lastName";
export const email = "email";
export const ipAddress = "ipAddress";
export const username = "username";
export const address = "address";
export const city = "city";
export const state = "state";
export const zipcode = "zipcode";
export const policeDept = "policeDept";
export const station = "stationNumber";
export const hospitalSystem = "facilityName";
export const licensePlate = "licensePlate";
export const initiatorType = "initiatorType";
export const accountType = "accountType";
export const transportCompany = "transportCompany";
export const penalty = "penalty";
export const severity = "severity";

// patient table variables
export const patientId = "patientId";
export const name = "name";
export const gender = "gender";
export const age = "age";
export const status = "status";
export const injuries = "injuries";
export const mech = "mechanismOfInjury";

// salt table variables
export const saltId = "saltId";
export const saltVal = "saltVal";
export const bidId = "bidId";
export const bidVal = "bidVal";

// API URLs
export const getAdmins =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/admins";
export const getPatients =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/patients";
export const getPolice =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/police";
export const getAmbulances =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/ambulances";
export const getHospitals =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/hospitals";
export const getTenders =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/tenders";
export const getUsers =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000/api/users";
// export const addAdmin = "api/admins";
// export const addAmbulance = "api/ambulances";
// export const addHospital = "api/hospitals";
// export const addPolice = "api/police";
// export const deleteAdmins = "api/admins";
// export const deleteAmbulance = "api/ambulances";
// export const deletePolice = "api/police";
// export const deleteHospital = "api/hospitals";

export const APP_DOMAIN = "http://localhost:3000";

export const getSalt =
  "http://ambulance-blockchain.sec.csi.miamioh.edu:5000//api/salts";
export const addSalt = "api/salts";
export const deleteSalt = "api/salts";

// Page titles
export const DASHBOARD = "Dashboard";
export const ADMIN = "Admin";
export const ADMIN_PLURAL = "Admins";
export const HOSPITAL = "Facility";
export const HOSPITAL_PLURAL = "Facilities";
export const POLICE = "Initiator";
export const POLICE_PLURAL = "Initiators";
export const AMBULANCE = "Transport";
export const AMBULANCE_PLURAL = "Transports";
export const PATIENT = "Patient";
export const PATIENT_PLURAL = "Patients";
export const TENDER = "Tender";
export const TENDER_PLURAL = "Tenders";

export const PROFILE = "Profile";
export const ABOUT = "About " + PROJECT_ABR;

export const TENDER_STATUS = {
  0: "Closed",
  1: "InProgress",
  2: "Open",
  3: "Retracted",
  4: "Reclaimed",
};
