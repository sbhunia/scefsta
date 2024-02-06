// Start imports
import React from 'react'
import PropTypes from 'prop-types';
import { Tab, Tabs, Typography, Box, CircularProgress } from '@mui/material';
import TopNavbar from '../components/TopNavbar/TopNavbar';
import Sidebar from '../components/SideBar/Sidebar';
import Patients from '../components/Patient/Patients';
import styles from '../styles/Patients.module.css';
import { useEthers } from '@usedapp/core';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import Router from 'next/router';
import * as Constants from '../pages/constants';
import { checkHospital } from '../solidityCalls';

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
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

/**
 * The main Hospital/Healthcare Institution page. Only viewable by this entity.
 * @param {*} accepted JSON object composed of data of accepted patients.
 * @param {*} incoming JSON object composed of data of incoming patients.
 */
export default function Hospital( {accepted, incoming} ) {

    const { account } = useEthers();

    const isHospital = checkHospital(account);
    //const isHospital = true; // Temporary fix for testing

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (isHospital) {
        return (
            <div>
                <TopNavbar />
                <div className={styles.collector}>
                    <Sidebar />
                    <div className={styles.patientOverflow}>
                        <div className={styles.pageTitle}>
                            <h2>Hospitals</h2>
                        </div>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Incoming Patients" className={styles.tabText} {...a11yProps(0)} />
                                    <Tab label="Accepted Patients" className={styles.tabText} {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <Patients data={incoming} arrival={false}/>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Patients data={accepted} arrival={true}/>
                            </TabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        )
    } else if (isHospital == false || (isHospital == undefined && !account)){
        return (
            <div className={styles.entire}>
                <TopNavbar/>
                <div className={styles.collector}>
                    <Sidebar/>
                    <div className={styles.containerLocked}>
                        <LockIcon style={{ fontSize: 80, color: '#333' }}></LockIcon>
                        <h2 className={styles.headingLocked}>You do not have access to this dashboard!</h2>
                        <Button variant="contained" style={{ backgroundColor: '#1A588C'}} onClick={() => Router.push(Constants.DevHomeURL)}>
                            &larr; Return to Home Screen
                        </Button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.entire}>
                <TopNavbar/>
                <div className={styles.collector}>
                    <Sidebar/>
                    <div className={styles.containerLocked}>
                        <CircularProgress />
                    </div>
                </div>
            </div>
        )
    }
}

export async function getStaticProps(ctx) {

    const res = await fetch(Constants.getPatients)
    const data = await res.json()

    let isAccepted = data.filter(function(open){
        return open.status == "accepted";
    });
    
    let isIncoming = data.filter(function(open){
        return open.status == "incoming";
    });

    // console.log("------- Incoming Patients -------")
    // console.log(isAccepted)

    // console.log("------- Accepted Patients -------")
    // console.log(isIncoming)

    return {
        props: {
            accepted: isAccepted,
            incoming: isIncoming,
        },
    };
}