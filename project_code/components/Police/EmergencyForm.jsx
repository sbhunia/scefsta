import React from "react";
import stylesP from '../../styles/Popup.module.css';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Popup from '../Popup/Popup';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import { ACCOUNT_INSTANCE } from '../../pages/_app';
import * as Constants from '../../pages/constants';
import FormAddress from "../FormComponents/FormAddress";
import { FormWalletID } from "../FormComponents/FormWalletID";

export const EmergencyForm = ({addPopup, setAddPopup, setDataContacts, dataContacts}) => {
    const { state: state1, send: send1, events: events1 } = useContractFunction(ACCOUNT_INSTANCE, 'addInitiator');
    const { state: state2, send: send2, events: events2 } = useContractFunction(ACCOUNT_INSTANCE, 'removeInitiator');

    const [showMessage1, setShowMessage1] = useState(false);

    const [addFormData, setAddFormData] = useState({
        policeDept: '',
        station: '',
        walletId: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
    });

    // Will read information written inside the add button's 
    // form and store the data in 'setAddFormData'
    const handleAddFormData = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        console.log(fieldName);
        console.log(fieldValue)
        const newFormData = { ...addFormData }
        newFormData[fieldName] = fieldValue;
        console.log(newFormData);
        setAddFormData(newFormData);
    }

    // Once the 'submit" button is used in the add button form,
    // the data will be used in a new object (newContacts) that adds an id, and 
    // that new object gets added to the table.
    const handleAddFormSubmit = async (event) => {
        event.preventDefault();
        setShowMessage1(false);

        // add to blockchain
        send1(addFormData.walletId);

        await delay(2000);
        setShowMessage1(true);

        // temporary delete function for blockchain
        //send2(addFormData.walletId);
    }

    const finalizeAddInitiator = async () => {
        const newContact = {
            policeDept: addFormData.policeDept,
            station: addFormData.station,
            address: addFormData.address,
            city: addFormData.city,
            state: addFormData.state,
            walletId: addFormData.walletId,
            zipcode: addFormData.zipcode,
        };

        let response = await fetch(Constants.addPolice, {
            method: 'POST',
            headers: {
                'X-method': 'emergency'
            },
            body: JSON.stringify(newContact)
        });

        newContact['id'] = newContact['walletId'];

        setDataContacts([...dataContacts, newContact,]);

        let data = await response.json();

        if (data.success) {
            setAddPopup(false);
        }

        setShowMessage1(false);
    }

    return (
        <Popup trigger={addPopup} setTrigger={setAddPopup}>
            <div className={stylesP.editHospital}>
                <h1>Add New {Constants.POLICE}</h1>
            </div>
            <form className={stylesP.formPadding} onSubmit={handleAddFormSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <TextField 
                    type="text" 
                    name="policeDept" 
                    label="Police Department" 
                    variant="standard" 
                    placeholder="Police Department"
                    className={stylesP.formInput}
                    required
                    onChange={handleAddFormData}
                />
                <TextField 
                    type="text" 
                    name="station" 
                    label="Station Identifier" 
                    variant="standard" 
                    placeholder="Police Station"
                    className={stylesP.formInput}
                    required
                    onChange={handleAddFormData}
                />
            </div>
                <FormWalletID handleAddFormData={handleAddFormData}/>
                <FormAddress handleAddFormData={handleAddFormData}/>
                <div className={stylesP.submitButtonDiv}>
                    <button type="submit" className={stylesP.submitButton}>
                        Submit
                    </button>
                </div>
            </form>
            {(function () {
                if (showMessage1) {
                    if (state1.status === 'Mining') {
                            return (
                            <div>
                                <Alert severity="warning">Waiting for {Constants.POLICE} to be added</Alert>
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            </div>
                            )
                        }
                    if (transactionErrored(state1)) {
                            return (
                            <div>
                            <Alert severity="error">Transaction failed: {state1.errorMessage}</Alert>
                            </div>
                            )
                        }
                    if (state1.status === 'Success' && events1 != undefined) {
                        return (
                            <div>
                                <Alert severity="success">Your transaction was successful! {Constants.POLICE} was added to the blockchain</Alert>
                            <Button color='success' onClick={finalizeAddInitiator}>Finalize and Exit</Button>
                            </div>
                        )
                    }
                }
            })()}
        </Popup>
    );
}

const delay = ms => new Promise(res => setTimeout(res, ms));

