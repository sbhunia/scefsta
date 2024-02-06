import React, { useEffect, useState } from "react";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import Sidebar from "../components/SideBar/Sidebar";
import TendersPolice from "../components/Tenders/TendersPolice";
import styles from "../styles/Tender.module.css";
import stylesP from "../styles/Police.module.css";
import { useEthers } from "@usedapp/core";
import { Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { CircularProgress, Box, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import { Open } from "../components/Dashboard/Open";
import { Total } from "../components/Dashboard/Total";
import * as Constants from "../constants";
import { getAllTenders } from "../solidityCalls";
import withMetaMask from "../components/WithMetaMask";
import { getPageRoute } from "../solidityCalls";
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
 * The main Police Department page. Only viewable to this entity.
 * @returns
 */
function Police() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHospital, setIsHospital] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);
  const [openTenders, setOpenTenders] = useState([]);
  const [openTenderCnt, setOpenTenderCnt] = useState(0);
  const [allTenders, setAllTenders] = useState([]);
  const [totalTenderCnt, setTotalTenderCnt] = useState(0);
  const [value, setValue] = useState(0);
  const [account, setAccount] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    setIsAdmin(JSON.parse(sessionStorage.getItem("isAdmin")));
    setIsHospital(JSON.parse(sessionStorage.getItem("isHospital")));
    setIsPolice(JSON.parse(sessionStorage.getItem("isPolice")));
    setIsAmbulance(JSON.parse(sessionStorage.getItem("isAmbulance")));
    setAccount(sessionStorage.getItem("accountId"));

    const provider = new providers.Web3Provider(window.ethereum);
    let tempTenders = await getAllTenders(provider);
    setAllTenders(tempTenders);
    setTotalTenderCnt(tempTenders.length);

    // Filtering so as to only have Open tenders
    let tempOpenTendersArr = tempTenders.filter(function (open) {
      return open.strStatus === "Open";
    });

    setOpenTenders(tempOpenTendersArr);
    setOpenTenderCnt(tempOpenTendersArr.length);

    // loop through tenders
    for (let i = 0; i < tempTenders; i++) {
      // if the tender is open iterate tender acount
      let status = tempTenders[i].strStatus;
      if (status === "Open") {
        openTenders++;
      }
    }
  }, []);

  if (isPolice) {
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.tablesTotalContainer}>
            <div className={styles.pageTitle}>
              <h2>{Constants.POLICE} / Dispatcher</h2>
            </div>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="Tender Dashboard"
                    className={styles.tabText}
                    {...a11yProps(0)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Open number={openTenderCnt} />
                      </Grid>
                      <Grid item xs={6}>
                        <Total number={totalTenderCnt} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <TendersPolice
                      data={allTenders}
                      popUpChecked={true}
                      account={account}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </div>
        </div>
      </div>
    );
  } else if (isPolice === false || (isPolice == undefined && !account)) {
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={stylesP.containerLocked}>
            <LockIcon style={{ fontSize: 80, color: "#333" }}></LockIcon>
            <h2 className={stylesP.headingLocked}>
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
          <div className={stylesP.containerLocked}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }
}

export default withMetaMask(Police);
