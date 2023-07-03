import styles from '../../styles/Tender.module.css';
import React from 'react';
import Button from '@mui/material/Button';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { ACCOUNT_INSTANCE } from '../../pages/_app';
import * as Constants from '../../pages/constants';

/**
 * 
 * @param {*} tenderID ID of the tender
 * @param {*} bidValue value of the ambulance's bid
 * @param {*} penaltyAmt the penalty amount of the tender
 * @returns 
 */
export default function RevealBid( { tenderID, penaltyAmt } ) {
    const { account } = useEthers();

    //Hooks
    const [bidValue, setBidValue] = React.useState(0);
    const [bidID, setBidID] = React.useState(0);
   
    // Obtaining React Hooks from reclaimTender smart contract function
    const {send, state} = useContractFunction(ACCOUNT_INSTANCE, 'revealBid');

    const handlebidValue = (event) => {
        setBidValue(event.target.value)
    }

    const handleBidID = (event) => {
        setBidID(event.target.value)
    }

    console.log(state);

    // When button is clicked, the tender is reclaimed
    const handleRevealBid = async () => {
        const saltInfo = {
            patientId: tenderID,
            bidId: bidID,
            walletId: 
        };

        // get the salt value
        let response = await fetch(Constants.getSalt, {
            method: 'GET',
            body: JSON.stringify(saltInfo)
        });

        /**
         * revealBid(tenderID, bidValue, salt, bidID)
         * tenderID - ID of the tender
         * bidValue - wei value of bid
         * salt - 10 digit salt (all are 1234567890 for simplicity)
         * bidID - ID of the bid
         * penaltyAmt - msg.value
         * 
         */
        send(tenderID, bidValue, 10, bidID, {value: penaltyAmt});
    }

    return (
        <div className={styles.editHospital}>
            <h2>Bid Reveal</h2>
            <div>
                <FormControl fullWidth variant="filled" className={styles.givenRewardDiv}>
                    <InputLabel htmlFor="filled-adornment-amount">Please re-enter your bid value:</InputLabel>
                    <FilledInput
                        id="filled-adornment-amount"
                        value={bidValue}
                        onChange={handlebidValue}
                        startAdornment={<InputAdornment position="start">WEI</InputAdornment>}
                    />
                </FormControl>
                <FormControl fullWidth variant="filled" className={styles.givenRewardDiv}>
                    <InputLabel htmlFor="filled-adornment-amount">Enter your unique bid ID:</InputLabel>
                    <FilledInput
                        id="filled-adornment-amount"
                        value={bidID}
                        onChange={handleBidID}
                    />
                </FormControl>
            </div>
            <Alert severity="info">
                <i>Remember</i>: the <strong>penalty fee associated with this job will be put in escrow.</strong> If your bid succeeds,
                your penalty funds will be returned to you.
            </Alert>
            <div className={styles.buttonDiv}>
                <Button variant="contained" onClick={handleRevealBid}>Reveal Bid</Button>
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
                            <Alert severity="error">Bid reveal failed: {state.errorMessage}</Alert>
                        </div>
                    )
                }
                if (state.status === 'Success') {
                    return (
                        <div>
                            <Alert severity="success">Your bid has won!</Alert>
                        </div>
                    )
                }
            })()}
        </div>
    )
}