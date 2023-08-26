import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Popup from "../Popup/Popup";
import stylesP from "../../styles/Popup.module.css";
import * as Constants from "../../constants";
import { useContractFunction, transactionErrored } from "@usedapp/core";
import { ACCOUNT_INSTANCE } from "../../pages/_app";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import FormAddress from "../FormComponents/FormAddress";
import { FormWalletID } from "../FormComponents/FormWalletID";

const columns = [
  {
    field: "firstName",
    headerName: "First Name",
    minWidth: 125,
    sortable: true,
  },
  { field: "lastName", headerName: "Last Name", width: 100, sortable: true },
  { field: "email", headerName: "Email", width: 150, sortable: true },
  { field: "address", headerName: "Address", width: 225, sortable: true },
  { field: "city", headerName: "City", width: 120, sortable: true },
  { field: "state", headerName: "State", width: 100, sortable: true },
  {
    field: `${Constants.zipcode}`,
    headerName: "Zipcode",
    width: 100,
    sortable: true,
  },
  { field: "id", headerName: "Wallet ID", width: 400, sortable: false },
];

/**
 * Creates the table containing the admin information and populates it with the data.
 * @param {*} data JSON containing the data.
 * @param {*} popUpChecked Boolean -if true, allows for adding/deleting admins; false otherwise.
 */
export default function AdminDataGrid({ data, popUpChecked }) {
  // smart contract API connection for add and remove admin users
  const {
    state: state1,
    send: send1,
    events: events1,
  } = useContractFunction(ACCOUNT_INSTANCE, "addAdmin");
  const {
    state: state2,
    send: send2,
    events: events2,
  } = useContractFunction(ACCOUNT_INSTANCE, "removeAdmin");
  const [showMessage1, setShowMessage1] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);

  // allows for the data in the table to be updated (Add/Remove)
  const [dataContacts, setDataContacts] = useState(data);

  // Tracks the selected rows, used for deleting
  const [selectedRows, setSelectedRows] = useState([]);

  // Determines whether to show the add or delete button
  const [deleteButton, setDeleteButton] = useState(false);

  // Renames the 'walletId' field to 'id'. DataGrid requires an id field
  dataContacts.map((x) => (x["id"] = x["walletId"]));

  // Used for add button popup
  const [addPopup, setAddPopup] = useState(false);
  const [addFormData, setAddFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    walletId: "",
    zipcode: "",
  });

  // Used for delete button popup
  const [deletePopup, setDeletePopup] = useState(false);
  const [completedTransactions, setCompletedTransactions] = useState(0);

  const handleTransactionComplete = () => {
    setCompletedTransactions((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (completedTransactions === selectedRows.length) {
      setShowMessage2(true);
    }
  }, [completedTransactions, selectedRows]);

  // Will read information written inside the add button's
  // form and store the data in 'setAddFormData'
  const handleAddFormData = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  // Once the 'submit" button is used in the add button form,
  // the data will be used in a new object (newContacts) that adds an id, and
  // that new object gets added to the table.
  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    setShowMessage1(false);

    // add to blockchain
    send1(addFormData.walletId).then(handleTransactionComplete);

    await delay(2000);
    setShowMessage1(true);

    // temporary delete function for blockchain
    //send2(addFormData.walletId);
  };

  const finalizeAddAdmin = async () => {
    const newContact = {
      firstName: addFormData.firstName,
      lastName: addFormData.lastName,
      email: addFormData.email,
      address: addFormData.address,
      city: addFormData.city,
      state: addFormData.state,
      walletId: addFormData.walletId,
      zipcode: addFormData.zipcode,
    };

    let response = await fetch(Constants.getAdmins, {
      method: "POST",
      body: JSON.stringify(newContact),
    });

    newContact["id"] = newContact["walletId"];

    let status = await response.json();
    if (status.success) {
      setDataContacts([...dataContacts, newContact]);
      setAddPopup(false);
    } else if (!status.success) {
      alert(`Error adding ${Constants.ADMIN} to DB, please contact SuperAdmin`);
    }
    setShowMessage1(false);
  };

  // Queries the database to delete the selected rows and removes them from the datagrid
  const deleteRows = async (event) => {
    event.preventDefault();

    // Removes each admin from the blockchain
    selectedRows.forEach((removeId) => {
      send2(removeId).then(handleTransactionComplete);
    });

    await delay(2000);
    setShowMessage2(true);
  };

  const finalizeDeleteAdmin = async () => {
    // make database changes
    console.log(JSON.stringify(selectedRows));
    let response = await fetch(Constants.getAdmins, {
      method: "DELETE",
      body: JSON.stringify(selectedRows),
    });
    let status = await response.json();

    // if the DB changes succeed close popup
    if (status.success) {
      setDataContacts(dataContacts.filter(checkSelected));
      setDeletePopup(false);
    } else if (!data.success) {
      alert(
        `Error removing ${Constants.ADMIN} from DB, please contact SuperAdmin`
      );
    }
    setShowMessage2(false);
  };

  // Helper function for deleteRows to update the datagrid with deletions
  // Returns the rows which are NOT being deleted
  function checkSelected(row) {
    if (!selectedRows.includes(row.id)) {
      return row;
    }
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        sx={{
          ".MuiTablePagination-displayedRows": {
            "margin-top": "1em",
            "margin-bottom": "1em",
          },
          ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
            {
              "margin-top": "1em",
              "margin-bottom": "1em",
            },

          boxShadow: 2,
          border: 2,
          borderColor: "#82b1ff",
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
            sortModel: [{ field: "firstName", sort: "asc" }],
          },
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableDensitySelector
        disableColumnMenu
        density="standard"
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
        if (popUpChecked) {
          if (deleteButton) {
            return (
              <div>
                <Button
                  onClick={() => {
                    setDeletePopup(true);
                    setShowMessage2(false);
                  }}
                  style={{ margin: "10px" }}
                  variant="contained"
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </div>
            );
          } else {
            return (
              <div>
                <Button
                  onClick={() => {
                    setAddPopup(true);
                    setShowMessage1(false);
                  }}
                  style={{ margin: "10px" }}
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>
            );
          }
        }
      })()}
      {(function () {
        // Displays the add popup when the add button is clicked
        if (popUpChecked) {
          return (
            <div>
              <Popup
                trigger={deletePopup}
                setTrigger={setDeletePopup}
                style={{ width: "10%" }}
              >
                <div className={stylesP.deleteEntry}>
                  <h1>Are you sure?</h1>
                  <body>
                    Are you sure you want to delete the selected rows? This
                    action cannot be undone.
                  </body>
                  <Button
                    onClick={() => setDeletePopup(false)}
                    style={{ margin: "10px" }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={deleteRows}
                    style={{ margin: "10px" }}
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </Button>
                </div>
                {(function () {
                  if (showMessage2) {
                    if (state2.status === "Mining") {
                      return (
                        <div>
                          <Alert severity="warning">
                            Waiting for {Constants.ADMIN}(s) to be deleted
                          </Alert>
                          <Box sx={{ display: "flex" }}>
                            <CircularProgress />
                          </Box>
                        </div>
                      );
                    }
                    if (transactionErrored(state2)) {
                      return (
                        <div>
                          <Alert severity="error">
                            Transaction failed: {state2.errorMessage}
                          </Alert>
                        </div>
                      );
                    }
                    if (state2.status === "Success" && events2 != undefined) {
                      return (
                        <div>
                          <Alert severity="success">
                            Your transaction was successful! {Constants.ADMIN}
                            (s) were deleted from the blockchain
                          </Alert>
                          <Button color="success" onClick={finalizeDeleteAdmin}>
                            Finalize and Exit
                          </Button>
                        </div>
                      );
                    }
                  }
                })()}
              </Popup>

              <Popup trigger={addPopup} setTrigger={setAddPopup}>
                <div className={stylesP.editHospital}>
                  <h1>Add New {Constants.ADMIN}</h1>
                </div>
                <form
                  className={stylesP.formPadding}
                  onSubmit={handleAddFormSubmit}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <TextField
                      type="text"
                      name="firstName"
                      label="First Name"
                      variant="standard"
                      placeholder="First Name"
                      className={stylesP.formInput}
                      required
                      onChange={handleAddFormData}
                    />
                    <TextField
                      type="text"
                      name="lastName"
                      label="Last Name"
                      variant="standard"
                      placeholder="Last Name"
                      className={stylesP.formInput}
                      required
                      onChange={handleAddFormData}
                    />
                  </div>
                  <TextField
                    type="text"
                    name="email"
                    label="Email"
                    variant="standard"
                    placeholder="Email"
                    className={stylesP.formInput}
                    required
                    onChange={handleAddFormData}
                  />
                  <br />
                  <FormWalletID handleAddFormData={handleAddFormData} />
                  <FormAddress handleAddFormData={handleAddFormData} />
                  <div className={stylesP.submitButtonDiv}>
                    <button type="submit" className={stylesP.submitButton}>
                      Submit
                    </button>
                  </div>
                </form>
                {(function () {
                  if (showMessage1) {
                    if (state1.status === "Mining") {
                      return (
                        <div>
                          <Alert severity="warning">
                            Waiting for admin to be added
                          </Alert>
                          <Box sx={{ display: "flex" }}>
                            <CircularProgress />
                          </Box>
                        </div>
                      );
                    }
                    if (transactionErrored(state1)) {
                      return (
                        <div>
                          <Alert severity="error">
                            Transaction failed: {state1.errorMessage}
                          </Alert>
                          <Alert severity="warning" onClick={finalizeAddAdmin}>
                            Add to DB anyways
                          </Alert>
                        </div>
                      );
                    }
                    if (state1.status === "Success" && events1 != undefined) {
                      return (
                        <div>
                          <Alert severity="success">
                            Your transaction was successful! Admin was added to
                            the blockchain
                          </Alert>
                          <Button color="success" onClick={finalizeAddAdmin}>
                            Finalize and Exit
                          </Button>
                        </div>
                      );
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

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
