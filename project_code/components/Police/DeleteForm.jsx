import React from "react";
import stylesP from '../../styles/Popup.module.css';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Popup from '../Popup/Popup';
import { useState } from 'react';
import { Button } from '@mui/material';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import { ACCOUNT_INSTANCE } from '../../pages/_app';
import * as Constants from '../../pages/constants';

export const DeleteForm = ({deletePopup, setDeletePopup, selectedRows, dataContacts, setDataContacts, data, showMessage2, setShowMessage2}) => {
    const { state, send: send2, events } = useContractFunction(ACCOUNT_INSTANCE, 'removeInitiator');
    const { state: state3, send: send3, events: events3 } = useContractFunction(ACCOUNT_INSTANCE, 'removeHospital');

    const [deleteInterfacility, setDeleteInterfacility] = useState(false);

    // Queries the database to delete the selected rows and removes them from the datagrid
    const deleteRows = async (event) => {
        event.preventDefault();

        // Removes each police from the blockchain
        selectedRows.forEach( removeId => {
           for (let row in data) {
                // if user is interfacility, remove from facility and initiator in blockchain
                if (removeId === data[row].walletId && data[row].accountType === 'interfacility') {
                    setDeleteInterfacility(true);
                    send2(removeId);
                    send3(removeId);
                } else if (removeId === data[row].walletId) {
                    send2(removeId);
                }
           }
        });  
        
        await delay(2000);
        setShowMessage2(true);
    }

    const finalizeDeleteInitiator = async () => {
        let response = await fetch(Constants.deletePolice, {
            method: 'DELETE',
            body: JSON.stringify(selectedRows)
        });

        let status = await response.json();        
        if(status.success) {
            setDataContacts(dataContacts.filter(checkSelected))
            setDeletePopup(false);
        } else if (status.success) {
            alert(`Error removing ${Constants.POLICE} from DB, please contact SuperAdmin`);
        }

        setShowMessage2(false);
        setDeleteInterfacility(false);
    }

    // Helper function for deleteRows to update the datagrid with deletions
    // Returns the rows which are NOT being deleted
    function checkSelected(row) {
        if( !(selectedRows.includes(row.id)) ) {
            return row;
        }
    }

    return (
        <Popup trigger={deletePopup} setTrigger={setDeletePopup} style={{width: "10%"}} >
        <div className={stylesP.deleteEntry}>
            <h1>Are you sure?</h1>
            <body>Are you sure you want to delete the selected rows? This action cannot be undone.</body>
            <Button onClick={() => setDeletePopup(false)} style={{margin: '10px'}} variant="outlined" >
                Cancel
            </Button>
            <Button onClick={deleteRows} style={{margin: '10px'}} color="error" variant="contained">
                Delete
            </Button>
        </div>
        {(function () {
            if (showMessage2) {
                if (state.status === 'Mining' && !deleteInterfacility) {
                    return (
                    <div>
                        <Alert severity="warning">Waiting for {Constants.POLICE}(s) to be deleted</Alert>
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    </div>
                    )
                } else if (state.status === 'Mining' && state3.status === 'Mining') {
                    return (
                        <div>
                            <Alert severity="warning">Waiting for Interfacility to be deleted</Alert>
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress />
                            </Box>
                        </div>
                    )
                }
                if (transactionErrored(state) && !deleteInterfacility) {
                    return (
                    <div>
                        <Alert severity="error">Transaction failed: {state.errorMessage}</Alert>
                    </div>
                    )
                } else if ((transactionErrored(state3) || transactionErrored(state)) && deleteInterfacility) {
                    if (transactionErrored(state3)) {
                        return (
                        <div>
                            <Alert severity="error">Transaction failed: {state3.errorMessage}</Alert>
                        </div>
                        )
                    } else if (transactionErrored(state)) {
                        return (
                            <div>
                                <Alert severity="error">Transaction failed: {state.errorMessage}</Alert>
                            </div>
                        )
                    }
                }
                if (state.status === 'Success' && events != undefined && !deleteInterfacility) {
                    return (
                    <div>
                        <Alert severity="success">Your transaction was successful! {Constants.POLICE}(s) were deleted from the blockchain</Alert>
                        <Button color='success' onClick={finalizeDeleteInitiator}>Finalize and Exit</Button>
                    </div>
                    )
                } else if (state.status === 'Success' && events != undefined &&
                           state3.status === "Success" && events3 != undefined) {
                    return (
                        <div>
                            <Alert severity="success">Your transaction was successful! Interfacility account was deleted from the blockchain</Alert>
                            <Button color='success' onClick={finalizeDeleteInitiator}>Finalize and Exit</Button>
                        </div>
                    );
                }
            }
        })()}
    </Popup>
    )
}

const delay = ms => new Promise(res => setTimeout(res, ms));
