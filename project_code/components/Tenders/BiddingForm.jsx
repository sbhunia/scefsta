import * as React from 'react';
import { useEffect } from 'react';
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
import { useContractFunction, transactionErrored, useEthers } from '@usedapp/core';
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { getTender } from '../../solidityCalls';
import * as Constants from '../../pages/constants';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { AUCTION_INSTANCE } from '../../pages/_app';

const web3 = new Web3();

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
export default function BiddingForm (data){
  const { account } = useEthers();

  let patientData = data.data.patients;
  const [patientId, setPatientId] = React.useState('[Patient ID]');
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
  
  let tender = getTender(patientId);  

  // handle changing selected patient in dropdown
  const dropDownChange = (event) => {
    // Finds the patient's data from the JSON object
    var patient = patientData.find(t => t.name == event.target.value);
    setPatientId(patient.patientId - 1);

    // the tender has a
    if (tender && tender != undefined) {
      let severity = tender[0]['details']['severity'];
      var dueDate = new Date(parseInt(tender[0]['details']['dueDate']['_hex'], 16) * 1000)
      var formattedDueDate = dueDate.toLocaleDateString() + " " + dueDate.toLocaleTimeString();

      // set state variables
      setPatientName(patient.name);
      setPatientGender(patient.gender);
      setPatientLocation(patient.address + ", " + patient.city + ", " + patient.state);
      setPatientInjury(patient.injuries);
      setPatientMethodInjury(patient.mechanism_of_injury);
      setPatientSeverity(severity);
      setPatientExpiration("Due: " + formattedDueDate);
      setProposedTender(0);
      setTenderID(patient.patientId);
    }
  };

  const handleDesiredBid = (event) => {
    setDesiredBid(event.target.value);
  }

  // useDapp hook to place a bid
  const { state: state1, send: send1, events } = useContractFunction(AUCTION_INSTANCE, 'secretBid');

  // submit the bid to the blockchain
  const submitBid = () => {
    // need to update the + 10 to a generated salt value (stored in DB??)
    console.log(parseInt(desiredBid));
    let hash = web3.utils.soliditySha3(parseInt(desiredBid) + 10);
    let penalty = parseInt(new BigNumber(tender[0]['details']['penalty']['_hex']).toString());
    send1(patientId, hash, {value: penalty});
  }

  const finalizeTransaction = () => {
    // Adding to a map inside the ambulances table (corresponding to that specific ambulance) where the key is 
    // the tenderID and the value is the bidID
    addBid(account, tenderID, parseInt(events[0].args.index._hex))
  }

  // re-render specifically if patientId is changed (in dropdown menu)
  useEffect(() => {}, [patientId]);

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
            <InputLabel htmlFor="filled-adornment-amount">Tender ID</InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              value={proposedTender}
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
