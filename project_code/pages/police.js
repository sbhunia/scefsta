import React from 'react'
import TopNavbar from '../components/TopNavbar/TopNavbar';
import Sidebar from '../components/SideBar/Sidebar';
import TendersPolice from '../components/Tenders/TendersPolice';
import styles from '../styles/Tender.module.css';
import stylesP from '../styles/Police.module.css';
import { useEthers } from '@usedapp/core'
import { Button } from '@mui/material';
import Router from 'next/router';
import LockIcon from '@mui/icons-material/Lock';
import { CircularProgress, Box, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import {Open} from '../components/Dashboard/Open'
import {Total} from '../components/Dashboard/Total'
import * as Constants from '../pages/constants';
import { checkPolice } from '../solidityCalls';
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
 * The main Police Department page. Only viewable to this entity.
 * @returns 
 */
export default function Police() {
    var valueTend = getAllTenders();
    var tenders = []
    
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
    let openTendersArr = tenders.filter(function(open){
        return open.status == 2;
    });

    let totalTenders = 0;
    let openTenders = 0;
    const { account } = useEthers();

    // if tenders has not yet been allocated
    if (tenders != undefined) {
        totalTenders = tenders.length;
        
        // loop through tenders
        for (let i = 0; i < totalTenders; i++) {
            // if the tender is open iterate tender acount
            let status = tenders[i].status;
            if (status == 2) {
                openTenders++;
            }  
        }
    }

    const isPolice = checkPolice(account);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    if (isPolice) {
        return (
            <div className={styles.entire}>
                <TopNavbar/>
                <div className={styles.collector}>
                    <Sidebar/>
                    <div className={styles.tablesTotalContainer}>
                        <div className={styles.pageTitle}>
                            <h2>{Constants.POLICE} / Dispatcher</h2>
                        </div>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Tender Dashboard" className={styles.tabText} {...a11yProps(0)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Open number={openTenders}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Total number={totalTenders} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TendersPolice data={openTendersArr} popUpChecked={true} account={account} />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        )
    } else if (isPolice == false || (isPolice == undefined && !account)) {
        return (
            <div className={styles.entire}>
                <TopNavbar/>
                <div className={styles.collector}>
                    <Sidebar/>
                    <div className={stylesP.containerLocked}>
                        <LockIcon style={{ fontSize: 80, color: '#333' }}></LockIcon>
                        <h2 className={stylesP.headingLocked}>You do not have access to this dashboard!</h2>
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
                    <div className={stylesP.containerLocked}>
                        <CircularProgress />
                    </div>
                </div>
            </div>
        )
    }
}
