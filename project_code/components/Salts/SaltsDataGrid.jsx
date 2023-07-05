import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Popup from '../Popup/Popup';
import RevealBid from "../Popup/RevealBid";
import * as Constants from "../../pages/constants";

const columns = [
  { field: 'patientId', headerName: 'Tender ID', width: 100, sortable: true},
  { field: 'bidId', headerName: 'Bid ID', width: 75, sortable: true},
  { field: 'bidValue', headerNmae: 'Proposed Bid', width: 75, sortable: true},
  { field: 'fullAddress', headerName: 'Address of Incident', width: 375, sortable: false, resizable: true},
  { field: 'injuries', headerName: 'Patient Injuries', width: 200, sortable: false},
  { field: 'mechanismOfInjury', headerName: 'Mechanism of Injury', width: 200, sortable: false}
];

export default function SaltsDataGrid({ accountId }) {
  const [rowPopup, setRowPopup] = useState(false);
  const [tenderID, setTenderID] = useState();
  const [penaltyAmt, setPenaltyAmt] = useState();
  const [salts, setSalts] = useState();
  const [loading, setLoading] = useState(true);
  const [bidId, setBidId] = useState();

  useEffect(() => {
    const getSalts = async () => {
      const res = await fetch(Constants.getSalt + '?walletId=' + accountId);
      const data = await res.json();
      for (var i = 0; i < data.length; i++) {
        data[i]['fullAddress'] = data[i]['address'] + ", " + data[i]['city'] + ", " + data[i]['state'];
      }
      console.log("data", data);

      setSalts(data);
      setLoading(false);
    };

    if (!salts) {
      getSalts();
    }
  }, []);

  const performPopup = (index, value, penalty, bidId) => {
    setRowPopup(true);
    setTenderID(index);
    setPenaltyAmt(penalty);
    setBidId(bidId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: 690, width: '100%' }}>
      <DataGrid
        sx={{
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
        onRowClick={(row) => {
          performPopup(row['row']['id'], row['row']['paymentAmount'], row['row']['penaltyAmount'], row['row']['bidId']);
        }}
        rows={salts}
        getRowId={(row) => row.saltId}
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
        checkboxSelection={false}
        autoHeight
      />
      <Popup trigger={rowPopup} setTrigger={setRowPopup}>
        <RevealBid tenderID={tenderID} penaltyAmt={penaltyAmt} bidId={bidId}/>
      </Popup>
    </div>
  );
}
