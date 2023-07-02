import React from 'react'
import PropTypes from 'prop-types';
import { Tab, Tabs, Typography, Box, CircularProgress } from '@mui/material';
import TopNavbar from '../components/TopNavbar/TopNavbar';
import Sidebar from '../components/SideBar/Sidebar';
import styles from '../styles/Admin.module.css';
import Patients from '../components/ActivePatient/ActivePatientsLoad';
import Tenders from "../components/Tenders/Tenders";
import BiddingForm from "../components/Tenders/BiddingForm";
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import { useEthers } from '@usedapp/core'
import Router from 'next/router';
import * as Constants from '../pages/constants';
import { checkAmbulance } from '../solidityCalls';
import { getAllTenders } from '../solidityCalls';
const BigNumber = require('bignumber.js');


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
 * The main EMS page. Only viewable by this entity.
 * @param {*} patients JSON containing list of patients.
 * @param {*} tenders JSON containing open tenders.
 * @returns 
 */
export default function ambulance({patients}) {

    const { account } = useEthers();

    const isAmbulance = checkAmbulance(account);

    // get all the tenders
    var valueTend = getAllTenders();
    var tenders = [];
    
    // If an array of tenders is returned, create necessary json fields for the data grid
    if(valueTend != undefined) {
        tenders = valueTend[0].map((item) => 
            Object.assign({}, item, {selected:false})
        )
        tenders.forEach( tender => {
            tender['id'] = new BigNumber(tender['tenderId']['_hex']).toString();

            // tender details
            tender['walletId'] = tender[0]['tenderPoster'];
            tender['patientLocation'] = tender[0]['addr'] + ", " + tender[0]['city'] + ", " + tender[0]['state'];
            tender['penaltyAmount'] = new BigNumber(tender[0]['penalty']['_hex']).toString()
            
            // get the dates
            var postDate = new Date(parseInt(tender[0]['postDate']['_hex'], 16)*1000)
            var formattedPostDate = postDate.toLocaleDateString() + " " + postDate.toLocaleTimeString();
            tender['postDate'] = formattedPostDate;

            var auctionDate = new Date(parseInt(tender[0]['auctionDate']['_hex'], 16)*1000)
            var formattedAuctionDate = auctionDate.toLocaleDateString() + " " + auctionDate.toLocaleTimeString();
            tender['auctionDate'] = formattedAuctionDate;

            var revealDate = new Date(parseInt(tender[0]['revealDate']['_hex'], 16)*1000)
            var formattedRevealDate = revealDate.toLocaleDateString() + " " + revealDate.toLocaleTimeString();
            tender['revealDate'] = formattedRevealDate;

            var dueDate = new Date(parseInt(tender[0]['dueDate']['_hex'], 16)*1000)
            var formattedDueDate = dueDate.toLocaleDateString() + " " + dueDate.toLocaleTimeString();
            tender['dueDate'] = formattedDueDate;
        });
    }

    // Filtering so as to only have Open tenders
    let openTenders = tenders.filter(function(open){
        return open.status == 2;
    });
    
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (isAmbulance) {
        return (
            <div className={styles.entire}>
                <TopNavbar />
                <div className={styles.collector}>
                    <Sidebar />
                    <div className={styles.tablesTotalContainer}>
                        <div className={styles.pageTitle}>
                            <h2>Ambulance / EMS</h2>
                        </div>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Patient Information" className={styles.tabText} {...a11yProps(0)} />
                                    <Tab label="Available Tenders" className={styles.tabText} {...a11yProps(1)} />
                                    <Tab label="Bidding Form" className={styles.tabText} {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <Patients data={patients} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Tenders data={tenders} popUpChecked={true} openTenders={true} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <BiddingForm data={{patients, tenders}} />
                            </TabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        )
    } else if (isAmbulance == false || (isAmbulance == undefined && !account)){
        return (
            <div className={styles.entire}>
                <TopNavbar />
                <div className={styles.collector}>
                    <Sidebar />
                    <div className={styles.containerLocked}>
                        <LockIcon style={{ fontSize: 80, color: '#333' }}></LockIcon>
                        <h2 className={styles.headingLocked}>You do not have access to this dashboard!</h2>
                        <Button variant="contained" style={{ backgroundColor: '#1A588C' }} onClick={() => Router.push(Constants.DevHomeURL)}>
                            &larr; Return to Home Screen
                        </Button>
                    </div>
                </div>
            </div>
        )
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
        )
    }
}

export async function getStaticProps(ctx) {

    const res1 = await fetch(Constants.getPatients)
    const data1 = await res1.json()

    return {
        props: {
            patients: data1,
        },
    };
}
