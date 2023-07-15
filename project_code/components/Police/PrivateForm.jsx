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

export const PrivateForm = ({addPopup, setAddPopup, setDataContacts, dataContacts}) => {
    const { state: state1, send: send1, events: events1 } = useContractFunction(ACCOUNT_INSTANCE, 'addInitiator');
    const [showMessage1, setShowMessage1] = useState(false);

    const [addFormData, setAddFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
        event.preventDefault();

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData }
        newFormData[fieldName] = fieldValue;

        setAddFormData(newFormData);
    }

    // Once the 'submit" button is used in the add button form,
    // the data will be used in a new object (newContacts) that adds an id, and 
    // that new object gets added to the table.
    const handleAddFormSubmit = async (event) => {
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
            firstName: addFormData.firstName,
            lastName: addFormData.lastName,
            email: addFormData.email,
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
                'X-method': 'private'
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
            {/* <form className={stylesP.formPadding} onSubmit={finalizeAddInitiator}> FOR DB TESTING PURPOSES*/}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <TextField
                    type="text"
                    name="firstName"
                    label="First Name"
                    variant="standard"
                    placeholder="First Name"
                    className={stylesP.formInput}
                    required
                    onChange={handleAddFormData}
                />
                <TextField
                    type="text"
                    name="lastName"
                    label="Last Name"
                    variant="standard"
                    placeholder="Last Name"
                    className={stylesP.formInput}
                    required
                    onChange={handleAddFormData}
                />
            </div>
                <TextField
                    type="text"
                    name="email"
                    label="Email"
                    variant="standard"
                    placeholder="Email"
                    className={stylesP.formInput}
                    required
                    onChange={handleAddFormData}
                />
                <FormWalletID handleAddFormData={handleAddFormData}/>
                <FormAddress handleAddFormData={handleAddFormData}/>
                <br />
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

