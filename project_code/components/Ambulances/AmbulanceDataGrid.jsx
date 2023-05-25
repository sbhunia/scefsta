import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from '../Popup/Popup';
import stylesP from '../../styles/Popup.module.css'
import * as Constants from '../../pages/constants';
import { useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { ambulance_abi, contractAddress } from '../../config';
import { utils } from 'ethers';

const AbiInterface = new utils.Interface(ambulance_abi);
const ContractInstance = new Contract(contractAddress, AbiInterface);

const columns = [
  { field: 'username', headerName: 'Ambulance System', width: 175, sortable: true},
  { field: 'licensePlate', headerName: 'License Plate', width: 150,  sortable: false},
  { field: 'address', headerName: 'Address', width: 175, sortable: true},
  { field: 'city', headerName: 'City', width: 120, sortable: true},
  { field: 'state', headerName: 'State', width: 100, sortable: true},
  { field: 'id', headerName: 'Wallet ID', width: 400, sortable: false},
];

/**
 * Creates the table containing the ambulance information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} popUpChecked Boolean -if true, allows for adding/deleting ambulances; false otherwise.
 */
export default function AmbulanceDataGrid({data, popUpChecked}) {
    // smart contract API connection for add and remove ambulance users
    const { state: state1, send: send1 } = useContractFunction(ContractInstance, 'addAmbulance');
    const { state: state2, send: send2 } = useContractFunction(ContractInstance, 'removeAmbulance');

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
        username: '',
        licensePlate: '',
        address: '',
        city: '',
        state: '',
        walletId: '',
    });

    // Used for delete button popup
    const [deletePopup, setDeletePopup] = useState(false);


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

        let response = await fetch(Constants.addAmbulance, {
            method: 'POST',
            body: JSON.stringify(newContact)
        });

        newContact['id'] = newContact['walletId'];

        setDataContacts([...dataContacts, newContact,]);

        let data = await response.json();

        if (data.success) {
            setAddPopup(false);
        }
    }

    // Queries the database to delete the selected rows and removes them from the datagrid
    const deleteRows = async (event) => {
        event.preventDefault();

        //console.log(selectedRows[0]);

        let response = await fetch(Constants.deleteAmbulance, {
            method: 'DELETE',
            body: JSON.stringify(selectedRows)
        });

        let status = await response.json();

        setDataContacts(dataContacts.filter(checkSelected))

        // Removes each ambulance from the blockchain
        selectedRows.forEach( removeId => {
            send2(removeId);
        });

        if(status.success){
            
            setDeletePopup(false);
        } else {
            alert("Error deleting rows");
        }
        
    }

    // Helper function for deleteRows to update the datagrid with deletions
    // Returns the rows which are NOT being deleted
    function checkSelected(row) {
        if( !(selectedRows.includes(row.id)) ) {
            return row;
        }
    }

    // useDapp function to confirm addAmbulance transaction - payable
    const submitAmbulance = () => {
        send1(addFormData.walletId);
    }

    return (
        <div style={{ height: 400, width: '100%'}}>
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
                borderColor: '#82b1ff',
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
                            </Popup>
                            
                            <Popup trigger={addPopup} setTrigger={setAddPopup}>
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
                                        <button type="submit" className={stylesP.submitButton} onClick={submitAmbulance}>
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </Popup>
                        </div>
                    );
                } 
            })()}
        </div>
        
  );
}