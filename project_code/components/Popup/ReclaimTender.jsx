import styles from '../../styles/Popup.module.css';
import React from 'react';
import Button from '@mui/material/Button';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { AUCTION_INSTANCE } from '../../pages/_app';

async function deleteTenderPatient(tenderID) {
    try {
        await fetch('api/patients', {
            method: 'DELETE',
            body: tenderID
        })
        await fetch('api/tenders', {
            method: 'DELETE',
            body: tenderID
        })
    } catch (error) {
        console.log('Fail')
    }
}

export default function ReclaimTender( { tenderID } ) {
    // Obtaining React Hooks from reclaimTender smart contract function
    const {send, state, events} = useContractFunction(AUCTION_INSTANCE, 'reclaimTender');

    // When button is clicked, the tender is reclaimed
    const handleReclaimTender = () => {
        send(tenderID);
    }

    const finalizeTransaction = () => {
        deleteTenderPatient(tenderID);
    }

    return (
        <div className={styles.editHospital}>
            <h2>Reclaim Tender?</h2>
            <Alert severity="info"><i>Remember</i>: reclaim a tender once a job expires without being completed. 
             Your funds will be returned to you.</Alert>
            <Button onClick={handleReclaimTender}>
                <AssistantDirectionIcon style={{ fontSize: '36px', color: 'gray' }} />
            </Button>
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
                            <Alert severity="error">Tender reclaiming failed: {state.errorMessage}</Alert>
                        </div>
                    )
                }
                if (state.status === 'Success') {
                    return (
                        <div>
                            <Alert severity="success">Your tender was reclaimed! Please click the button to finalize the transaction.</Alert>
                            <Button color='success' onClick={finalizeTransaction}>Finalize and Exit</Button>
                        </div>
                    )
                }
            })()}
        </div>
    )
}