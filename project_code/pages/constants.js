// Page URLs   
export const DevHomeURL = '/home';                                     
export const DevAdminURL = '/admin';                                
export const DevHospitalURL = '/hospital';                          
export const DevPoliceURL = '/police';                              
export const DevAmbulanceURL = '/ambulance';                        
export const DevProfileURL = '/profile';                            
export const DevAboutURL = '/about';                                

// Database constansts, used in queries with the database
// user table
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
export const Users = 'Users';
export const Patients = 'Patients';

// patient table
export const patientId = "patientId";
export const name = "name";
export const gender = "gender";
export const age = "age";
export const status = "status";
export const injuries = "injuries";
export const mech = "mechanismOfInjury";

// API URLs
export const getPatients = 'http://localhost:3000/api/patients';        
export const getPolice = 'http://localhost:3000/api/police';            
export const getAmbulances ='http://localhost:3000/api/ambulances';     
export const getHospitals = 'http://localhost:3000/api/hospitals';      
export const getTenders = 'http://localhost:3000/api/tenders';          
export const addAmbulance = 'api/ambulances';                           
export const addHospital = 'api/hospitals';                            
export const addPolice = 'api/police';      
export const deleteAmbulance = 'api/ambulances'       
export const deletePolice = 'api/police'   
export const deleteHospital = 'api/police'   

// Page titles
export const DASHBOARD = 'Dashboard';
export const ADMINISTRATOR = 'Administrator';
export const HOSPITALS = 'Hospitals';
export const POLICE = 'Police';
export const AMBULANCE = 'Ambulance';
export const PROFILE = 'Profile';
export const ABOUT = 'About AIS'