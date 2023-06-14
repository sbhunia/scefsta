import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../../styles/AmbulanceTenderForm.module.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import Map from '../mapSmall';
import { auctionsAddress, auctions_abi } from '../../config';
import { useCall, useContractFunction, transactionErrored, useEthers } from '@usedapp/core';
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { getAllTenders } from '../../solidityCalls';
import { ethers } from "ethers";
/**Depracated */
//import { keccak256 } from '@usedapp/core/node_modules/ethers/lib/utils';
import * as Constants from '../../pages/constants';
import { Contract } from '@ethersproject/contracts';
import { utils } from 'ethers';
import BigNumber from 'bignumber.js';

async function addBid(walletID, tenderID, bidID) {

  const data = { walletID: walletID, key: tenderID, value: bidID }

  let bid = await fetch(Constants.addAmbulance, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

  let bidData = await bid.json();

  if (bidData.success) {
    console.log("Successfully added bid to DB!")
  } else {
    console.log("Failed at adding bid to DB!")
  }

}

/**
 * Creates bidding form for ambulances.
 * @returns 
 */
export default function BiddingForm(data) {

  const { account } = useEthers();
  const AbiInterface = new utils.Interface(auctions_abi);
  const ContractInstance = new Contract(auctionsAddress, AbiInterface);

  let patientData = data.data.patients;
  // make smart contract calls
  const tenderData = getAllTenders();
  //console.log(tenderData);
  const { value, error } = useCall(auctionsAddress && {
    contract: ContractInstance,
    method: 'hashVal',
    args: [100, 10],
  }) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }

  const [patientName, setPatientName] = React.useState('[Patient Name]');
  const [patientGender, setPatientGender] = React.useState('[Patient sex/gender]');
  const [patientLocation, setPatientLocation] = React.useState('[Patient Location]');
  const [patientInjury, setPatientInjury] = React.useState('[Patient Injury]');
  const [patientMethodInjury, setPatientMethodInjury] = React.useState('[Patient method of injury]')
  const [patientSeverity, setPatientSeverity] = React.useState('[Patient Severity]');
  const [patientExpiration, setPatientExpiration] = React.useState('[Tender Expiration]');
  const [proposedTender, setProposedTender] = React.useState(0);
  const [desiredBid, setDesiredBid] = React.useState('');
  const [tenderID, setTenderID] = React.useState(0);

  const dropDownChange = (event) => {
    // Finds the patient's data from the JSON object
    var patient = patientData.find(t => t.name == event.target.value);

    // Find corresponding tender data from patient
    var matchTender;
    if (tenderData != undefined) {
      tenderData[0].forEach(tender => {
        let tenderId = new BigNumber(tender['tenderId']['_hex']).toString();
        // if the patient id matches the current tender id set the match
        if (patient.patientId - 1 == tenderId) {
          matchTender = tender;
          //console.log(matchTender);
        }
      });
    }

    // set data from the matched tender
    let severity = matchTender['severity'];
    var dueDate = new Date(parseInt(matchTender['dueDate']['_hex'], 16) * 1000)
    var formattedDueDate = dueDate.toLocaleDateString() + " " + dueDate.toLocaleTimeString();

    // set state variables
    setPatientName(patient.name);
    setPatientGender(patient.gender);
    setPatientLocation(patient.address);
    setPatientInjury(patient.injuries);
    setPatientMethodInjury(patient.mechanism_of_injury);
    setPatientSeverity(severity);
    setPatientExpiration("Due: " + formattedDueDate);
    setProposedTender(0);
    setTenderID(patient.patientId);
  };

  const handleDesiredBid = (event) => {
    setDesiredBid(event.target.value);
  }

  // Creating ambulanceBounties contract
  const ambulanceBounties = new Contract(auctionsAddress, auctions_abi);
  // Obtaining React Hook from bid smart contract function

  // useDapp hook to place a bid
  const { state: state1, send: send1, events } = useContractFunction(ambulanceBounties, 'secretBid');

  // let min = 10000000;
  // let max = 1000000000;
  // const randSalt = Math.floor(Math.random() * (max - min + 1)) + min;

  const submitBid = () => {
    //   console.log(parseInt(desiredBid));
    if (value != undefined) {
      console.log(tenderID - 1);
      send1(tenderID - 1, value[0], {value: 20});
    }

  }

  const finalizeTransaction = () => {
    // Adding to a map inside the ambulances table (corresponding to that specific ambulance) where the key is 
    // the tenderID and the value is the bidID
    addBid(account, tenderID, parseInt(events[0].args.index._hex))
  }

  if (events != undefined) {
    console.log(parseInt(events[0].args.index._hex))
  }

  return (
    <Grid container spacing={2} columns={16} >
      <Grid item xs={8} >
        <FormControl variant="filled" className={styles.patientDropDown}>
          <InputLabel id="demo-simple-select-filled-label">Select Patient</InputLabel>

          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={patientName}
            onChange={dropDownChange}
          >
            {
              patientData.map((patientData) => (
                <MenuItem value={patientData.name}>{patientData.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <Card className={styles.cardContainer}>
          <CardContent>
            <Typography variant="h5" component="div">
              {patientName}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {patientGender}
            </Typography>
            <Typography variant="h5" component="div">
              {patientLocation}
            </Typography>
            {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
              [ETA from current location]
            </Typography> */}
            <br />
            <Typography variant="h5" component="div">
              {patientInjury}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {patientMethodInjury}
            </Typography>

            <div className={styles.urgencyCardContent}>
              <div className={styles.urgencyCardTitle}>
                <Typography variant="h5" component="div">
                  {patientSeverity}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {patientExpiration}
                </Typography>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className={styles.tenderRewardDiv}>

          <FormControl fullWidth variant="filled" className={styles.givenRewardDiv}>
            <InputLabel htmlFor="filled-adornment-amount">Proposed Tender</InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              value={proposedTender}
              startAdornment={<InputAdornment position="start">WEI</InputAdornment>}
            />
          </FormControl>

          <FormControl fullWidth variant="filled" className={styles.tenderRewardInput}>
            <InputLabel htmlFor="filled-adornment-amount">Your Bid</InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              value={desiredBid}
              onChange={handleDesiredBid}
              startAdornment={<InputAdornment position="start">WEI</InputAdornment>}
            />
          </FormControl>
        </div>
        <Box textAlign='center'>
          <Button variant="contained" disableElevation className={styles.submitButton} onClick={submitBid}>
            Submit Bid
          </Button>
        </Box>
        {(function () {
          if (state1.status === 'Mining') {
            return (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )
          }
          if (transactionErrored(state1)) {
            return (
              <div>
                <Alert severity="error">Transaction failed: {state1.errorMessage}</Alert>
              </div>
            )
          }
          if (state1.status === 'Success' && events != undefined) {
            return (
              <div>
                <Alert severity="success">Your transaction was successful! Your bid ID is: {parseInt(events[0].args.index._hex)}</Alert>
                <Button color='success' onClick={finalizeTransaction}>Finalize and Exit</Button>
              </div>
            )
          }
        })()}
      </Grid>
      <Grid item xs={8}>
        <Map />
      </Grid>
    </Grid>
  );
}
