import React, { useEffect } from 'react';
import { useState } from 'react';
import * as MdIcons from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, FormControlLabel, Switch, IconButton, Box, TableFooter, TextField } from '@mui/material';
import Popup from '../Popup/Popup';
import styles from '../../styles/Tender.module.css';
import ReclaimTender from '../Popup/ReclaimTender';
import RetractTender from "../Popup/RetractTender";
import RevealBid from "../Popup/RevealBid";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
import TenderForm from '../TenderForm/TenderForm';
import { useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { checkAmbulance, checkHospital, checkPolice, getAllTenders } from '../../solidityCalls';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page == 0}
                aria-label="first-page"
            >
                {theme.direction == 'rt1' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  /**
   * Creates the table containing police tenders.
   * @param {*} data JSON object containing the police tender data.
   * @param {*} popUpChecked Boolen - if true, table is editable depending on user privileges; false otherwise
   * @param {*} openTenders Boolean - if true, tender entries are biddable.
   */
export default function TenderTable( { data, popUpChecked, openTenders }) {
    const [buttonPopup, setButtonPopup] = useState(false);
    const [rowPopup, setRowPopup] = useState(false);
    const [dense, setDense] = React.useState(true);

    const { account } = useEthers();
    const isPolice = checkPolice(account);
    const isHospital = checkHospital(account);
    const isAmbulance = checkAmbulance(account);
    console.log(isPolice, isHospital, isAmbulance);

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [tenderID, setTenderID] = useState(0);
    const [bidValue, setBidValue] = useState(0);
    const [penaltyAmt, setPenaltyAmt] = useState(0);

    function performPopup(index, value, penalty) {
        setRowPopup(true);
        setTenderID(index);
        setBidValue(value);
        setPenaltyAmt(penalty);
    }

    // get all the tenders and see if it returns data
    // const value = getAllTenders();
    // if (value != undefined) {
    //     openTenders = true;
    //     console.log(value[0]);
    //     //data = value;
    // }

    return (
        <TableContainer component={Paper} className={styles.tenderTableContainer}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size={dense ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow className={styles.tenderTableHeader}>
                        <TableCell className={styles.tenderTableHeaderElement}>Tender ID</TableCell>
                        <TableCell className={styles.tenderTableHeaderElement}>Patient Name</TableCell>
                        <TableCell className={styles.tenderTableHeaderElement}>Patient Location</TableCell>
                        <TableCell className={styles.tenderTableHeaderElement} align="right">Payment Amount</TableCell>
                        <TableCell className={styles.tenderTableHeaderElement} align="right">Expiration Time</TableCell>
                        <TableCell className={styles.tenderTableHeaderElement} align="right">Penalty Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : data
                    ).map((data, index) => (
                        <TableRow key={data._id} className={styles.tableRow} onClick={() => performPopup(data.tender_id, data.payment_amount, data.penalty_amount)}>
                            <TableCell style={{ width: 10 }} align="left">
                                {data.tender_id}
                            </TableCell>
                            <TableCell style={{ width: 200 }} align="left">
                                {data.patient_name}
                            </TableCell>
                            <TableCell style={{ width: 390 }} align="left">
                                {data.address}
                            </TableCell>
                            <TableCell style={{ width: 200 }} align="right">
                                {formatEther(data.payment_amount)}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {data.expiration_time}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {formatEther(data.penalty_amount)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colspan={4}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            className={styles.pagination}
                        />
                    </TableRow>
                </TableFooter>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                    className={styles.denseSwitch}
                />
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                {(function () {
                  if (isPolice) { //setButtonPopup(true)
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
                    if (isAmbulance) {
                        return (
                            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                <RevealBid tenderID={tenderID} penaltyAmt={penaltyAmt}/>
                            </Popup>
                        );
                    } else if (isPolice) {
                        return (
                            <div>
                                <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <ReclaimTender tenderID={tenderID} />
                                        <RetractTender tenderID={tenderID} />
                                    </div>
                                </Popup>
                                <Popup trigger={buttonPopup} setTrigger={setButtonPopup} className={styles.popupWin}>
                                    <TenderForm />
                                </Popup>
                            </div>
                        );
                    }
                }
            })()}
        </TableContainer>
    );

}