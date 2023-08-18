import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Popup from '../Popup/Popup';
import VerifyDelivery from "../Popup/VerifyDelivery";
import { getAllTenders } from "../../solidityCalls";
import { providers } from "ethers";
const BigNumber = require("bignumber.js");

const columns = [
    { field: 'patientId', headerName: 'Patient ID #', width: 175, sortable: true},
    { field: 'injuries', headerName: 'Injuries', width: 200, sortable: true},
    { field: 'mechanismOfInjury', headerName: 'Mechanism', width: 200, sortable: true},
    { field: 'severity', headerName: 'Severity', width: 100, sortable: true},
    { field: "dueDate", headerName: 'Delivery Due', width: 175, sortable: true}
  ];

/**
 * Creates the table containing the patients information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} arrival Boolean -if false, a patient has not arrived and the option to confirm their arrival is given
 */
export default function PatientsDataGrid({data, arrival}) {
    // allows for the data in the table to be updated (Add/Remove)
    const [dataContacts, setDataContacts] = useState(data);
    const [rowPopup, setRowPopup] = useState(false);
    const [row, setRow] = useState(0);
    console.log(data);
    dataContacts.map(x => x['id'] = x['patientId'])
 
    function performPopup(row) {
        setRowPopup(true);
        setRow(row);
    }

    useEffect(async () => {
        // Renames the 'patientId' field to 'id'. DataGrid requires an id field
        let tempData = dataContacts;

        const provider = new providers.Web3Provider(window.ethereum);
        let tempTenders = await getAllTenders(provider);

        // get data from tenders
        const mergedPatients = tempData.map((patient) => {
            if (!patient.injuries || patient.injuries === "N/A") {
                patient.injuries = "N/A";
                patient.mechanismOfInjury = "N/A";
            }
            for (let tender in tempTenders) {
                let tendId = new BigNumber(
                    tempTenders[tender]["tenderId"]["_hex"]);
                    
                // if the tenderID matches corresponding patientID get the due date
                if (tendId.c[0] + 1 === patient.patientId) {
                    console.log(tempTenders[tender]);
                    patient.dueDate = tempTenders[tender].dueDate;
                }
            }

            console.log(patient);
            return patient;
        });

        setDataContacts(mergedPatients)
    }, [])

    return (
        <div style={{ height: 400, width: '100%' }}>
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
                borderColor: '#ffc400',
                }}
                onRowClick={(row) =>{
                    performPopup(row);
                }}
                rows={dataContacts}
                columns={columns}
                initialState={{
                    sorting: {
                      sortModel: [{ field: 'username', sort: 'asc' }],
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
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection={false}
                autoHeight
            />
            {(function () {
                if (arrival) {
                    return (
                        <div>
                            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                <VerifyDelivery row={row}></VerifyDelivery>
                            </Popup>
                        </div>
                    )
                }
            })()}
        </div>
        
  );
}