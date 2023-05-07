import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, FormControlLabel, Switch, IconButton, Box, TableFooter } from '@mui/material';
import styles from '../../styles/Patients.module.css';
import { useTheme } from "@mui/material/styles";
import { Input, Typography } from '@mui/material';
import VerifyDelivery from "../Popup/VerifyDelivery";
// We cannot group the four below.
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Popup from '../Popup/Popup';
import stylesP from '../../styles/Popup.module.css'

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
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
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

export default function PatientTable({ data, arrival }) {

    const [dense, setDense] = React.useState(false);

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

    // TenderID hook
    const [tenderID, setTenderID] = useState(0);

    // const below are for the table row select popup/view
    const [rowPopup, setRowPopup] = useState(false);

    // records the row number clicked
    const [rowNum, setRowNum] = useState(0);

    function performPopup(index, tenderIndex) {
        setRowPopup(true);
        setRowNum(index);
        setTenderID(tenderIndex)
    }

    return (
        <TableContainer component={Paper} className={styles.patientTableContainer}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size={dense ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow className={styles.patientTableHeader}>
                        <TableCell className={styles.patientTableHeaderElement}>Patient Name</TableCell>
                        <TableCell className={styles.patientTableHeaderElement} align="right">Address</TableCell>
                        <TableCell className={styles.patientTableHeaderElement} align="right">City</TableCell>
                        <TableCell className={styles.patientTableHeaderElement} align="right">State</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : data
                    ).map((data, index) => (
                        <TableRow key={data._id} onClick={() => performPopup(index, data.tender_id)}>
                            <TableCell component="th" scope="row">
                                {data.name}
                            </TableCell>
                            <TableCell style={{ width: 360 }} align="right">
                                {data.address}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {data.city}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {data.state}
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
                    <TableRow >
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colspan={3}
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
                            className="hospital_table-pagination"
                        />
                    </TableRow>
                </TableFooter>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </Table>
            {(function () {
                if (!arrival) {
                    return (
                        <div>
                            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                <VerifyDelivery tenderID={tenderID} data={data} rowNum={rowNum}></VerifyDelivery>
                            </Popup>
                        </div>
                    )
                }
            })()}
        </TableContainer>
    );
}
