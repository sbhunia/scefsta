import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../../styles/Tender.module.css";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import {
  useContractFunction,
  transactionErrored,
  useEthers,
} from "@usedapp/core";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Web3 from "web3";
import { AUCTION_INSTANCE } from "../../pages/_app";
import crypto from "crypto";
import * as Constants from "../../pages/constants";

const web3 = new Web3();

/**
 * Creates bidding form for ambulances.
 * @returns
 */
export default function BiddingForm({ tenderId, penalty }) {
  const { account } = useEthers();

  const [desiredBid, setDesiredBid] = React.useState("");
  const [bidID, setBidID] = React.useState(0);
  const [salt, setSalt] = React.useState();

  const generateSalt = () => {
    let saltVal = crypto.randomBytes(6).toString("hex");
    let salt_integer = parseInt(saltVal, 16);
    return salt_integer;
  };

  const handleDesiredBid = (event) => {
    setDesiredBid(event.target.value);
  };

  const handleBidID = (event) => {
    setBidID(event.target.value);
  };

  // useDapp hook to place a bid
  const {
    state: state1,
    send: send1,
    events,
  } = useContractFunction(AUCTION_INSTANCE, "secretBid");

  // submit the bid to the blockchain
  const submitBid = async () => {
    // generate random salt value (16 digits)
    let saltVal = generateSalt();
    setSalt(saltVal);
    let bidSalt = parseInt(desiredBid) + saltVal;
    let hash = web3.utils.soliditySha3(bidSalt);
    send1(tenderId, hash, { value: penalty });
  };

  const finalizeTransaction = async () => {
    // add the salt value to a table
    const newSalt = {
      patientId: parseInt(tenderId) + 1,
      walletId: account,
      bidId: bidID,
      saltVal: salt,
      bidVal: parseInt(desiredBid),
    };

    let response = await fetch(Constants.addSalt, {
      method: "POST",
      body: JSON.stringify(newSalt),
    });
  };

  return (
    <div className={styles.editHospital}>
      <h2>Place a Bid</h2>
      <div>
        <FormControl
          fullWidth
          variant="filled"
          className={styles.givenRewardDiv}
        >
          <InputLabel htmlFor="filled-adornment-amount">
            Enter your bid value:
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={desiredBid}
            onChange={handleDesiredBid}
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
            Enter your unique bid ID:
          </InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={bidID}
            onChange={handleBidID}
          />
        </FormControl>
      </div>
      <div className={styles.buttonDiv}>
        <Button
          variant="contained"
          disableElevation
          className={styles.submitButton}
          onClick={submitBid}
        >
          Submit Bid
        </Button>
      </div>
      {(function () {
        if (state1.status === "Mining") {
          return (
            <div>
              <Alert severity="warning">Waiting for bid to be placed</Alert>
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            </div>
          );
        }
        if (transactionErrored(state1)) {
          return (
            <div>
              <Alert severity="error">
                Transaction failed: {state1.errorMessage}
              </Alert>
            </div>
          );
        }
        if (state1.status === "Success" && events != undefined) {
          return (
            <div>
              <Alert severity="success">
                Your transaction was successful! Your bid ID is: {bidID}
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
