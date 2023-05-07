import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, FormControlLabel, Switch, TextField, Button } from '@mui/material';
import styles from '../../styles/Ambulances.module.css';
import { useState } from 'react';
import * as MdIcons from "react-icons/md";
import Popup from '../Popup/Popup';
import stylesP from '../../styles/Popup.module.css'
import * as Constants from '../../pages/constants';
import Box from '@mui/material/Box';
import { addAmbulance } from '../../solidityCalls';

/**
 * Creates the table containing the ambulance information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} popUpChecked Boolean -if true, allows for adding/deleting ambulances; false otherwise.
 */
export default function AmbulanceTable( { data, popUpChecked } ) {
    // allows for the data in the table to be updated (Add/Remove)
    const [dataContacts, setDataContacts] = useState(data);

    // const below are for the add button popup
    const [buttonPopup, setButtonPopup] = useState(false);
    const [addFormData, setAddFormData] = useState({
        username: '',
        licensePlate: '',
        address: '',
        city: '',
        state: '',
        walletId: '',
    });

    // const below are for the table row select popup/view
    const [rowPopup, setRowPopup] = useState(false);

    // Will read information written inside the add button's 
    // form and store the data in 'setAddFormData'
    const handleAddFormData = (event) => {
        event.preventDefault();

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData }
        newFormData[fieldName] = fieldValue;

        setAddFormData(newFormData);

    }

    // Once the 'submit" button is used in the add button form,
    // the data will be used in a new object (newContacts) that adds an id, and 
    // that new object gets added to the table.
    const handleAddFormSubmit = async (event) => {
        event.preventDefault();
        
        const newContact = {
            username: addFormData.username,
            licensePlate: addFormData.licensePlate,
            address: addFormData.address,
            city: addFormData.city,
            state: addFormData.state,
            walletId: addFormData.walletId,
        };

        setDataContacts([...dataContacts, newContact,]);

        let response = await fetch(Constants.addAmbulance, {
            method: 'POST',
            body: JSON.stringify(newContact)
        });

        let data = await response.json();

        if (data.success) {
            setButtonPopup(false);
        }
    }

    // Manages the table's display
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    // useDapp function to confirm addAmbulance transaction - payable
    const addAmbulance = () => {
        send(addFormData.walletId);
    }

    return (
        <Box>
            <TableContainer component={Paper} className={styles.ambulanceTableContainer}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" size={dense ? 'small' : 'medium'}>
                    <TableHead>
                        <TableRow className={styles.ambulanceTableHeader}>
                            <TableCell className={styles.ambulanceTableHeaderElement}>Ambulance System</TableCell>
                            <TableCell className={styles.ambulanceTableHeaderElement} align="right">License Plate</TableCell>
                            <TableCell className={styles.ambulanceTableHeaderElement} align="right">Address</TableCell>
                            <TableCell className={styles.ambulanceTableHeaderElement} align="right">City</TableCell>
                            <TableCell className={styles.ambulanceTableHeaderElement} align="right">State</TableCell>
                            <TableCell className={styles.ambulanceTableHeaderElement} align="right">Wallet ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataContacts) => (
                            <TableRow className={styles.tableRow} key={dataContacts._id} onClick={() => setRowPopup(true)}>
                                <TableCell component="th" scope="row">
                                    {dataContacts.username}
                                </TableCell>
                                <TableCell align="right">{dataContacts.licensePlate}</TableCell>
                                <TableCell align="right">{dataContacts.address}</TableCell>
                                <TableCell align="right">{dataContacts.city}</TableCell>
                                <TableCell align="right">{dataContacts.state}</TableCell>
                                <TableCell align="right">{dataContacts.walletId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
               
                    <TablePagination
                        sx = {{
                            '.MuiTablePagination-displayedRows': {
                            'margin-top': '1em',
                            'margin-bottom': '1em'
                        },
                        '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
                            'margin-top': '1em',
                            'margin-bottom': '1em'
                        }
                        }}
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={dataContacts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className={styles.pagination}
                    />
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                {(function () {
                    if (popUpChecked) {
                        return (
                            <div>
                                <TableCell align="right" className={styles.addDiv}>
                                    <Button onClick={() => setButtonPopup(true)}>
                                        <MdIcons.MdLibraryAdd className={styles.addIcon} />
                                    </Button>
                                </TableCell>
                                <TableCell align="right" className={styles.addDiv}>
                                    <Button onClick={() => deleteAmbulance()}>
                                        <MdIcons.MdDelete className={styles.removeIcon} />
                                    </Button>
                                </TableCell>
                            </div>
                        )
                    }
                }
                )()}
                </Table>
                {(function () {
                    if (popUpChecked) {
                        return (
                            <div>
                                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                                    <div className={stylesP.editHospital}>
                                        <h1>Add an Ambulance</h1>
                                    </div>
                                    <form className={stylesP.formPadding} onSubmit={handleAddFormSubmit}>
                                        <TextField
                                            type="text"
                                            name="username"
                                            label="Ambulance Name"
                                            variant="standard"
                                            placeholder="Ambulance Name"
                                            className={stylesP.formInput}
                                            required
                                            onChange={handleAddFormData}
                                        />
                                        <br />
                                        <TextField
                                            type="text"
                                            name="licensePlate"
                                            label="License Plate"
                                            variant="standard"
                                            placeholder="License Plate"
                                            className={stylesP.formInput}
                                            required
                                            onChange={handleAddFormData}
                                        />
                                        <br />
                                        <TextField
                                            type="text"
                                            name="walletId"
                                            label="Wallet ID"
                                            variant="standard"
                                            placeholder="Wallet ID"
                                            className={stylesP.formInput}
                                            required
                                            onChange={handleAddFormData}
                                        />
                                        <br />
                                        <TextField
                                            type="text"
                                            name="address"
                                            label="Street Address"
                                            variant="standard"
                                            placeholder="Street Address"
                                            className={stylesP.formInput}
                                            required
                                            onChange={handleAddFormData}
                                        />
                                        <br />
                                        <TextField
                                            type="text"
                                            name="city"
                                            label="City"
                                            variant="standard"
                                            placeholder="City"
                                            className={stylesP.formInput}
                                            required
                                            onChange={handleAddFormData}
                                        />
                                        <br />
                                        <TextField
                                            type="text"
                                            name="state"
                                            label="state"
                                            variant="standard"
                                            placeholder="Ohio"
                                            className={stylesP.formInput}
                                            required
                                            onChange={handleAddFormData}
                                        />
                                        <br />
                                        <div className={stylesP.submitButtonDiv}>
                                            <button type="submit" className={stylesP.submitButton} onClick={addAmbulance}>
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </Popup>
                            </div>
                        );
                    } 
                })()}
            </TableContainer>
            <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                    className={styles.denseSwitch}
                />
        </Box>
        
    );
}