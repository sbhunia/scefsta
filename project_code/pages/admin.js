// Start imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, Typography, Box } from "@mui/material";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import Sidebar from "../components/SideBar/Sidebar";
import Admins from "../components/Admins/Admins";
import Hospitals from "../components/Hospitals/Hospitals";
import Ambulances from "../components/Ambulances/Ambulances";
import Police from "../components/Police/Police";
import styles from "../styles/Admin.module.css";
import { useEthers } from "@usedapp/core";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import * as Constants from "../pages/constants";
import withMetaMask from "../components/WithMetaMask";
import { getPageRoute } from "../solidityCalls";

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
 * The main Contract Administrator page.
 * @param {*} admins JSON array containing list of admins.
 * @param {*} hospitals JSON array containing list of hospitals.
 * @param {*} ambulances JSON array containing list of ambulances.
 * @param {*} police JSON array containing list of police stations.
 * Path: localhost:3000/admin
 */
function AdminPortal({ admins, hospitals, ambulances, police }) {
  const { account } = useEthers();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHospital, setIsHospital] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setIsAdmin(JSON.parse(sessionStorage.getItem("isAdmin")));
    setIsHospital(JSON.parse(sessionStorage.getItem("isHospital")));
    setIsPolice(JSON.parse(sessionStorage.getItem("isPolice")));
    setIsAmbulance(JSON.parse(sessionStorage.getItem("isAmbulance")));
  });

  if (isAdmin) {
    return (
      <div className={styles.collector2}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.tablesTotalContainer}>
            <div className={styles.pageTitle}>
              <h2>Contract Administrator</h2>
            </div>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label={Constants.ADMIN_PLURAL}
                    className={styles.tabText}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={Constants.HOSPITAL_PLURAL}
                    className={styles.tabText}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label={Constants.POLICE_PLURAL}
                    className={styles.tabText}
                    {...a11yProps(2)}
                  />
                  <Tab
                    label={Constants.AMBULANCE_PLURAL}
                    className={styles.tabText}
                    {...a11yProps(3)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Admins
                  className={styles.overflow}
                  data={admins}
                  popUpChecked={true}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Hospitals
                  className={styles.overflow}
                  data={hospitals}
                  popUpChecked={true}
                />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Police
                  className={styles.overflow}
                  data={police}
                  popUpChecked={true}
                />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Ambulances
                  className={styles.overflow}
                  data={ambulances}
                  popUpChecked={true}
                />
              </TabPanel>
            </Box>
          </div>
        </div>
      </div>
    );
  } else if (!isAdmin || (!isAdmin == undefined && !account)) {
    return (
      <div className={styles.collector2}>
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
              &larr; Return to User's Home
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

export default withMetaMask(AdminPortal);

export async function getStaticProps(ctx) {
  const res1 = await fetch(Constants.getHospitals);
  const data1 = await res1.json();

  const res2 = await fetch(Constants.getAmbulances);
  const data2 = await res2.json();

  const res3 = await fetch(Constants.getPolice);
  const data3 = await res3.json();

  const res4 = await fetch(Constants.getAdmins);
  const data4 = await res4.json();

  return {
    props: {
      admins: data4,
      hospitals: data1,
      ambulances: data2,
      police: data3,
    },
  };
}
