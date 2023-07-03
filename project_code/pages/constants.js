// Page URLs   
export const DevHomeURL = '/home';                                     
export const DevAdminURL = '/admin';                                
export const DevHospitalURL = '/hospital';                          
export const DevPoliceURL = '/police';                              
export const DevAmbulanceURL = '/ambulance';                        
export const DevProfileURL = '/profile';                            
export const DevAboutURL = '/about';                                

// Database constansts, used in queries with the database
// table names
export const Users = 'Users';
export const Patients = 'Patients';
export const Salts = 'Salts';

// user table variables
export const walletId = 'walletId';
export const firstName = 'firstName';
export const lastName = 'lastName';
export const email = 'email';
export const ipAddress = 'ipAddress';
export const username = 'username';
export const address = 'address';
export const city = 'city';
export const state = 'state';
export const policeDept = 'policeDept';
export const station = 'station';
export const hospitalSystem = 'hospitalSystem';
export const licensePlate = 'licensePlate';
export const accountType = "accountType";

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

// API URLs
export const getAdmins = 'http://localhost:3000/api/admins';        
export const getPatients = 'http://localhost:3000/api/patients';        
export const getPolice = 'http://localhost:3000/api/police';            
export const getAmbulances ='http://localhost:3000/api/ambulances';     
export const getHospitals = 'http://localhost:3000/api/hospitals';      
export const getTenders = 'http://localhost:3000/api/tenders';
export const addAdmin = 'api/admins';        
export const addAmbulance = 'api/ambulances';                           
export const addHospital = 'api/hospitals';                            
export const addPolice = 'api/police';     
export const deleteAdmins = 'api/admins'; 
export const deleteAmbulance = 'api/ambulances';       
export const deletePolice = 'api/police';   
export const deleteHospital = 'api/hospitals';   

export const getSalt = 'http://localhost:3000/api/salts';        
export const addSalt = 'api/salts';        
export const deleteSalt = 'api/salts'; 


// Page titles
export const DASHBOARD = 'Dashboard';
export const ADMINISTRATOR = 'Administrator';
export const HOSPITALS = 'Hospitals';
export const POLICE = 'Initiator';
export const AMBULANCE = 'Ambulance';
export const PROFILE = 'Profile';
export const ABOUT = 'About AIS'