import styles from "../../styles/Patients.module.css";
import React from "react";
import { useContractFunction, transactionErrored } from "@usedapp/core";
import Alert from "@mui/material/Alert";
import { ButtonGroup, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import stylesP from "../../styles/Popup.module.css";
import { Typography, Button } from "@mui/material";
import { AUCTION_INSTANCE } from "../../pages/_app";
import * as Constants from "../../constants";

/**
 *
 * @param {*} tenderID ID of the tender
 * @param {*} row patient row
 * @returns
 */
export default function VerifyDelivery({ tenderID, row, setTrigger }) {
  // Obtaining React Hooks from reclaimTender smart contract function
  const { send, state, events } = useContractFunction(
    AUCTION_INSTANCE,
    "verifyDelivery"
  );

  const handleVerifyDelivery = () => {
    send(row["row"]["id"] - 1);
  };

  const finalizeTransaction = async () => {
    const updatePatient = {
      patientId: row["row"]["id"],
      status: "accepted",
    };

    let response = await fetch(Constants.getPatients, {
      headers: {
        "x-method": "update",
        "Content-Type": "application/json",
        Origin: Constants.APP_DOMAIN,
      },
      method: "POST",
      body: JSON.stringify(updatePatient),
    });
    let status = await response.json();
    if (status.success) {
      setTrigger(false);
    } else {
      alert(`Error updating patient in DB, contact the SuperAdmin`);
    }
  };

  return (
    <div className={styles.editHospital}>
      <div className={stylesP.center}>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          className={stylesP.editHospital}
        >
          Confirm Patient Arrival
        </Typography>
      </div>
      <div className={stylesP.center}>
        <p>
          {" "}
          <strong>Patient ID: </strong> {row["row"]["id"]}
        </p>
      </div>
      <div className={stylesP.submitButtonDiv}>
        <ButtonGroup variant="contained" arai-label="outlined button group">
          <Button type="submit" color="success" onClick={handleVerifyDelivery}>
            Confirm Arrival
          </Button>
        </ButtonGroup>
      </div>
      {(function () {
        if (state.status === "Mining") {
          return (
            <div>
              <Alert severity="warning">
                  Waiting for the delivery to be verified
                </Alert>
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
                Verify Delivery: {state.errorMessage}
              </Alert>
            </div>
          );
        }
        if (state.status === "Success" && events != undefined) {
          return (
            <div>
              <Alert severity="success">
                Patient successfully verified! Funds have been transferred!
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
