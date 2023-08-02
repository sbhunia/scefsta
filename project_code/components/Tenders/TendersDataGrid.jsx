import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Popup from "../Popup/Popup";
import RevealBid from "../Popup/RevealBid";
import ReclaimTender from "../Popup/ReclaimTender";
import RetractTender from "../Popup/RetractTender";
import styles from "../../styles/Tender.module.css";
import TenderForm from "../Tenders/TenderForm";
import BiddingForm from "./BiddingForm";
import { providers } from "ethers";
import { getAuctionWinner } from "../../solidityCalls";

const columns = [
  { field: "id", headerName: "Tender ID", width: 100, sortable: false },
  {
    field: "patientLocation",
    headerName: "Patient Location",
    width: 250,
    sortable: true,
  },
  { field: "postDate", headerName: "Post Date", width: 175, sortable: true },
  {
    field: "auctionDate",
    headerName: "Auction End Date",
    width: 175,
    sortable: true,
  },
  {
    field: "revealDate",
    headerName: "Reveal Bid Date",
    width: 175,
    sortable: true,
  },
  {
    field: "dueDate",
    headerName: "Delivery Due Date",
    width: 175,
    sortable: true,
  },
  {
    field: "penaltyAmount",
    headerName: "Penalty Amount",
    width: 175,
    sortable: true,
  },
  {
    field: "walletId",
    headerName: "Tender Poster Wallet ID",
    width: 400,
    sortable: true,
  },
];

/**
 * Creates the table containing police tenders.
 * @param {*} data JSON object containing the police tender data.
 * @param {*} popUpChecked Boolen - if true, table is editable depending on user privileges; false otherwise
 * @param {*} openTenders Boolean - if true, tender entries are biddable.
 */
export default function TendersDataGrid({
  data,
  popUpChecked,
  openTenders,
  biddingForm,
  account,
  getWinner,
}) {
  // Allos popup to be displayed when a row is clicked
  const [rowPopup, setRowPopup] = useState(false);

  const [addPopup, setAddPopup] = useState(false);
  const [auctionEnd, setAuctionEnd] = useState();

  // Used for reveal bid popup
  const [tenderID, setTenderID] = useState(0);
  const [bidValue, setBidValue] = useState(0);
  const [penaltyAmt, setPenaltyAmt] = useState(0);

  function performPopup(index, value, penalty, auctionDate) {
    setRowPopup(true);
    setTenderID(index);
    setBidValue(value);
    setPenaltyAmt(penalty);
    setAuctionEnd(auctionDate);
  }

  function checkWinner(tenderId) {
    const provider = new providers.Web3Provider(window.ethereum);
    getAuctionWinner(tenderId, provider);
  }

  return (
    <div style={{ height: 690, width: "100%" }}>
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
          borderColor: "#ff8a80",
        }}
        onRowClick={(row) => {
          if (getWinner) {
            checkWinner(row["row"]["id"]);
          } else {
            performPopup(
              row["row"]["id"],
              row["row"]["paymentAmount"],
              row["row"]["penaltyAmount"],
              row["row"]["auctionDate"]
            );
          }
        }}
        rows={data}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: "hospitalSystem", sort: "asc" }],
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
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection={false}
        autoHeight
      />
      {(function () {
        // Displays the add button
        if (popUpChecked && !openTenders) {
          return (
            <div>
              <Button
                onClick={() => setAddPopup(true)}
                style={{ margin: "10px" }}
                variant="outlined"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </div>
          );
        }
      })()}
      {(function () {
        if (popUpChecked) {
          if (openTenders && !biddingForm) {
            return (
              <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                <RevealBid tenderID={tenderID} penaltyAmt={penaltyAmt} />
              </Popup>
            );
          } else if (biddingForm) {
            return (
              <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                <BiddingForm
                  tenderId={tenderID}
                  penalty={penaltyAmt}
                  setTrigger={setRowPopup}
                  auctionEnd={auctionEnd}
                />
              </Popup>
            );
          } else {
            return (
              <div>
                <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <ReclaimTender tenderID={tenderID} />
                    <RetractTender tenderID={tenderID} />
                  </div>
                </Popup>
                <Popup
                  trigger={addPopup}
                  setTrigger={setAddPopup}
                  className={styles.popupWin}
                >
                  <TenderForm setTrigger={setAddPopup} account={account} />
                </Popup>
              </div>
            );
          }
        }
      })()}
    </div>
  );
}
