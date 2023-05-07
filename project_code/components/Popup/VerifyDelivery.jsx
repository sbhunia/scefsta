import styles from '../../styles/Patients.module.css';
import React from 'react';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import { ambulance_abi, contractAddress } from '../../config';
import { Contract } from '@ethersproject/contracts';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import stylesP from '../../styles/Popup.module.css'
import { Input, Typography } from '@mui/material';

/**
 * 
 * @param {*} tenderID ID of the tender
 * @param {*} row patient row
 * @returns 
 */
export default function VerifyDelivery( { tenderID, row } ) {
    // Creating ambaulanceBounties contract
    const ambulanceBounties = new Contract(contractAddress, ambulance_abi);
;
    // Obtaining React Hooks from reclaimTender smart contract function
    const {send, state} = useContractFunction(ambulanceBounties, 'verifyDelivery');

    const handleVerifyDelivery = () => {
        send(tenderID);
    }

    return (
        <div className={styles.editHospital}>
            <div style={{ display: 'flex' }}>
                <Typography variant="h4" component="div" gutterBottom className={stylesP.editHospital}>Confirm Patient Arrival</Typography>
            </div>

            <div className={stylesP.centerContents}>
                <p> <strong>Name: </strong> <text className={stylesP.floatRightElement} >{row['row']['name']}</text> </p>
                <p> <strong>Gender: </strong> <text className={stylesP.floatRightElement} >{row['row']['gender']}</text> </p>
                <p> <strong>Age: </strong> <text className={stylesP.floatRightElement} >{row['row']['age']}</text> </p>
                <p> <strong>Injury/Injuries: </strong> <text className={stylesP.floatRightElement} >{row['row']['injuries']}</text>
                </p>
                <p> <strong>Mechanism of Injury: </strong> <text className={stylesP.floatRightElement} >{row['row']['mechanismOfInjury']}</text></p>
                <p> <strong>Location: </strong> <text className={stylesP.floatRightElement} >{row['row']['address']}, {row['row']['city']}, {row['row']['state']}</text> </p>
                <p> <strong>Time of Arrival: </strong> <text className={stylesP.floatRightElement} ><Input type="time" id="fname" name="fname" />
                    <Input type="date" id="fname" name="fname" /> </text> </p>
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
                        </div>
                    )
                }
            })()}
        </div>
    )
}