import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from '../Popup/Popup';
import stylesP from '../../styles/Popup.module.css'
import * as Constants from '../../pages/constants';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import { ACCOUNT_INSTANCE } from '../../pages/_app';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
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
        console.log("row", data[row].initiatorType);
        let initType = data[row].initiatorType;
        if (initType === "emergency") {
            emergencyArr.push(data[row]);
        } else if (initType === "private") {
            privateArr.push(data[row]);
        } else if (initType === "facility") {
            interfacilityArr.push(data[row]);
        }
    }

    const emergencyColumns = [
        { field: 'policeDept', headerName: 'Police Department', width: 270, sortable: true},
        { field: 'stationNumber', headerName: 'Station', width: 80,  sortable: false},
        { field: 'address', headerName: 'Address', width: 175, sortable: true},
        { field: 'city', headerName: 'City', width: 120, sortable: true},
        { field: 'state', headerName: 'State', width: 100, sortable: true},
        { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
        { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
    ];

    const privateColumns = [
        { field: 'firstName', headerName: 'First Name', width: 100, sortable: true},
        { field: 'lastName', headerName: 'Last Name', width: 100,  sortable: false},
        { field: 'email', headerName: 'Email', width: 80,  sortable: false},
        { field: 'address', headerName: 'Address', width: 175, sortable: true},
        { field: 'city', headerName: 'City', width: 120, sortable: true},
        { field: 'state', headerName: 'State', width: 100, sortable: true},
        { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
        { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
    ];
    
    const interfacilityColumns = [
        { field: 'facilityName', headerName: 'Facility Name', width: 200, sortable: true},
        { field: 'address', headerName: 'Address', width: 175, sortable: true},
        { field: 'city', headerName: 'City', width: 120, sortable: true},
        { field: 'state', headerName: 'State', width: 100, sortable: true},
        { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
        { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
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
