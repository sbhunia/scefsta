import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, FormControlLabel, Switch, Button } from '@mui/material';
import styles from '../../styles/Hospitals.module.css'
import stylesP from '../../styles/Popup.module.css'
import * as MdIcons from "react-icons/md";
import Popup from '../Popup/Popup';
import { useState } from 'react';
import * as Constants from '../../pages/constants';
import { addHospital } from '../../solidityCalls';

/**
 * Creates the table containing the list of hospitals - used in the Contract Administrator page.
 * @param {*} data JSON object containing the list of hospitals
 * @param {*} popUpChecked Boolean - if true, then entries can be added/deleted from the table; if false, they cannot be edited.
 */
export default function Datatable({ data, popUpChecked }) {
    // allows for the data in the table to be updated (Add/Remove)
    const [dataContacts, setDataContacts] = useState(data);

    // const below are for the add button popup
    const [buttonPopup, setButtonPopup] = useState(false);
    const [addFormData, setAddFormData] = useState({
        hospitalSystem: '',
        address: '',
        city: '',
        state: '',
        walletId: ''
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
            hospitalSystem: addFormData.hospitalSystem,
            address: addFormData.address,
            city: addFormData.city,
            state: addFormData.state,
            walletId: addFormData.walletId,
        };

        setDataContacts([...dataContacts, newContact,]);
        
        // Sending JSON data through API to mysql database
        let response = await fetch(Constants.addHospital, {
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

    // useDapp function to confirm addHospital transaction - payable
    const submitHospital = () => {
        addHospital(addFormData.walletId);
    }

    return (
        <TableContainer component={Paper} className={styles.hospitalTableContainer}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size={dense ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow className={styles.hospitalTableHeader}>
                        <TableCell className={styles.hospitalTableHeaderElement}>Hospital Name</TableCell>
                        <TableCell className={styles.hospitalTableHeaderElement} align="right">Address</TableCell>
                        <TableCell className={styles.hospitalTableHeaderElement} align="right">City</TableCell>
                        <TableCell className={styles.hospitalTableHeaderElement} align="right">State</TableCell>
                        <TableCell className={styles.hospitalTableHeaderElement} align="right">Wallet ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataContacts) => (
                        <TableRow className={styles.tableRow} onClick={() => setRowPopup(true)}>
                            <TableCell component="th" scope="row">
                                {dataContacts.hospitalSystem}
                            </TableCell>
                            <TableCell align="right">{dataContacts.address}</TableCell>
                            <TableCell align="right">{dataContacts.city}</TableCell>
                            <TableCell align="right">{dataContacts.state}</TableCell>
                            <TableCell align="right">{dataContacts.walletId}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                    className={styles.denseSwitch}
                />
                <TablePagination
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
                {(function () {
                    // If true, we show the Add/Delete Popup
                    if (popUpChecked) {
                        return (
                            <div className={styles.addDiv}>
                                <Button onClick={() => setButtonPopup(true)}>
                                    <MdIcons.MdLibraryAdd className={styles.addIcon} />
                                </Button>
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
                                    <h1>Add a Hospital</h1>
                                </div>
                                <form className={stylesP.formPadding} onSubmit={handleAddFormSubmit}>
                                    <TextField
                                        type="text"
                                        name="hospitalSystem"
                                        label="Hospital Name"
                                        variant="standard"
                                        placeholder="Hospital Name"
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
                                        label="State"
                                        variant="standard"
                                        placeholder="Ohio"
                                        className={stylesP.formInput}
                                        required
                                        onChange={handleAddFormData}
                                    />
                                    <br />
                                    <div className={stylesP.submitButtonDiv}>
                                        <button type="submit" className={stylesP.submitButton} onClick={submitHospital}>
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
    );
}