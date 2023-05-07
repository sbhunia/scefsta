import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect, useMemo } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Popup from '../Popup/Popup';
const BigNumber = require('bignumber.js');
import RevealBid from "../Popup/RevealBid";
import ReclaimTender from '../Popup/ReclaimTender';
import RetractTender from "../Popup/RetractTender";
import styles from '../../styles/Tender.module.css';
import TenderForm from '../TenderForm/TenderForm';

const columns = [
    { field: 'id', headerName: 'Tender ID', width: 100, sortable: false},
    { field: 'patientName', headerName: 'Patient Name', width: 150, sortable: true},
    { field: 'patientLocation', headerName: 'Patient Location', width: 250, sortable: true},
    // { field: 'paymentAmount', headerName: 'Payment Amount', width: 175, sortable: true},
    { field: 'dueDate', headerName: 'Due Date', width: 200, sortable: true},
    { field: 'penaltyAmount', headerName: 'Penalty Amount', width: 175, sortable: true},
    //{ field: 'walletId', headerName: 'Wallet ID', width: 400, sortable: true},
];

  /**
   * Creates the table containing police tenders.
   * @param {*} data JSON object containing the police tender data.
   * @param {*} popUpChecked Boolen - if true, table is editable depending on user privileges; false otherwise
   * @param {*} openTenders Boolean - if true, tender entries are biddable.
   */
export default function TendersDataGrid({data, popUpChecked, openTenders}) {
    console.log(data);
    // Allos popup to be displayed when a row is clicked
    const [rowPopup, setRowPopup] = useState(false);
    
    const [addPopup, setAddPopup] = useState(false);
    

    // Used for reveal bid popup
    const [tenderID, setTenderID] = useState(0);
    const [bidValue, setBidValue] = useState(0);
    const [penaltyAmt, setPenaltyAmt] = useState(0);

    function performPopup(index, value, penalty) {
        setRowPopup(true);
        setTenderID(index);
        setBidValue(value);
        setPenaltyAmt(penalty)
    }

    return (
        <div style={{ height: 690, width: '100%' }}>
            <DataGrid
                sx = {{
                    '.MuiTablePagination-displayedRows': {
                    'margin-top': '1em',
                    'margin-bottom': '1em'
                },
                '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
                    'margin-top': '1em',
                    'margin-bottom': '1em'
                },
                boxShadow: 2,
                border: 2,
                borderColor: '#ff8a80',
                }}
                onRowClick={(row) =>{
                    performPopup(row['row']['id'], row['row']['paymentAmount'], row['row']['penaltyAmount']);
                }}
                rows={data}
                columns={columns}
                initialState={{
                    sorting: {
                      sortModel: [{ field: 'hospitalSystem', sort: 'asc' }],
                    },
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                disableDensitySelector
                disableColumnMenu
                density='standard'
                slots={{ toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                        csvOptions: { disableToolbarButton: true },
                        printOptions: { disableToolbarButton: true },
                    },
                  }}
                pageSize={10}
                // pageSizeOptions={[5, 10, 25]}
                checkboxSelection={false}
                //autoHeight={true}
            />
            {(function () {
                // Displays the add button
                if (popUpChecked && !openTenders){
                    return (
                        <div>
                            <Button onClick={() => setAddPopup(true)} style={{margin: '10px'}} variant="outlined" startIcon={<AddIcon />} >
                                Add
                            </Button>
                        </div>
                    ) 
                }
            }())}
            {(function () {
                if (popUpChecked) {
                    if (openTenders) {
                        return (
                            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                <RevealBid tenderID={tenderID} penaltyAmt={penaltyAmt}/>
                            </Popup>
                        );
                    } else {
                        return (
                            <div>
                                <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <ReclaimTender tenderID={tenderID} />
                                        <RetractTender tenderID={tenderID} />
                                    </div>
                                </Popup>
                                <Popup trigger={addPopup} setTrigger={setAddPopup} className={styles.popupWin}>
                                    <TenderForm />
                                </Popup>
                            </div>
                        );
                    }
                }
            })()}
        </div>
        
  );
}