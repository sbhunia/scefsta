DROP DATABASE IF EXISTS AIS;
CREATE DATABASE AIS;

USE AIS;

CREATE TABLE Users (
            walletId            VARCHAR(42)    NOT NULL,
            firstName           VARCHAR(50),
            lastName            VARCHAR(50),
            email               VARCHAR(50),
            address             VARCHAR(50)     NOT NULL,
            city                VARCHAR(50)     NOT NULL,
            state               VARCHAR(50)     NOT NULL,
            zipcode             INT             NOT NULL,
            policeDept          VARCHAR(50),
            stationNumber       VARCHAR(50),
            transportCompany    VARCHAR(100),
            licensePlate        VARCHAR(50),
            facilityName        VARCHAR(100),
            initiatorType ENUM('emergency', 'private', 'facility'),
            accountType ENUM('admin', 'initiator', 'facility', 'transport', 'interfacility')     NOT NULL,
            PRIMARY KEY (walletId)
);

CREATE TABLE Patients (
            patientId           INT             NOT NULL AUTO_INCREMENT,
            name                VARCHAR(50),
            gender              VARCHAR(20),
            age                 INT,
            address             VARCHAR(50)     NOT NULL,
            city                VARCHAR(50)     NOT NULL,
            state               VARCHAR(50)     NOT NULL,
            zipcode             INT             NOT NULL,
            injuries            VARCHAR(200),
            mechanismOfInjury   VARCHAR(50),
            severity            VARCHAR(50),
            status              ENUM('pending', 'incoming', 'accepted', 'reclaimed', 'retracted')     NOT NULL,
            PRIMARY KEY (patientId)
);

CREATE TABLE Salts (
            saltId int NOT NULL AUTO_INCREMENT,
            walletId VARCHAR(100) NOT NULL,
            patientId int NOT NULL,
            bidId int NOT NULL,
            saltVal BIGINT NOT NULL,
            bidVal INT NOT NULL,
            penalty INT NOT NULL,
            PRIMARY KEY (saltId),
            FOREIGN KEY (walletId) REFERENCES Users(walletId),
            FOREIGN KEY (patientId) REFERENCES Patients(patientId)
);

/*** Default Data ***/
INSERT INTO Users (walletId, firstName, lastName, email, address, city, state, zipcode, accountType, initiatorType)
    VALUES ('0xAd6cacC05493c496b53CCa73AB0ADf0003cB2D80', 'Owen', 'Campbell', 'campbeo2@miamioh.edu', 
    '311 Thatcher Loop', 'Oxford', 'Ohio', 45056, 'admin', 'private');

INSERT INTO Users (walletId, firstName, lastName, email, address, city, state, zipcode, accountType)
    VALUES ('0xEE8fb1E70B2Cd462cC0eE0ABb12B36db6D0932B2', 'Liberty', 'Oliver', 'admin@gmail.com', 
    '107 E Spring St', 'Oxford', 'Ohio', 45056, 'admin');

INSERT INTO Users (walletId, address, city, state, zipcode, facilityName, accountType)
    VALUES ('0x37b17D21569C2cA6c7A078f2283D06BC222F554C', '14W Park Place, Suite C', 'Oxford', 
    'Ohio', 45056, 'Oxford Urgent Care', 'facility');

INSERT INTO Users (walletId, address, city, state, zipcode, policeDept, stationNumber, initiatorType, accountType)
    VALUES ('0xcdF98E3f41A0160360884f67BF8FfF35D92d4E2f', '101 E High St', 'Oxford', 'Ohio', 45056,
     'Oxford Police Dept', '1', 'emergency', 'initiator');

INSERT INTO Users (walletId, firstName, lastName, email, address, city, state, zipcode, initiatorType, accountType)
    VALUES ('0xC53762A6D1E4557Ab363eE38042828fcfBF064bE', 'Sharon', 'Mihalis', 'private@gmail.com', 
    '112 S Poplar St Apt 4', 'Oxford', 'Ohio', 45056, 'private', 'initiator');

INSERT INTO Users (walletId, address, city, state, zipcode, facilityName, initiatorType, accountType)
    VALUES ('0xb153eDE174EDC76EA00D706ce678b3aF28379887', '110 N Poplar St', 'Oxford', 
    'Ohio', 45056, 'McCullough-Hyde Memorial Hospital', 'facility', 'interfacility');

INSERT INTO Users(walletId, address, city, state, zipcode, transportCompany, licensePlate, accountType)
    VALUES ('0x9f8d25e9e3261d328e1Bef34CdbadB9310E451Fc', '311 Thatcher Loop', 'Oxford', 'Ohio', 45056,
    'GoodHealth Transport', 'HHA 6982', 'transport')

/******* Test Data ******/

-- /* Hospitals */
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1DnkEH4zGcCTDqJboBUT15cNtoNHbq4Kqf', 'Inigo', 'Murcutt', 'imurcutt1@cnbc.com', '217.226.82.185', 'imurcutt1', '110 N. Poplar St.', 'Oxford', 'Ohio', null, null, 'McCullough-Hyde Memorial Hospital', null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1EuQMyqZHZNU44ukXgtRAaNkGAQuYSQHNC', 'Ambur', 'Puddifer', 'apuddiferc@gravatar.com', '54.180.103.220', 'apuddiferc', '8614 Shepherd Farm Drive', 'West Chester', 'Ohio', null, null, 'Beckett Springs Hospital', null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1JuBUNvHbApGvtEa91XBj67rW4j8Jecq2n', 'Rosita', 'Fishwick', 'rfishwick3@scribd.com', '255.224.253.2', 'rfishwick3', '3075 Hamilton-Mason Road', 'Hamilton', 'Ohio', null, null, 'Bethesda Butler Hospital', null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('15gm7rTmeZybRBHG5YFosiQNzYsxoQm9sn', 'Genovera', 'Christophe', 'gchristophe4@photobucket.com', '82.10.20.223', 'gchristophe4', '6939 Cox Road', 'Liberty Township', 'Ohio', null, null, 'The Christ Hospital Medical Center - Liberty Township', null);   
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1F5C1YnjnfP8afMo2rgmNzCBZP6dTTPWyR', 'Gaby', 
-- 'Cecere', 'gcecere7@topsy.com', '230.108.65.20', 'gcecere7', '630 Eaton Ave', 'Hamilton', 'Ohio', null, null, 'Kettering Health Hamilton', null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1MX2d2jkwGULGAQyozrqZKA9S3Qg83eNrg', 'Candis', 'Danks', 'cdanks8@constantcontact.com', '87.34.152.3', 'cdanks8', '3000 Mack Rd.', 'Fairfield', 'Ohio', null, null, 'Mercy Health - Fairfield Hospital', null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('13XngTHLgGv7RnvCgJik3Z788DobThsXko', 'Rene', 
-- 'Kendell', 'rkendell9@reddit.com', '214.107.41.188', 'rkendell9', '7700 University Drive', 'West Chester', 'Ohio', null, null, 'West Chester Hospital', null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('19Y8LRs9zcKvznphuQbkscqpF3YeH46ukM', 'Kesley', 'Harrismith', 'kharrismithb@jimdo.com', '46.172.12.243', 'kharrismithb', '7750 Discovery Drive', 'West Chester', 'Ohio', null, null, 'The West Chester Hospital Surgical Center', null);


-- /* Police */
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1HHRofTaCBHLKz7Jt15BpyWYyszGTEM32f', 'Jacob', 'Linscott', 'jlinscott0@livejournal.com', '144.139.215.145', 'jlinscott0', '20086 Farragut Junction', 'Prescott', 'Arizona', 'Prescott Police Department', '1', null, null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('14TJnbdoqFWAAg6Z4VD8T6HnJ5VmA4PViL', 'Vannie', 'Bottrell', 'vbottrell5@ifeng.com', '75.91.12.14', 'vbottrell5', '52256 Alpine Road', 'Cincinnati', 'Ohio', 'Cincinnati Police Department', '3', null, null);
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('18qrb3P1rtyRkyc8uEZWbxJDkdErKkD4T1', 'Edsel', 'Killeley', 'ekilleleya@wired.com', '26.33.70.92', 'ekilleleya', '01112 Hudson Plaza', 'Denver', 'Colorado', 'Denver Police Department', '1', null, null);

-- /* Ambulances */
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('12a1pFk7igGbmWpKMSyDAoPQ7rwPN3jHBg', 'Wadsworth', 'Cordle', 'wcordle2@dion.ne.jp', '185.137.217.75', 'wcordle2', '86380 Jay Junction', 'Reno', 'Nevada', null, null, null, '9UUD 94');
-- insert into Users (walletId, firstName, lastName, email, ipAddress, username, address, city, state, policeDept, stationNumber, hospitalSystem, licensePlate) values ('1HEi5LC4WbWadvKz3n9yWS4NgXXb6bYXt7', 'Geoffrey', 'Knok', 'gknok6@berkeley.edu', '187.143.175.177', 'gknok6', '7265 East Terrace', 'Los Angeles', 'California', null, null, null, 'FEL-7471');

/* Patients */
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (1, 'Filbert Woodwind', 'Male', 30, '71453 Gale Alley', 'Philadelphia', 'Pennsylvania', 'incoming', 'broken arm', 'car accident');
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (2, 'Josefina Krollmann', 'Female', 97, '07063 Farragut Street', 'Charlotte', 'North Carolina', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (3, 'Arleta Power', 'Female', 55, '25 Rieder Court', 'Pasadena', 'Texas', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (4, 'Lindie Hardingham', 'Female', 84, '04 American Ash Way', 'Dallas', 'Texas', 'incoming', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (5, 'Annecorinne Lisciandro', 'Female', 64, '2440 Sheridan Circle', 'Miami', 'Florida', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (6, 'Prudence Ditt', 'Female', 88, '738 Truax Pass', 'Houston', 'Texas', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (7, 'Rossy Engeham', 'Male', 82, '9 Talisman Lane', 'Washington', 'District of Columbia', 'incoming', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (8, 'Dalia Pahler', 'Female', 2, '5 Northview Plaza', 'Fairfax', 'Virginia', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (9, 'Demott Da Costa', 'Male', 70, '46 Burrows Park', 'San Diego', 'California', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (10, 'Ivan Gatlin', 'Male', 82, '3457 Old Gate Circle', 'Salt Lake City', 'Utah', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (11, 'Petronille Busby', 'Female', 36, '325 Anzinger Circle', 'Cleveland', 'Ohio', 'incoming', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (12, 'Cassius Mumbray', 'Non-binary', 73, '6 Fairview Point', 'Carol Stream', 'Illinois', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (13, 'Blithe Grunson', 'Female', 22, '37277 Parkside Pass', 'Kansas City', 'Missouri', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (14, 'Celestyn O''Gleasane', 'Female', 18, '618 Namekagon Plaza', 'Youngstown', 'Ohio', 'accepted', NULL, NULL);
-- insert into Patients (patientId, name, gender, age, address, city, state, status, injuries, mechanismOfInjury) values (15, 'Leroy Sturrock', 'Male', 93, '8202 Mayer Place', 'Portland', 'Oregon', 'accepted', NULL, NULL);

/*
    CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'alpine';
    GRANT ALL PRIVILEGES ON *.* TO 'testuser'@'localhost';  
*/
