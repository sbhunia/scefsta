import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import Popup from '../Popup/Popup';
import stylesP from '../../styles/Popup.module.css'

const columns = [
    { field: 'injuries', headerName: 'Injuries', width: 250, sortable: true},
    { field: 'mechanismOfInjury', headerName: 'Method Of Injury', width: 250, sortable: true},
    { field: 'address', headerName: 'Address', width: 225, sortable: true},
    { field: 'city', headerName: 'City', width: 175, sortable: true},
    { field: 'state', headerName: 'State', width: 150, sortable: true},
  ];

/**
 * Creates the table containing the patients information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} arrival Boolean -if false, a patient has not arrived and the option to confirm their arrival is given
 */
export default function PatientsDataGrid({data, arrival}) {

    // allows for the data in the table to be updated (Add/Remove)
    const [dataContacts, setDataContacts] = useState(data);
    
    // Renames the 'patientId' field to 'id'. DataGrid requires an id field
    dataContacts.map(x => x['id'] = x['patientId'])

    // TenderID hook
    const [tenderID, setTenderID] = useState(0);

    // const below are for the table row select popup/view
    const [rowPopup, setRowPopup] = useState(false);

    // records the row clicked
    const [row, setRow] = useState({
        row:{

        }
    });

    function performPopup(row) {
        setRowPopup(true);
        setRow(row);
    }

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
                    performPopup(row, "TEMP TENDER ID");
                    console.log(row);
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
            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
            <div style={{display: 'flex'}}>
                    <Typography variant="h4" component="div" gutterBottom className={stylesP.editHospital}>Patient Information</Typography>
                </div>

                <div className={stylesP.centerContents}>
                    <p> <strong>Name: </strong> <text className={stylesP.floatRightElement} >{row['row']['name']}</text> </p>
                    <p> <strong>Gender: </strong> <text className={stylesP.floatRightElement} >{row['row']['gender'] == undefined ? 'N/A' : row['row']['gender']}</text> </p>
                    <p> <strong>Age: </strong> <text className={stylesP.floatRightElement} >{row['row']['age'] == undefined ? 'N/A' : row['row']['age']}</text> </p>
                    <p> <strong>Injury/Injuries: </strong> <text className={stylesP.floatRightElement} >{row['row']['injuries']}</text>
                    </p>
                    <p> <strong>Mechanism of Injury: </strong> <text className={stylesP.floatRightElement} >{row['row']['mechanismOfInjury']}</text></p>
                    <p> <strong>Location: </strong> <text className={stylesP.floatRightElement} >{row['row']['address']}, {row['row']['city']}, {row['row']['state']}</text> </p>
                </div>

            </Popup>
        </div>
        
  );
}