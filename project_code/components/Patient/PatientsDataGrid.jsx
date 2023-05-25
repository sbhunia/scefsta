import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import Popup from '../Popup/Popup';
import VerifyDelivery from "../Popup/VerifyDelivery";

const columns = [
    { field: 'name', headerName: 'Patient Name', width: 175, sortable: true},
    { field: 'address', headerName: 'Address', width: 175, sortable: true},
    { field: 'city', headerName: 'City', width: 120, sortable: true},
    { field: 'state', headerName: 'State', width: 100, sortable: true},
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
    const [row, setRow] = useState(0);

    function performPopup(row, tenderIndex) {
        setRowPopup(true);
        setRow(row);
        setTenderID(tenderIndex)
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
                if (!arrival) {
                    return (
                        <div>
                            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                                <VerifyDelivery tenderID={tenderID} row={row}></VerifyDelivery>
                            </Popup>
                        </div>
                    )
                }
            })()}
        </div>
        
  );
}