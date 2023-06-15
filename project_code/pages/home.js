// Start imports
import React from 'react';
import styles from '../styles/Home.module.css'; 
import TopNavbar from '../components/TopNavbar/TopNavbar';
import Sidebar from '../components/SideBar/Sidebar';
import Ambulances from '../components/Ambulances/Ambulances';
import Tenders from '../components/Tenders/Tenders';
import Map from './map';
import { useEthers } from '@usedapp/core'
import Router from 'next/router';
import { Button, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect } from 'react';
import * as Constants from '../pages/constants';
import { getAllTenders } from '../solidityCalls';
const BigNumber = require('bignumber.js');


export default function home( {ambulances} ) {

    // get all the tenders
    var valueTend = getAllTenders();
    var tenders = [];
    
    // If an array of tenders is returned, create necessary json fields for the data grid
    if(valueTend != undefined) {
        tenders = valueTend[0].map((item) => 
            Object.assign({}, item, {selected:false})
        )
        tenders.forEach( tender => {
            var dueDate = new Date(parseInt(tender['dueDate']['_hex'], 16)*1000)
            var formattedDueDate = dueDate.toLocaleDateString() + " " + dueDate.toLocaleTimeString();

            tender['id'] = new BigNumber(tender['tenderId']['_hex']).toString();
            tender['patientName'] = tender['name'];
            tender['patientLocation'] = tender[5];
            tender['penaltyAmount'] = new BigNumber(tender['penalty']['_hex']).toString()
            tender['dueDate'] = formattedDueDate;
            tender['walletId'] = tender[0];
        });
    }
    console.log(tenders);

    // Filtering so as to only have Open tenders
    let openTenders = tenders.filter(function(open){
        return open.status == 2;
    });

    const { account } = useEthers();
    
    const [counter, setCounter] = React.useState(10);

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    if (account) {
        return (
            <div className={styles.collector2}>
                <TopNavbar />
                <div className={styles.collector}>
                    <Sidebar />
                    <div className={styles.giveFlex}>
                        <div className={styles.addPadding}>
                            <Map />
                            <div className={styles.extraPadding}>
                                <h2 className={styles.headingText}>Tenders</h2>
                                <Tenders data={openTenders} popUpChecked={false} openTenders={false}/>
                                <h2 className={styles.headingText} style={{marginTop: '35px'}}>Ambulances</h2>
                                <Ambulances data={ambulances} popUpChecked={false} />
                            </div>
                        </div>
                        <div className={styles.overlay}></div>
                    </div>
                </div>
            </div>
        )
    } else if (account == undefined && counter != 0){
        return (
            <div className={styles.collector2}>
                <TopNavbar />
                <div className={styles.collector}>
                    <Sidebar />
                    <div className={styles.containerLocked}>
                        <CircularProgress />
                    </div>
                </div>
            </div>
        )
    } else if (account == undefined && counter == 0){
        return (
            <div className={styles.collector2}>
                <TopNavbar />
                <div className={styles.collector}>
                    <Sidebar />
                    <div className={styles.containerLocked}>
                        <LockIcon style={{ fontSize: 80, color: '#333' }}></LockIcon>
                        <h2 className={styles.headingLocked}>You do not have access to this dashboard!</h2>
                        <Button variant="contained" style={{ backgroundColor: '#1A588C' }} onClick={() => Router.push('/')}>
                            &larr; Return to Front Page
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export async function getStaticProps(ctx) {
    const res1 = await fetch(Constants.getAmbulances)
    const data1 = await res1.json()

    return {
        props: {
            ambulances: data1,
        },
    };
}