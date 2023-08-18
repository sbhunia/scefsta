import styles from '../../styles/Patients.module.css';
import React from 'react';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import stylesP from '../../styles/Popup.module.css'
import { Typography } from '@mui/material';
import { AUCTION_INSTANCE } from '../../pages/_app';
import Button from "@mui/material/Button";

/**
 * 
 * @param {*} tenderID ID of the tender
 * @param {*} row patient row
 * @returns 
 */
export default function VerifyDelivery( { tenderID, row } ) {
    // Obtaining React Hooks from reclaimTender smart contract function
    const {send, state} = useContractFunction(AUCTION_INSTANCE, 'verifyDelivery');

    const handleVerifyDelivery = () => {
        send(row['row']['id'] - 1);
    }

    const finalizeTransaction = async () => {
        const updatePatient = {
            patientId: row['row'][id],
            status: "accepted"
          }
      
          let response = await fetch("api/patients", {
            headers: {'x-method': 'update'},
            method: "POST",
            body: JSON.stringify(updatePatient),
          });
      
          let status = await response.json();
          if (status.success) {
            setTrigger(false);
          } else {
            alert(`Error updating patient in DB, contact the SuperAdmin`);
          }
    }

    return (
        <div className={styles.editHospital}>
            <div style={{ display: 'flex' }}>
                <Typography variant="h4" component="div" gutterBottom className={stylesP.editHospital}>Confirm Patient Arrival</Typography>
            </div>

            <div className={stylesP.centerContents}>
                <p> <strong>Patient ID: </strong> <text className={stylesP.floatRightElement} >{row['row']['id']}</text> </p>
                {/* <p> <strong>Injury/Injuries: </strong> <text className={stylesP.floatRightElement} >{row['row']['injuries']}</text>
                </p>
                <p> <strong>Mechanism of Injury: </strong> <text className={stylesP.floatRightElement} >{row['row']['mechanismOfInjury']}</text></p> */}
                {/* <p> <strong>Location: </strong> <text className={stylesP.floatRightElement} >{row['row']['address']}, {row['row']['city']}, {row['row']['state']}</text> </p>
                <p> <strong>Time of Arrival: </strong> <text className={stylesP.floatRightElement} ><Input type="time" id="fname" name="fname" />
                    <Input type="date" id="fname" name="fname" /> </text> </p> */}
            </div>

            <div className={stylesP.submitButtonDiv}>
                <button type="submit" className={stylesP.submitButton} onClick={handleVerifyDelivery}>
                    Confirm Arrival
                </button>
            </div>
            {(function () {
                if (state.status === 'Mining') {
                    return (
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    )
                }
                if (transactionErrored(state)) {
                    return (
                        <div>
                            <Alert severity="error">Verify Delivery: {state.errorMessage}</Alert>
                        </div>
                    )
                }
                if (state.status === 'Success') {
                    return (
                        <div>
                            <Alert severity="success">Patient successfully verified! Funds have been transferred!</Alert>
                            <Button color="successs" onClick={finalizeTransaction}>
                                Finalize and Exit
                            </Button>
                        </div>
                    )
                }
            })()}
        </div>
    )
}