import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from '../Popup/Popup';
import stylesP from '../../styles/Popup.module.css'
import * as Constants from '../../pages/constants';
import { useContractFunction, transactionErrored } from '@usedapp/core';
import { ACCOUNT_INSTANCE } from '../../pages/_app';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import FormAddress from '../FormComponents/FormAddress';
import { FormWalletID } from '../FormComponents/FormWalletID';

const columns = [
  { field: Constants.hospitalSystem, headerName: `${Constants.HOSPITAL} Name`, width: 200, sortable: true},
  { field: 'address', headerName: 'Address', width: 225, sortable: true},
  { field: 'city', headerName: 'City', width: 120, sortable: true},
  { field: 'state', headerName: 'State', width: 100, sortable: true},
  { field: Constants.zipcode, headerName: 'Zipcode', width: 100, sortable: true},
  { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
  { field: 'accountType', headerName: 'Account Type', width: 150, sortable: true},
];

/**
 * Creates the table containing the hospital information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} popUpChecked Boolean -if true, allows for adding/deleting hospitals; false otherwise.
 */
export default function HospitalDataGrid({data, popUpChecked}) {
    // add and remove smart contract function API connections
    const { state: state1, send: send1, events: events1 } = useContractFunction(ACCOUNT_INSTANCE, 'addHospital');
    const { state: state2, send: send2, events: events2 } = useContractFunction(ACCOUNT_INSTANCE, 'removeHospital');
    const { state: state3, send: send3, events: events3 } = useContractFunction(ACCOUNT_INSTANCE, 'removeInitiator');

    const [showMessage1, setShowMessage1] = useState(false);
    const [showMessage2, setShowMessage2] = useState(false);
    const [deleteInterfacility, setDeleteInterfacility] = useState(false);

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
    const [addFormData, setAddFormData] = useState({
        facilityName: '',
        address: '',
        city: '',
        state: '',
        walletId: '',
        zipcode: ''
    });

    // Used for delete button popup
    const [deletePopup, setDeletePopup] = useState(false);

    // Will read information written inside the add button's 
    // form and store the data in 'setAddFormData'
    const handleAddFormData = (event) => {
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
        setShowMessage1(false);

        // add to blockchain
        send1(addFormData.walletId);

        // wait a couple seconds before displaying the transaction message
        await delay(2000);
        setShowMessage1(true);
    }

    const finalizeAddHospital = async () => {
        const newContact = {
            facilityName: addFormData.facilityName,
            address: addFormData.address,
            city: addFormData.city,
            state: addFormData.state,
            walletId: addFormData.walletId,
            zipcode: addFormData.zipcode,
        };

        let response = await fetch(Constants.addHospital, {
            method: 'POST',
            body: JSON.stringify(newContact)
        });

        newContact['id'] = newContact['walletId'];

        setDataContacts([...dataContacts, newContact,]);

        let data = await response.json();
        console.log("addHosp", data);
        if (data.success) {
            setAddPopup(false);
        }

    }

    // Queries the database to delete the selected rows and removes them from the datagrid
    const deleteRows = async (event) => {
        event.preventDefault();

        //Removes each hospital from the blockchain
        selectedRows.forEach( removeId => {
            for (let row in data) {
                // if user is interfacility, remove from facility and initiator in blockchain
                if (removeId === data[row].walletId && data[row].accountType === 'interfacility') {
                    setDeleteInterfacility(true);
                    send2(removeId);
                    send3(removeId);
                } else if (removeId === data[row].walletId) {
                    send2(removeId);
                }
            }
        });       

        await delay(2000);
        setShowMessage2(true);
    }

    const finalizeDeleteHospital = async () => {
        // delete from DB after transaction finishes
        let response = await fetch(Constants.deleteHospital, {
            method: 'DELETE',
            body: JSON.stringify(selectedRows)
        });

        let status = await response.json();

        setDataContacts(dataContacts.filter(checkSelected))

        if(status.success){
            setDeletePopup(false);
        } else {
            alert("Error deleting rows");
        }

        setShowMessage2(false);
        setDeleteInterfacility(false);
    }

    // Helper function for deleteRows to update the datagrid with deletions
    // Returns the rows which are NOT being deleted
    function checkSelected(row) {
        if( !(selectedRows.includes(row.id)) ) {
            return row;
        }
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
                borderColor: '#00b8d4',
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
                      sortModel: [{ field: Constants.hospitalSystem, sort: 'asc' }],
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
                autoHeight={true}
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
                    return (
                        <div>
                            <Popup trigger={deletePopup} setTrigger={setDeletePopup} style={{width: "10%"}} >
                                <div className={stylesP.deleteEntry}>
                                    <h1>Are you sure?</h1>
                                    <body>Are you sure you want to delete the selected rows? This action cannot be undone.</body>
                                    <Button onClick={() => setDeletePopup(false)} style={{margin: '10px'}} variant="outlined" >
                                        Cancel
                                    </Button>
                                    <Button onClick={deleteRows} style={{margin: '10px'}} color="error" variant="contained">
                                        Delete
                                    </Button>
                                </div>
                                {(function () {
                                    if (showMessage2) {
                                        if (state2.status === 'Mining' && !deleteInterfacility) {
                                            return (
                                            <div>
                                                <Alert severity="warning">Waiting for {Constants.HOSPITAL}(s) to be deleted</Alert>
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress />
                                                </Box>
                                            </div>
                                            )
                                        } else if (state2.status === 'Mining' && state3.status === 'Mining') {
                                            return (
                                            <div>
                                                <Alert severity="warning">Waiting for Interfacility to be deleted</Alert>
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress />
                                                </Box>
                                            </div>
                                            )
                                        }
                                        if (transactionErrored(state2) && !deleteInterfacility) {
                                            return (
                                            <div>
                                                <Alert severity="error">Transaction failed: {state2.errorMessage}</Alert>
                                            </div>
                                            )
                                        } else if ((transactionErrored(state3) || transactionErrored(state2)) && deleteInterfacility) {
                                            if (transactionErrored(state3)) {
                                                return (
                                                <div>
                                                    <Alert severity="error">Transaction failed: {state3.errorMessage}</Alert>
                                                </div>
                                                )
                                            } else if (transactionErrored(state2)) {
                                                return (
                                                    <div>
                                                        <Alert severity="error">Transaction failed: {state2.errorMessage}</Alert>
                                                    </div>
                                                )
                                            }
                                        }
                                        if (state2.status === 'Success' && events2 != undefined && !deleteInterfacility) {
                                            return (
                                            <div>
                                                <Alert severity="success">Your transaction was successful! {Constants.HOSPITAL} was deleted from the blockchain</Alert>
                                                <Button color='success' onClick={finalizeDeleteHospital}>Finalize and Exit</Button>
                                            </div>
                                            )
                                        } else if (state2.status === 'Success' && events2 != undefined &&
                                                   state3.status === "Success" && events3 != undefined) {
                                                return (
                                                    <div>
                                                        <Alert severity="success">Your transaction was successful! Interfacility account was deleted from the blockchain</Alert>
                                                        <Button color='success' onClick={finalizeDeleteHospital}>Finalize and Exit</Button>
                                                    </div>
                                                );
                                        }
                                    }
                                })()}
                            </Popup>
                            
                            <Popup trigger={addPopup} setTrigger={setAddPopup}>
                                <div className={stylesP.editHospital}>
                                    <h1>Add New {Constants.HOSPITAL}</h1>
                                </div>
                                <Alert className={stylesP.warningText} severity="warning">NOTE: If Wallet ID is already registered as an {Constants.POLICE} the account will become interfacility</Alert>
                                <form className={stylesP.formPadding} onSubmit={handleAddFormSubmit}>
                                    <TextField
                                        type="text"
                                        name="facilityName"
                                        label={Constants.HOSPITAL + " Name"}
                                        variant="standard"
                                        placeholder={Constants.HOSPITAL + " Name"}
                                        className={stylesP.formInput}
                                        required
                                        onChange={handleAddFormData}
                                    />
                                    <FormWalletID handleAddFormData={handleAddFormData}/>
                                    <FormAddress handleAddFormData={handleAddFormData}/>
                                    <div className={stylesP.submitButtonDiv}>
                                        <button type="submit" className={stylesP.submitButton}>
                                            Submit
                                        </button>
                                    </div>
                                </form>
                                {(function () {
                                    if (showMessage1) {
                                        if (state1.status === 'Mining') {
                                                return (
                                                <div>
                                                    <Alert severity="warning">Waiting for {Constants.HOSPITAL} to be added</Alert>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress />
                                                    </Box>
                                                </div>
                                                )
                                            }
                                        if (transactionErrored(state1)) {
                                                return (
                                                <div>
                                                <Alert severity="error">Transaction failed: {state1.errorMessage}</Alert>
                                                </div>
                                                )
                                            }
                                        if (state1.status === 'Success' && events1 != undefined) {
                                            return (
                                                <div>
                                                    <Alert severity="success">Your transaction was successful! {Constants.HOSPITAL} was added to the blockchain</Alert>
                                                <Button color='success' onClick={finalizeAddHospital}>Finalize and Exit</Button>
                                                </div>
                                            )
                                        }
                                    }
                                })()}
                            </Popup>
                        </div>
                    );
                } 
            })()}
        </div>
        
  );
}

const delay = ms => new Promise(res => setTimeout(res, ms));
