import React from "react";
import { useContractFunction, transactionErrored } from "@usedapp/core";
import { useState, useEffect } from "react";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import styles from "../../styles/TenderForm.module.css";
import {
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Divider,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { AUCTION_INSTANCE } from "../../pages/_app";
import * as Constants from "../../pages/constants";
import FormAddress from "../FormComponents/FormAddress";
import stylesP from "../../styles/Popup.module.css";
import { AllowedHospitals } from "./AllowedHospitals";
import Popup from "../Popup/Popup";
import { FormInjury } from "../FormComponents/FormInjury";
import { FormPrivate } from "../FormComponents/FormPrivate";
import { DateTimePicker } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import dayjs from "dayjs";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TenderForm(props) {
  const [injuryType, setInjuryType] = React.useState([]);
  const [severity, setSeverity] = React.useState("");
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
  const [allowedHospitals, setAllowedHospitals] = useState([]);
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [selectedData, setSelectedData] = useState({});

  const [dateTime, setDateTime] = useState(dayjs("2022-04-17T15:30"));
  const [dateTimeIsValid, setDateTimeIsValid] = useState(false);

  const [type, setType] = useState(null);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      setDateTimeIsValid(false);
    } else if (newValue === 1) {
      setDeliveryTime();
    }
    setValue(newValue);
  };

  // Obtaining React Hooks from postTender smart contract function
  const {
    state,
    send: send1,
    events,
  } = useContractFunction(AUCTION_INSTANCE, "postTender");

  const fetchType = async () => {
    try {
      const URL = `${Constants.getPolice}?walletId='${props.account}'`;
      const response = await fetch(URL);
      const json = await response.json();
      setType(json[0].initiatorType);
      if (json[0].initiatorType === "facility") {
        setValue(1);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleChangeInjury = (event) => {
    const {
      target: { value },
    } = event;
    setInjuryType(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleChangeSeverity = (event) => {
    setSeverity(event.target.value);
  };
  const handleSetMechOfInjury = (event) => {
    setMechanismOfInjury(event.target.value);
  };

  const verifyNumber = (number) => {
    const regex = /^[0-9\b]+$/;
    return regex.test(number);
  };

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
  };

  const handleSetAllowedHospitals = (event) => {
    event.preventDefault();
    setAllowedHospPopup(true);
  };

  const handleDateTime = (newDateTime) => {
    setDateTime(newDateTime);
    const currentDateTime = dayjs();
    const minuteDifference = newDateTime.diff(currentDateTime, "minute");
    setDeliveryTime(minuteDifference);
    setDateTimeIsValid(true);
  };

  // auctionLength - how long in minutes the ambulnaces have to bid in the auction
  // location - the location of the incident
  // allowed hospitals - hospitals that are near enough to service patient(s)
  // penalty - cost for ambulance if job is not completed
  const confirm = async (event) => {
    event.preventDefault();
    //create tender for blockchain
    if (!dateTimeIsValid && !deliveryTime) {
      alert(
        "Please select the date and time of delivery, or specify a delivery time in minutes"
      );
      return;
    }

    if (dateTimeIsValid && allowedHospitals.length !== 1) {
      alert("You can only have one selected facility");
      return;
    }

    let auctionSec = auctionLength * 60;
    let deliverySec = deliveryTime * 60;

    // if the selection is date time perform check, if not run smart contract call
    if (dateTimeIsValid) {
      let inputDeliveryTime = deliverySec - auctionSec - 300;

      if (inputDeliveryTime <= 600) {
        alert("Delivery time is not far enough from the end auction date");
        return;
      }

      send1(
        auctionSec,
        inputDeliveryTime,
        location,
        city,
        stateIn,
        zipcode,
        penaltyAmt,
        severity,
        allowedHospitals,
        { value: tenderAmt }
      );
    } else {
      send1(
        auctionSec,
        deliverySec,
        location,
        city,
        stateIn,
        zipcode,
        penaltyAmt,
        severity,
        allowedHospitals,
        { value: tenderAmt }
      );
    }
  };

  const finalizeTransaction = async () => {
    let newPatient = {}

    if (!severity || severity === "") {
      newPatient = {
        injury: "N/A",
        mechanism_of_injury: "N/A",
        address: location,
        city: city,
        state: stateIn,
        status: "pending",
        isAccepted: false,
        zipcode: zipcode,
        severity: "Appt",
      };      
      
      setSeverity("Appt");
    } else  {
      newPatient = {
        injury: injuryType,
        mechanism_of_injury: mechanismofInjury,
        address: location,
        city: city,
        state: stateIn,
        status: "pending",
        isAccepted: false,
        zipcode: zipcode,
        severity: severity,
      };
    }

    let response = await fetch("api/patients", {
      headers: {'x-method': 'insert'},
      method: "POST",
      body: JSON.stringify(newPatient),
    });

    let status = await response.json();
    if (status.success) {
      props.setTrigger(false);
    } else {
      alert(`Error adding patient to DB, contact the SuperAdmin`);
    }
  };

  useEffect(() => {
    fetchType();
    const currentDate = new Date();
    const options = { timeZone: "America/New_York", hour12: false };
    const formattedDate = currentDate
      .toLocaleString("en-US", options)
      .replace(",", "");
    setDateTime(dayjs(formattedDate));
  }, []);

  useEffect(() => {
    if (allowedHospitals.length > 0) {
      setConfirmDisabled(false);
    } else {
      setConfirmDisabled(true);
    }
  }, [allowedHospitals]);

  return (
    <div className={styles.containerForm}>
      <div style={{ display: "flex" }}>
        <LocalPoliceIcon style={{ fontSize: "2.6rem" }} />
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          className={styles.heading}
        >
          {Constants.POLICE} Tender Form
        </Typography>
      </div>
      <form className={styles.tenderForm} onSubmit={handleSetAllowedHospitals}>
        <h2 className={styles.headingText}>Location</h2>
        <FormAddress handleAddFormData={handleAddFormData} />
        <ButtonGroup variant="contained" aria-label="outlined button group">
          <Button style={{ marginTop: ".25rem" }} color="success" type="submit">
            Set Allowed {Constants.HOSPITAL}
          </Button>
        </ButtonGroup>
      </form>
      <br />
      <form className={styles.tenderForm} onSubmit={confirm}>
        {(function () {
          if (type === "emergency") {
            return (
              <FormInjury
                injuryType={injuryType}
                handleChangeInjury={handleChangeInjury}
                severity={severity}
                handleChangeSeverity={handleChangeSeverity}
                mechanismofInjury={mechanismofInjury}
                handleSetMechOfInjury={handleSetMechOfInjury}
              />
            );
          } else if (type === "private" || type === "facility") {
            return (
              <FormPrivate
                injuryType={injuryType}
                handleChangeInjury={handleChangeInjury}
                severity={severity}
                handleChangeSeverity={handleChangeSeverity}
                mechanismofInjury={mechanismofInjury}
                handleSetMechOfInjury={handleSetMechOfInjury}
                allowedHospitals={allowedHospitals}
                selectedData={selectedData}
                handleChange={handleChange}
                value={value}
              />
            );
          }
        })()}
        <br />
        <h2 className={styles.headingText}>Auction Information</h2>
        <div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className={styles.dropdownDiv}>
              <TextField
                type="text"
                name="payment"
                label="Payment Amount (WEI)"
                variant="standard"
                className={stylesP.formInput}
                required
                value={tenderAmt}
                onChange={handleAddFormData}
                error={!isPaymentValid}
                helperText={
                  !isPaymentValid && "Please enter a valid amount in WEI"
                }
              />
            </div>
            <div className={styles.dropdownDiv}>
              <TextField
                type="text"
                name="penalty"
                label="Penalty Amount (WEI)"
                variant="standard"
                placeholder="5"
                className={stylesP.formInput}
                required
                value={penaltyAmt}
                onChange={handleAddFormData}
                error={!isPenaltyValid}
                helperText={
                  !isPenaltyValid && "Please enter a valid amount in WEI"
                }
              />
            </div>
          </div>
        </div>
        <div>
          {(function () {
            if (type === "emergency") {
              return (
                <jsx>
                  <div className={styles.timeDiv}>
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
                      helperText={
                        !isAuctionValid &&
                        "Please enter a valid time length in minutes"
                      }
                    />
                    <TextField
                      type="text"
                      name="delivery"
                      label="Delivery Time (min)"
                      variant="standard"
                      placeholder="30"
                      className={stylesP.formInput}
                      required={value === 0}
                      value={deliveryTime}
                      onChange={handleAddFormData}
                      error={!isDeliveryValid}
                      helperText={
                        !isDeliveryValid &&
                        "Please enter a valid time length in minutes"
                      }
                    />
                  </div>
                </jsx>
              );
            } else if (type === "private" || type === "facility") {
              return (
                <jsx>
                  <div className={styles.timeDiv}>
                    <TabPanel>
                      <TextField
                        type="text"
                        name="auction"
                        label="Auction Length (min)"
                        variant="standard"
                        placeholder="5"
                        className={styles.auctionFacility}
                        required
                        value={auctionLength}
                        onChange={handleAddFormData}
                        error={!isAuctionValid}
                        helperText={
                          !isAuctionValid &&
                          "Please enter a valid time length in minutes"
                        }
                      />
                    </TabPanel>
                    <TabPanel value={value} index={0}>
                      <TextField
                        type="text"
                        name="delivery"
                        label="Delivery Time (min)"
                        variant="standard"
                        placeholder="30"
                        className={styles.dateTimeFacility}
                        required={value === 0}
                        value={deliveryTime}
                        onChange={handleAddFormData}
                        error={!isDeliveryValid}
                        helperText={
                          !isDeliveryValid &&
                          "Please enter a valid time length in minutes"
                        }
                      />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <DateTimePicker
                        className={styles.dateTimeFacility}
                        value={dateTime}
                        onChange={(newValue) => handleDateTime(newValue)}
                      />
                    </TabPanel>
                  </div>
                </jsx>
              );
            }
          })()}
        </div>
        <div className={styles.buttonGroup}>
          <ButtonGroup variant="contained" aria-label="outlined button group">
            <Button disabled={confirmDisabled} color="success" type="submit">
              Post Tender
            </Button>
            {/* <Button color="success" onClick={confirm}>
              Post Tender Temp
            </Button> */}
          </ButtonGroup>
        </div>
      </form>
      <Divider variant="middle" className={styles.divider} />
      {(function () {
        if (allowedHospPopup) {
          return (
            <div>
              <Popup
                trigger={allowedHospPopup}
                setTrigger={setAllowedHospPopup}
                style={{ width: "45%" }}
              >
                <AllowedHospitals
                  address={location}
                  city={city}
                  state={stateIn}
                  zipcode={zipcode}
                  setAllowedHospitals={setAllowedHospitals}
                  trigger={allowedHospPopup}
                  setTrigger={setAllowedHospPopup}
                  setSelectedData={setSelectedData}
                />
              </Popup>
            </div>
          );
        }
        if (state.status === "Mining") {
          return (
            <div>
              <Alert severity="warning">Waiting for tender to be posted</Alert>
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
                Transaction failed: {state.errorMessage}
              </Alert>
            </div>
          );
        }
        if (state.status === "Success" && events != undefined) {
          return (
            <div>
              <Alert severity="success">
                Your transaction was successful! Please click the button to
                finalize the transaction.
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
