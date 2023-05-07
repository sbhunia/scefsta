import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography} from '@mui/material';
import styles from '../../styles/Patients.module.css'
import stylesP from '../../styles/Popup.module.css'
import Popup from '../Popup/Popup';
import { useState } from 'react';
import Link from 'next/link';

export default function Datatable({ data }) {

    // allows for the data in the table to be updated (Add/Remove)
    const [dataContacts, setDataContacts] = useState(data);

    const [rowNum, setRowNum] = useState(0);

    // const below are for the add button popup
    const [buttonPopup, setButtonPopup] = useState(false);
    const [addFormData, setAddFormData] = useState({
        hospital_system: '',
        address: '',
        city: '',
        state: '',
        walletID: ''
    });

    // const below are for the table row select popup/view
    const [rowPopup, setRowPopup] = useState(false);

    function performPopup(index) {
        setRowPopup(true);
        setRowNum(index);
    }

    return (
        <TableContainer component={Paper} className={styles.activePatientTableContainer}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                <TableHead>
                    <TableRow className={styles.patientTableHeader}>
                        <TableCell className={styles.patientTableHeaderElement}>Injury/Injuries</TableCell>
                        <TableCell className={styles.patientTableHeaderElement} align="right">Method of Injury</TableCell>
                        <TableCell className={styles.patientTableHeaderElement} align="right">Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((data, index) => (
                        <TableRow className={styles.tableRow} key={data.id} onClick={() => performPopup(index)}>
                            <TableCell component="th" scope="row">
                                {data.injuries}
                            </TableCell>
                            <TableCell align="right">
                                {data.mechanismOfInjury}
                            </TableCell>
                            <TableCell align="right">
                                {data.address}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
            <div style={{display: 'flex'}}>
                    <Typography variant="h4" component="div" gutterBottom className={stylesP.editHospital}>Patient Information</Typography>
                </div>

                <div className={stylesP.centerContents}>
                    <p> <strong>Name: </strong> <text className={stylesP.floatRightElement} >{data[rowNum].name}</text> </p>
                    <p> <strong>Gender: </strong> <text className={stylesP.floatRightElement} >{data[rowNum].gender == undefined ? 'N/A' : data[rowNum].gender}</text> </p>
                    <p> <strong>Age: </strong> <text className={stylesP.floatRightElement} >{data[rowNum].age == undefined ? 'N/A' : data[rowNum].age}</text> </p>
                    <p> <strong>Injury/Injuries: </strong> <text className={stylesP.floatRightElement} >{data[rowNum].injuries}</text>
                    </p>
                    <p> <strong>Mechanism of Injury: </strong> <text className={stylesP.floatRightElement} >{data[rowNum].mechanismOfInjury}</text></p>
                    <p> <strong>Location: </strong> <text className={stylesP.floatRightElement} >{data[rowNum].address}, {data[rowNum].city}, {data[rowNum].state}</text> </p>
                </div>

            </Popup>

        </TableContainer>
    );
}
