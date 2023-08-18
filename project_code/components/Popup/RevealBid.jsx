import styles from "../../styles/Tender.module.css";
import React from "react";
import Button from "@mui/material/Button";
import { useContractFunction, transactionErrored } from "@usedapp/core";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { AUCTION_INSTANCE } from "../../pages/_app";
import Web3 from "web3";

const web3 = new Web3();

/**
 *
 * @param {*} tenderId ID of the tender
 * @param {*} bidValue value of the ambulance's bid
 * @param {*} penaltyAmt the penalty amount of the tender
 * @returns
 */
export default function RevealBid({
  tenderId,
  penaltyAmt,
  saltVal,
  bidId,
  proposedBidVal,
  fullAddress,
  setTrigger
}) {
  const [bidValue, setBidValue] = React.useState(0);
  // Obtaining React Hooks from reclaimTender smart contract function
  const { send, state, events } = useContractFunction(
    AUCTION_INSTANCE,
    "revealBid"
  );

  const handlebidValue = (event) => {
    setBidValue(event.target.value);
  };

  // When button is clicked, the tender is reclaimed
  const handleRevealBid = async () => {
    /**
     * revealBid(tenderId, bidValue, salt, bidID)
     * tenderId - ID of the tender
     * bidValue - wei value of bid
     * salt - 10 digit salt (all are 1234567890 for simplicity)
     * bidID - ID of the bid
     * penaltyAmt - msg.value
     *
     */
    send(tenderId, bidValue, saltVal, bidId, { value: penaltyAmt });
  };

  const finalizeTransaction = async () => {
    const updatePatient = {
      patientId: tenderId + 1,
      status: "incoming"
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
      <h2>Bid Reveal</h2>
      <div>
        <FormControl
          fullWidth
          variant="filled"
          className={styles.givenRewardDiv}
        >
          <InputLabel htmlFor="filled-adornment-amount">
            Proposed Bid Amount:
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={proposedBidVal}
            startAdornment={
              <InputAdornment position="start">WEI</InputAdornment>
            }
            disabled={true}
          />
        </FormControl>
        <FormControl
          fullWidth
          variant="filled"
          className={styles.givenRewardDiv}
        >
          <InputLabel htmlFor="filled-adornment-amount">
            Penalty Fee:
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={penaltyAmt}
            disabled={true}
            startAdornment={
              <InputAdornment position="start">WEI</InputAdornment>
            }
          />
        </FormControl>
      </div>
      <div>
        <FormControl
          fullWidth
          variant="filled"
          className={styles.givenRewardDiv}
        >
          <InputLabel htmlFor="filled-adornment-amount">
            Please re-confirm your bid value:
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={bidValue}
            onChange={handlebidValue}
            startAdornment={
              <InputAdornment position="start">WEI</InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          fullWidth
          variant="filled"
          className={styles.givenRewardDiv}
        >
          <InputLabel htmlFor="filled-adornment-amount">
            Delivery Address:
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={fullAddress}
            disabled={true}
          />
        </FormControl>
      </div>
      <Alert severity="info">
        <i>Remember</i>: the{" "}
        <strong>
          penalty fee associated with this job will be put in escrow.
        </strong>{" "}
        If your bid succeeds, your penalty funds will be returned to you.
      </Alert>
      <div className={styles.buttonDiv}>
        <Button variant="contained" onClick={handleRevealBid}>
          Reveal Bid
        </Button>
      </div>
      {(function () {
        if (state.status === "Mining") {
          return (
            <div>
              <Alert severity="warning">Waiting for bid to be revealed</Alert>
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            </div>
          );
        }
        if (transactionErrored(state)) {
          return (
            <div>
              <Alert severity="error">
                Bid reveal failed: {state.errorMessage}
              </Alert>
            </div>
          );
        }
        if (state.status === "Success" && events != undefined) {
          return (
            <div>
              <Alert severity="success">
                Your bid has been revealed, wait until reveal period is over to
                see if you won
              </Alert>
              <Button color="success" onClick={finalizeTransaction}>
                Finalize and Exit
              </Button>
            </div>
          );
        }
      })()}
    </div>
  );
}
