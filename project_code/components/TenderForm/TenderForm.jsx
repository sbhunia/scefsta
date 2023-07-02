import React from 'react'
import { useContractFunction, transactionErrored} from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { auctions_abi, auctionsAddress } from '../../config';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import styles from '../../styles/TenderForm.module.css';
import { Select, Typography, TextField, Button, ButtonGroup, Input, MenuItem, OutlinedInput, InputLabel, Divider, InputAdornment } from '@mui/material';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { postTender } from '../../solidityCalls';
import { AUCTION_INSTANCE } from '../../pages/_app';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const injuryTypes = [
    'Broken Bone',
    'Sprain',
    'Laceration',
    'Concussion',
    'Hemorrhage',
    'Traumatic Brain Injury',
    'Skull fracture',
    'Other'
];

const mechanismsOfOnjury = [
    'Vehicular Crash',
    'Assault',
    'Battery',
    'Stab',
    'Gunshot',
    'Fall',
    'Fire',
    'Other'
]

function getStyles(name, injuryType, theme) {
    return {
      fontWeight:
        injuryType.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
}

// function ethToWei(eth) {
//     return eth * 1000000000000000000n;
// }

/**
 * Handles adding data to the MongoDB data for patients and tenders
 * @param {*} patient 
 * @param {*} tender 
 * @returns 
 */
 async function handlePost(patient, tender) {

    let patients = await fetch('api/patients', {
        method: 'POST',
        body: JSON.stringify(patient)
    });
    let patientData = await patients.json();

    let tenders = await fetch('api/tenders', {
        method: 'POST',
        body: JSON.stringify(tender)
    });

    let tendersData = await tenders.json();

    if (patientData.success && tendersData.success) {
        return true;
    } else {
        return false;
    }
}

export default function TenderForm() {
    const theme = useTheme();
    const [name, setName] = React.useState('');
    const [injuryType, setInjuryType] = React.useState([]);
    const [severity, setSeverity] = React.useState('');
    const [mechanismofInjury, setMechanismOfInjury] = React.useState([]);
    const [tenderAmt, setTenderAmt] = React.useState(0);
    const [penaltyAmt, setPenaltyAmt] = React.useState(0);
    const [auctionLength, setAuctionLength] = React.useState(30);
    const [deliveryTime, setDeliveryTime] = React.useState(900);
    const [location, setLocation] = useState("");
    const [stateIn, setStateIn] = useState("");
    const [city, setCity] = useState("");

    const [allowedHospitals, setAllowedHospital] = useState(["0x37b17D21569C2cA6c7A078f2283D06BC222F554C"]);

    // Creating ambulanceBounties contract
    const ambulanceBounties = new Contract(auctionsAddress, auctions_abi);
    // Obtaining React Hooks from postTender smart contract function
    const {state , send: send1, events} = useContractFunction(AUCTION_INSTANCE, 'postTender');

    const handleChangeName = (event) => {
        setName(event.target.value);
    }
    const handleChangeInjury = (event) => {
        const {
          target: { value },
        } = event;
        setInjuryType(
          // On autofill we get a the stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleChangeSeverity = (event) => {
        setSeverity(event.target.value);
    };
    const handleSetMechOfInjury = (event) => {
        setMechanismOfInjury(event.target.value);
    };
    const handleChangeTender = (event) => {
        setTenderAmt(event.target.value);
    };
    const handleChangePenalty = (event) => {
        setPenaltyAmt(event.target.value);
    };
    const handleChangeAuctionLength = (event) => {
        setAuctionLength(event.target.value);
    };

    const handleChangeDeliveryTime = (event) => {
        setDeliveryTime(event.target.value);
    }

    const handleSetLocation = (event) => { 
        setLocation(event.target.value);
    }
    const handleSetAllowedHospitals = (event) => {
        setAllowedHospital(event.target.value);
    }

    const handleSetCity = (event) => {
        setCity(event.target.value);
    }

    const handleSetStateIn = (event) => {
        setStateIn(event.target.value);
    }

    // auctionLength - how long in minutes the ambulnaces have to bid in the auction
    // location - the location of the incident
    // allowed hospitals - hospitals that are near enough to service patient(s)
    // penalty - cost for ambulance if job is not completed
    const confirm = async () => {
        // create patient in database
        const newPatient = {
            name: name,
            injury: injuryType,
            mechanism_of_injury: mechanismofInjury,
            address: location,
            city: city,
            state: stateIn,
            status: "posted",
            isAccepted: false,
        };

        console.log(newPatient);

        let response = await fetch('api/patients', {
            method: 'POST',
            body: JSON.stringify(newPatient)
        })

        // create tender for blockchain
        send1(auctionLength, deliveryTime, location, city, stateIn, penaltyAmt, severity, allowedHospitals, {value: tenderAmt});
    }

    const finalizeTransaction = () => {
        /**
         * Patient name, type of injury, location, isAccepted
         * Missing: age, gender, mechanism of injury, city, state
         */
        // const patient = {
        //     name: name,
        //     injury: injuryType,
        //     mechanism_of_injury: mechanismofInjury,
        //     address: location,
        //     isAccepted: false,
        //     tender_id: parseInt(events[0].args.index._hex)
        // }

        // /**
        //      * Expiration of tender, penalty fee, status of tender, severity
        //      */
        // const tender = {
        //     patient_name: name,
        //     expiration_time: auctionLength,
        //     penalty_amount: penaltyAmt,
        //     payment_amount: tenderAmt,
        //     address: location,
        //     status: "Open",
        //     severity: severity,
        //     tender_id: parseInt(events[0].args.index._hex)
        // }
        // // Submit data to MongoDB - critical step
        // handlePost(patient, tender)
    }

    return (
        <div className={styles.containerForm}>
            <div style={{ display: 'flex' }}>
                <LocalPoliceIcon style={{ fontSize: '2.6rem' }}/>
                <Typography variant="h4" component="div" gutterBottom className={styles.heading}>
                    Police Tender Form
                </Typography>
            </div>
            <form className={styles.tenderForm}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        label="Patient Name"
                        className={styles.formText}
                        variant="standard"
                        value={name}
                        onChange={handleChangeName}
                        helperText="If the name is unknown, enter UNKNOWN"/>
                    <TextField 
                        label="Enter the address of the incident"
                        className={styles.addressText}
                        value={location}
                        onChange={handleSetLocation}
                        variant="standard"/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <TextField
                        label="City"
                        className={styles.formText}
                        variant="standard"
                        value={city}
                        onChange={handleSetCity}/>
                    <TextField 
                        label="State"
                        className={styles.formText}
                        value={stateIn}
                        onChange={handleSetStateIn}
                        variant="standard"/>
                </div>
                <div>
                    <div className={styles.injuryDiv}>
                        <InputLabel id="injuryType">Injury Type</InputLabel>
                        <Select
                            labelId="injuryType"
                            id={styles.injuryType}
                            multiple
                            value={injuryType}
                            onChange={handleChangeInjury}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                            >
                            {injuryTypes.map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, injuryType, theme)}
                                >
                                {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className={styles.injuryDiv}>
                        <InputLabel id="severity">Severity</InputLabel>
                        <Select
                        labelId="severity"
                        id={styles.severity}
                        value={severity}
                        label="Severity Level"
                        onChange={handleChangeSeverity}
                        >
                            <MenuItem value={"Low"}>Low</MenuItem>
                            <MenuItem value={"Medium"}>Medium</MenuItem>
                            <MenuItem value={"High"}>High</MenuItem>
                            <MenuItem value={"Critical"}>Critical</MenuItem>
                        </Select>
                    </div>
                    <div className={styles.injuryDiv}>
                        <InputLabel id="severity">Mechanism of Injury</InputLabel>
                        <Select
                            labelId="mechanism_of_injury"
                            id={styles.mechanism}
                            multiple
                            value={mechanismofInjury}
                            label="Mechanism of Injury"
                            onChange={handleSetMechOfInjury}
                        >
                            {mechanismsOfOnjury.map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, mechanismofInjury, theme)}
                                >
                                {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={styles.paymentAmt}>
                        <InputLabel htmlFor="payment-amount">Payment Amount</InputLabel>
                        <Input
                            id="payment-amount"
                            className={styles.payInput}
                            value={tenderAmt}
                            onChange={handleChangeTender}
                            startAdornment={<InputAdornment position="start">WEI</InputAdornment>}
                            label="Payment Amount"
                        />
                    </div>
                    <div className={styles.penaltyAmt}>
                        <InputLabel htmlFor="penalty-amount">Penalty Amount</InputLabel>
                        <Input
                            id="penalty-amount"
                            className={styles.penaltyInput}
                            value={penaltyAmt}
                            onChange={handleChangePenalty}
                            startAdornment={<InputAdornment position="start">WEI</InputAdornment>}
                            label="Penalty Amount"
                        />
                    </div>
                </div>
                <div className={styles.injuryDiv}>
                    <InputLabel id="expiration">Auction Length</InputLabel>
                    <Select
                        labelId="expiration"
                        id={styles.severity}
                        value={auctionLength}
                        label="Auction Length"
                        onChange={handleChangeAuctionLength}
                    >
                        <MenuItem value={30}>30 Seconds</MenuItem>
                        <MenuItem value={60}>1 Minute</MenuItem>
                        <MenuItem value={90}>1.5 Minutes</MenuItem>
                        <MenuItem value={300}>5 Minutes</MenuItem>
                    </Select>
                </div>
                <div className={styles.injuryDiv}>
                    <InputLabel id="delivery-time">Delivery Time Limit</InputLabel>
                    <Select
                        labelId="delivery-time"
                        id={styles.severity}
                        value={deliveryTime}
                        label="Delivery Time Limit"
                        onChange={handleChangeAuctionLength}
                    >
                        <MenuItem value={300}>5 Minutes</MenuItem>
                        <MenuItem value={600}>10 Minutes</MenuItem>
                        <MenuItem value={900}>15 Minutes</MenuItem>
                        <MenuItem value={1800}>30 Minutes</MenuItem>
                    </Select>
                </div>
                    <div className={styles.buttonGroup}>
                        <ButtonGroup variant="contained" aria-label="outlined button group">
                            <Button color="success" onClick={confirm}>Confirm</Button>
                        </ButtonGroup>
                    </div>
                </form>
                <Divider variant="middle" className={styles.divider}/>
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
                                <Alert severity="error">Transaction failed: {state.errorMessage}</Alert>
                            </div>
                        )
                    }
                    if (state.status === 'Success' && events != undefined) {
                        return (
                            <div>
                                <Alert severity="success">Your transaction was successful! Please click the button to finalize the transaction.</Alert>
                                <Button color='success' onClick={finalizeTransaction}>Finalize and Exit</Button>
                            </div>
                        )
                    }
                }
                )()}
            </div>
    )
}
