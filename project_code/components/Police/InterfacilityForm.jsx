import React from "react";
import stylesP from '../../styles/Popup.module.css';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Popup from '../Popup/Popup';
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import { ACCOUNT_INSTANCE } from '../../pages/_app';
import * as Constants from '../../pages/constants';
import FormAddress from "../Address/FormAddress";

export const InterfacililtyForm = ({ addPopup, setAddPopup, setDataContacts, dataContacts }) => {
  const { state: state1, send: send1, events: events1 } = useContractFunction(ACCOUNT_INSTANCE, 'addInitiator');
  /* Temporary for issues with adding to DB */
  //const { state, send: send2, events } = useContractFunction(ACCOUNT_INSTANCE, 'removeInitiator');

  const [showMessage1, setShowMessage1] = useState(false);

  const [addFormData, setAddFormData] = useState({
    facilityName: '',
    walletId: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    accountType: 'reload',
  });

  const handleAddFormData = (event) => {
    //event.preventDefault();

    const fieldName = event.target.name;
    let fieldValue = event.target.value;

    if (fieldName === "zipcode") {
      console.log("zip found");
    } else if (fieldName === "walletId") {
        fieldValue = fieldValue.trim();
    }

    const newFormData = { ...addFormData }
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  }

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    setShowMessage1(false);

    send1(addFormData.walletId);

    await delay(2000);
    setShowMessage1(true);
  }

  const finalizeAddInitiator = async () => {
    const newContact = {
      facilityName: addFormData.facilityName,
      address: addFormData.address,
      city: addFormData.city,
      state: addFormData.state,
      walletId: addFormData.walletId,
      zipcode: addFormData.zipcode,
    };

    let response = await fetch(Constants.addPolice, {
      method: 'POST',
      headers: {
        'X-method': 'interfacility'
      },
      body: JSON.stringify(newContact)
    });

    newContact['id'] = newContact['walletId'];

    setDataContacts([...dataContacts, newContact]);

    let data = await response.json();

    if (data.success) {
      setAddPopup(false);
    } else if (!data.success) {
      alert("Error adding initiator to DB, please contact SuperAdmin");
    }

    setShowMessage1(false);
  }

  return (
    <Popup trigger={addPopup} setTrigger={setAddPopup}>
      <div className={stylesP.editHospital}>
        <h1>Add New {Constants.POLICE}</h1>
      </div>
      <Alert className={stylesP.warningText} severity="warning">NOTE: If Wallet ID is already registered as an {Constants.HOSPITAL} the account will become Interfacility</Alert>
      <form className={stylesP.formPadding} onSubmit={handleAddFormSubmit}>
        <TextField
          type="text"
          name="facilityName"
          label={Constants.HOSPITAL + " Name"}
          variant="standard"
          placeholder={Constants.HOSPITAL + " Name"}
          className={stylesP.formInput}
          required
          onChange={handleAddFormData}
        />
        <br />
        <TextField
          type="text"
          name="walletId"
          label="Wallet ID"
          variant="standard"
          placeholder="Wallet ID"
          className={stylesP.formInput}
          required
          onChange={handleAddFormData}
        />
        <br />
        <FormAddress handleAddFormData={handleAddFormData} />
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
