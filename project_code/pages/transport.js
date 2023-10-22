import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, Typography, Box, CircularProgress } from "@mui/material";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import Sidebar from "../components/SideBar/Sidebar";
import styles from "../styles/Admin.module.css";
import Tenders from "../components/Tenders/Tenders";
import LockIcon from "@mui/icons-material/Lock";
import { Button } from "@mui/material";
import { useEthers } from "@usedapp/core";
import * as Constants from "../constants";
import { getAllTenders, getPageRoute } from "../solidityCalls";
import SaltsDataGrid from "../components/Salts/SaltsDataGrid";
import withMetaMask from "../components/WithMetaMask";
import { providers } from "ethers";

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

/**
 * The main EMS page. Only viewable by this entity.
 * @param {*} patients JSON containing list of patients.
 * @param {*} tenders JSON containing open tenders.
 * @returns
 */
function Ambulance() {
  const [account, setAccount] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHospital, setIsHospital] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [openTenders, setOpenTenders] = useState();
  const [inProgressTenders, setInProgressTenders] = useState();
  const [patients, setPatients] = useState();

  const salts = {
    walletId: "0xAd6cacC05493c496b53CCa73AB0ADf0003cB2D80",
    patientId: 2,
    bidId: 0,
    saltValue: "78757623669420",
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(Constants.getPatients, {
        headers: Constants.HEADERS,
      });
    const data = await res.json();
    setPatients(data);
    } catch(error) {
      console.error("Error fetching patients", error);
    }
  }

  useEffect(async () => {
    fetchPatients();
    setIsAdmin(JSON.parse(sessionStorage.getItem("isAdmin")));
    setIsHospital(JSON.parse(sessionStorage.getItem("isHospital")));
    setIsPolice(JSON.parse(sessionStorage.getItem("isPolice")));
    setIsAmbulance(JSON.parse(sessionStorage.getItem("isAmbulance")));
    setAccount(sessionStorage.getItem("accountId"));
    const provider = new providers.Web3Provider(window.ethereum);
    let tempTenders = await getAllTenders(provider);
    setTenders(tempTenders);

    // Filtering so as to only have Open tenders
    let tempOpenTendersArr = tempTenders.filter(function (open) {
      return open.strStatus === "Open";
    });
    setOpenTenders(tempOpenTendersArr);

    // Filtering so as to only have Open tenders
    let tempProgressTendersArr = tempTenders.filter(function (inProgress) {
      return inProgress.strStatus === "InProgress";
    });
    setInProgressTenders(tempProgressTendersArr);
  }, []);

  if (isAmbulance && openTenders) {
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.tablesTotalContainer}>
            <div className={styles.pageTitle}>
              <h2>{Constants.AMBULANCE_PLURAL} / EMS</h2>
            </div>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="Available Tenders"
                    className={styles.tabText}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Placed Bids"
                    className={styles.tabText}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label="Tenders In Progress"
                    className={styles.tabText}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Tenders
                  data={openTenders}
                  biddingForm={true}
                  openTenders={true}
                  popUpChecked={true}
                  patients={patients}
                  getWinner={false}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <SaltsDataGrid data={salts} accountId={account} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Tenders
                  data={inProgressTenders}
                  biddingForm={true}
                  openTenders={true}
                  popUpChecked={true}
                  patients={patients}
                  getWinner={true}
                />
              </TabPanel>
            </Box>
          </div>
        </div>
      </div>
    );
  } else if (isAmbulance == false || (isAmbulance == undefined && !account)) {
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.containerLocked}>
            <LockIcon style={{ fontSize: 80, color: "#333" }}></LockIcon>
            <h2 className={styles.headingLocked}>
              You do not have access to this dashboard!
            </h2>
            <Button
              variant="contained"
              style={{ backgroundColor: "#1A588C" }}
              onClick={() => {
                getPageRoute(isAdmin, isHospital, isPolice, isAmbulance);
              }}
            >
              &larr; Return to User{"'"}s Home
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.containerLocked}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }
}

export default withMetaMask(Ambulance);
