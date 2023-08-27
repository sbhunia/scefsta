import styles from "../../styles/Patients.module.css";
import React from "react";
import { useContractFunction, transactionErrored } from "@usedapp/core";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import stylesP from "../../styles/Popup.module.css";
import { Typography } from "@mui/material";
import { AUCTION_INSTANCE } from "../../pages/_app";
import { Button } from "reactstrap";
import * as Constants from "../../constants";

/**
 *
 * @param {*} tenderID ID of the tender
 * @param {*} row patient row
 * @returns
 */
export default function VerifyDelivery({ tenderID, row }) {
  // Obtaining React Hooks from reclaimTender smart contract function
  const { send, state } = useContractFunction(
    AUCTION_INSTANCE,
    "verifyDelivery"
  );

  const handleVerifyDelivery = () => {
    send(row["row"]["id"] - 1);
  };

  const finalizeTransaction = async () => {
    const updatePatient = {
      patientId: row["row"][id],
      status: "accepted",
    };

    let response = await fetch(Constants.getPatients, {
      headers: { "x-method": "update" },
      method: "POST",
      body: JSON.stringify(updatePatient),
      headers: Constants.HEADERS,
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
        <Button type="submit" color="success" onClick={handleVerifyDelivery}>
          Confirm Arrival
        </Button>
      </div>
      {(function () {
        if (state.status === "Mining") {
          return (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
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
        if (state.status === "Success") {
          return (
            <div>
              <Alert severity="success">
                Patient successfully verified! Funds have been transferred!
              </Alert>
              <Button color="successs" onClick={finalizeTransaction}>
                Finalize and Exit
              </Button>
            </div>
          );
        }
      })()}
    </div>
  );
}
