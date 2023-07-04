import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';
import Popup from '../Popup/Popup';
import RevealBid from "../Popup/RevealBid";


const columns = [
    { field: 'patientId', headerName: 'Tender ID', width: 100, sortable: true},
    { field: 'bidId', headerName: 'Bid ID', width: 250, sortable: true},
];

 /**
   * Creates the table containing salts.
   * @param {*} data JSON object containing the salttender data.

   */
 export default function SaltsDataGrid({data}) {
    // Allos popup to be displayed when a row is clicked
    console.log("data", data);
    const [rowPopup, setRowPopup] = useState(false);
    const [tenderID, setTenderID] = useState();
    const [penaltyAmt, setPenaltyAmt] = useState();
    const [addPopup, setAddPopup] = useState(false);
    

    function performPopup(index, value, penalty) {
        setRowPopup(true);
        setTenderID(index);
        //setBidValue(value);
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
                autoHeight
            />
            <Popup trigger={rowPopup} setTrigger={setRowPopup}>
                <RevealBid tenderID={tenderID} penaltyAmt={penaltyAmt}/>
            </Popup>
        </div>
  );
}