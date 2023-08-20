import * as React from 'react';
import stylesP from '../../styles/Popup.module.css';
import * as Constants from '../../constants';
import InitiatorDataGrids from './InitiatorDataGrids';

/**
 * Creates the table containing the police information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} popUpChecked Boolean -if true, allows for adding/deleting police; false otherwise.
 */
export default function InitiatorHandler({data, popUpChecked}) {
    let emergencyArr = [];
    let privateArr = [];
    let interfacilityArr = [];

    for (let row in data) {
        let initType = data[row].initiatorType;
        let accType = data[row].accountType;

        if (initType === "emergency") {
            emergencyArr.push(data[row]);
        } else if (initType === "private") {
            privateArr.push(data[row]);
        } else if (initType === "facility" || accType === "interfacility") {
            interfacilityArr.push(data[row]);
        }
    }

    const emergencyColumns = [
        { field: 'policeDept', headerName: 'Police Department', width: 225, sortable: true},
        { field: 'stationNumber', headerName: 'Station', width: 80,  sortable: false},
        { field: 'address', headerName: 'Address', width: 225, sortable: true},
        { field: 'city', headerName: 'City', width: 120, sortable: true},
        { field: 'state', headerName: 'State', width: 100, sortable: true},
        { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
        { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
    ];

    const privateColumns = [
        { field: 'firstName', headerName: 'First Name', width: 100, sortable: true},
        { field: 'lastName', headerName: 'Last Name', width: 100,  sortable: true},
        { field: 'email', headerName: 'Email', width: 225,  sortable: true},
        { field: 'address', headerName: 'Address', width: 225, sortable: true},
        { field: 'city', headerName: 'City', width: 120, sortable: true},
        { field: 'state', headerName: 'State', width: 100, sortable: true},
        { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
        { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
    ];
    
    const interfacilityColumns = [
        { field: 'facilityName', headerName: 'Facility Name', width: 200, sortable: true},
        { field: 'address', headerName: 'Address', width: 225, sortable: true},
        { field: 'city', headerName: 'City', width: 120, sortable: true},
        { field: 'state', headerName: 'State', width: 100, sortable: true},
        { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
        { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
        { field: Constants.accountType, headerName: 'Account Type', width: 150, sortable: true},
    ];

    return (
        <jsx>
            <div style={{ height: 400, width: '100%' }}>
                <h2 className={stylesP.headingText}>Emergency Initiators</h2>
                <InitiatorDataGrids data={emergencyArr} popUpChecked={popUpChecked} columns={emergencyColumns} type={"emergency"}/>
            </div>   
            
            <div style={{ height: 400, width: '100%' }}>
                <h2 className={stylesP.headingText}>Private Initiators</h2>
                <InitiatorDataGrids data={privateArr} popUpChecked={popUpChecked} columns={privateColumns} type={"private"}/>
            </div>    

            <div style={{ height: 400, width: '100%' }}>
                <h2 className={stylesP.headingText}>Facility Initiators</h2>
                <InitiatorDataGrids data={interfacilityArr} popUpChecked={popUpChecked} columns={interfacilityColumns} type={"interfacility"}/>
            </div>  
        </jsx>
  );
}
