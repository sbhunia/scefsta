import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteForm } from './DeleteForm';
import { EmergencyForm } from './EmergencyForm';
import { InterfacililtyForm } from './InterfacilityForm';
import { PrivateForm } from './PrivateForm';

/**
 * Creates the table containing the police information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} popUpChecked Boolean -if true, allows for adding/deleting police; false otherwise.
 */
export default function InitiatorDataGrids({data, popUpChecked, columns, type}) {
    // allows for the data in the table to be updated (Add/Remove)
    const [dataContacts, setDataContacts] = useState(data);
    
    // Tracks the selected rows, used for deleting
    const [selectedRows, setSelectedRows] = useState([]);

    // Determines whether to show the add or delete button
    const [deleteButton, setDeleteButton] = useState(false);
    
    // Renames the 'walletId' field to 'id'. DataGrid requires an id field
    dataContacts.map(x => x['id'] = x['walletId'])

    // Used for add button popup
    const [addPopup, setAddPopup] = useState(false);

    // Used for delete button popup
    const [deletePopup, setDeletePopup] = useState(false);

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
                borderColor: '#b388ff',
                }}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedRows(newRowSelectionModel);
                    if (newRowSelectionModel.length > 0) {
                        setDeleteButton(true);
                    } else {
                        setDeleteButton(false);
                    }
                }}
                rows={dataContacts}
                columns={columns}
                initialState={{
                    sorting: {
                      sortModel: [{ field: 'policeDept', sort: 'asc' }],
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
                checkboxSelection={popUpChecked}
                autoHeight
            />
            {(function () {
                // Displays the delete button if one or more entries are selected, otherwise displays the add button
                if (popUpChecked){
                    if (deleteButton) {
                        return (
                            <div>
                                <Button onClick={() => setDeletePopup(true)} style={{margin: '10px'}} variant="contained" endIcon={<DeleteIcon />} >
                                    Delete
                                </Button>
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <Button onClick={() => setAddPopup(true)} style={{margin: '10px'}} variant="outlined" startIcon={<AddIcon />} >
                                    Add
                                </Button>
                            </div>
                        ) 
                    }
                }
            }())}
            {(function () {
                // Displays the add popup when the add button is clicked
                if (popUpChecked) {
                    if (type === "emergency") {
                        return (
                            <div>
                                <DeleteForm deletePopup={deletePopup} setDeletePopup={setDeletePopup}
                                    selectedRows={selectedRows} dataContacts={dataContacts} setDataContacts={setDataContacts}/>
                                <EmergencyForm addPopup={addPopup} setAddPopup={setAddPopup} setDataContacts={setDataContacts} dataContacts={dataContacts}/>
                            </div>
                        );
                    } else if (type === "private") {
                        return (
                            <div>
                                <DeleteForm deletePopup={deletePopup} setDeletePopup={setDeletePopup}
                                    selectedRows={selectedRows} dataContacts={dataContacts} setDataContacts={setDataContacts}/>
                                <PrivateForm addPopup={addPopup} setAddPopup={setAddPopup} setDataContacts={setDataContacts} dataContacts={dataContacts}/>
                            </div>
                        );
                    } else if (type === "interfacility") {
                        return (
                            <div>
                                <DeleteForm deletePopup={deletePopup} setDeletePopup={setDeletePopup}
                                    selectedRows={selectedRows} dataContacts={dataContacts} setDataContacts={setDataContacts}/>
                                <InterfacililtyForm addPopup={addPopup} setAddPopup={setAddPopup} setDataContacts={setDataContacts} dataContacts={dataContacts}/>
                            </div>
                        );
                    }
                } 
            })()}
        </div>    
  );
}
