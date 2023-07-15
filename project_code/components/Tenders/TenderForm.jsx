import React from 'react'
import { useContractFunction, transactionErrored} from '@usedapp/core';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import styles from '../../styles/TenderForm.module.css';
import { Select, Typography, TextField, Button, ButtonGroup, Input, MenuItem, OutlinedInput, InputLabel, Divider, InputAdornment } from '@mui/material';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { AUCTION_INSTANCE } from '../../pages/_app';
import * as Constants from '../../pages/constants';
import FormAddress from '../FormComponents/FormAddress';
import stylesP from '../../styles/Popup.module.css';
import { verify } from 'crypto';
import { AllowedHospitals } from './AllowedHospitals';
import Popup from '../Popup/Popup';

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

export default function TenderForm(props) {
    const theme = useTheme();
    const [name, setName] = React.useState('');
    const [injuryType, setInjuryType] = React.useState([]);
    const [severity, setSeverity] = React.useState('');
    const [mechanismofInjury, setMechanismOfInjury] = React.useState([]);
    const [tenderAmt, setTenderAmt] = React.useState();
    const [penaltyAmt, setPenaltyAmt] = React.useState();
    const [auctionLength, setAuctionLength] = React.useState();
    const [deliveryTime, setDeliveryTime] = React.useState();
    const [location, setLocation] = useState("");
    const [stateIn, setStateIn] = useState("");
    const [city, setCity] = useState("");   
    const [zipcode, setZipcode] = useState("");
    const [isAuctionValid, setIsAuctionValid] = useState(true);
    const [isDeliveryValid, setIsDeliveryValid] = useState(true);
    const [isPaymentValid, setIsPaymentValid] = useState(true);
    const [isPenaltyValid, setIsPenaltyValid] = useState(true);
    
    const [allowedHospPopup, setAllowedHospPopup] = useState(false);
    const [allowedHospitals, setAllowedHospital] = useState(["0xAd6cacC05493c496b53CCa73AB0ADf0003cB2D80"]);

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

    const verifyNumber = (number) => {
        const regex = /^[0-9\b]+$/;
        return regex.test(number);
    }

    const handleAddFormData = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        
        if (fieldName === "address") {
            setLocation(fieldValue);
        } else if (fieldName === "city") {
            setCity(fieldValue);
        } else if (fieldName === "state") {
            setStateIn(fieldValue);
        } else if (fieldName === "zipcode") {
            setZipcode(fieldValue);
        } else if (fieldName === "auction") {
            setIsAuctionValid(verifyNumber(fieldValue));
            setAuctionLength(fieldValue);
        } else if (fieldName === "delivery") {
            setIsDeliveryValid(verifyNumber(fieldValue));
            setDeliveryTime(fieldValue);
        } else if (fieldName === "payment") {
            setIsPaymentValid(verifyNumber(fieldValue));
            setTenderAmt(fieldValue);
        } else if (fieldName === "penalty") {
            setIsPenaltyValid(verifyNumber(fieldValue));
            setPenaltyAmt(fieldValue);
        }
    }

    const getAllowedHospitals = () => {
        alert("here");
    }

    // auctionLength - how long in minutes the ambulnaces have to bid in the auction
    // location - the location of the incident
    // allowed hospitals - hospitals that are near enough to service patient(s)
    // penalty - cost for ambulance if job is not completed
    const confirm = async () => {
        // create tender for blockchain
        send1(auctionLength, deliveryTime, location, city, stateIn, zipcode, penaltyAmt, severity, allowedHospitals, {value: tenderAmt});
    }

    const finalizeTransaction = async () => {
        /**
         * Patient name, type of injury, location, isAccepted
         * Missing: age, gender, mechanism of injury, city, state
         */

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
            zipcode: zipcode
        };

        console.log(newPatient);

        let response = await fetch('api/patients', {
            method: 'POST',
            body: JSON.stringify(newPatient)
        })

        props.setTrigger(false);
    }

    return (
        <div className={styles.containerForm}>
            <div style={{ display: 'flex' }}>
                <LocalPoliceIcon style={{ fontSize: '2.6rem' }}/>
                <Typography variant="h4" component="div" gutterBottom className={styles.heading}>
                    {Constants.POLICE} Tender Form
                </Typography>
            </div>
            <form className={styles.tenderForm}>
                <div>
                    <h2 className={styles.headingText}>Location</h2>
                    <FormAddress handleAddFormData={handleAddFormData}/>
                    <br/>
                    <h2 className={styles.headingText}>Incident Information</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                <br/>
                <h2 className={styles.headingText}>Auction Information</h2>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div className={styles.dropdownDiv}>
                            <TextField
                                type="text"
                                name="payment"
                                label="Payment Amount (USD)"
                                variant="standard"
                                className={stylesP.formInput}
                                required
                                value={tenderAmt}
                                onChange={handleAddFormData}
                                error={!isPaymentValid}
                                helperText={!isPaymentValid && "Please enter a valid amount in WEI"}
                            />
                        </div>
                        <div className={styles.dropdownDiv}>
                            <TextField
                                type="text"
                                name="penalty"
                                label="Penalty Amount (USD)"
                                variant="standard"
                                placeholder="5"
                                className={stylesP.formInput}
                                required
                                value={penaltyAmt}
                                onChange={handleAddFormData}
                                error={!isPenaltyValid}
                                helperText={!isPenaltyValid && "Please enter a valid amount in WEI"}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.dropdownDiv} style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '1rem', paddingBottom: '2rem'}}>
                    <div className={styles.dropdownDiv}>
                        <TextField
                            type="text"
                            name="auction"
                            label="Auction Length (Minutes)"
                            variant="standard"
                            placeholder="5"
                            className={stylesP.formInput}
                            required
                            value={auctionLength}
                            onChange={handleAddFormData}
                            error={!isAuctionValid}
                            helperText={!isAuctionValid && "Please enter a valid time length in minutes"}
                        />
                    </div>
                    <div className={styles.dropdownDiv}>
                        <TextField
                            type="text"
                            name="delivery"
                            label="Delivery Time (Minutes)"
                            variant="standard"
                            placeholder="30"
                            className={stylesP.formInput}
                            required
                            value={deliveryTime}
                            onChange={handleAddFormData}
                            error={!isDeliveryValid}
                            helperText={!isDeliveryValid && "Please enter a valid time length in minutes"}

                        />
                    </div>
                </div>
                    <div className={styles.buttonGroup}>
                        <ButtonGroup variant="contained" aria-label="outlined button group">
                            {/* <Button color="success" onClick={getAllowedHospitals}>Confirm</Button> */}
                            <Button color="success" onClick={() => {setAllowedHospPopup(true)}}>Set Allowed {Constants.HOSPITAL}s</Button>
                            
                        </ButtonGroup>
                    </div>
                </form>
                <Divider variant="middle" className={styles.divider}/>
                {(function () {
                    if (allowedHospPopup) {
                        return (
                            <div>
                            <Popup trigger={allowedHospPopup} setTrigger={setAllowedHospPopup} style={{width: "10%"}} >
                                <AllowedHospitals address={location} city={city} state={stateIn} zipcode={zipcode}/>
                            </Popup>
                            </div>
                        );
                    }
                //     if (state.status === 'Mining') {
                //         return (
                //             <label>Waiting for tender to post
                //             <Box sx={{ display: 'flex' }}>
                //                 <CircularProgress />
                //             </Box>
                //             </label>
                //         )
                //     }
                //     if (transactionErrored(state)) {
                //         return (
                //             <div>
                //                 <Alert severity="error">Transaction failed: {state.errorMessage}</Alert>
                //             </div>
                //         )
                //     }
                //     if (state.status === 'Success' && events != undefined) {
                //         return (
                //             <div>
                //                 <Alert severity="success">Your transaction was successful! Please click the button to finalize the transaction.</Alert>
                //                 <Button color='success' onClick={finalizeTransaction}>Finalize and Exit</Button>
                //             </div>
                //         )
                //     }
                })()}
            </div>
    )
}
