import * as React from 'react';
import { useState, useRef } from 'react';
import TenderTable from './TenderTable';
import styles from "../../styles/Tender.module.css"
import TendersDataGrid from './TendersDataGrid';

export default function Tenders(props) {

    // Filtering so as to only have Open tenders
    let tenders = props.data.filter(function(open) {
        return open.status == "Open";
    });

    const popUpChecked = props.popUpChecked;
    const openTenders = props.openTenders;
    const biddingForm = props.biddingForm;

    const [searchTerm, setSearchTerm] = useState("");
    const inputEl = useRef("");
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm !== "") {
            const newDataList = tenders.filter((tenders) => {
                return Object.values(tenders).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(newDataList);
        } else {
            setSearchResults(tenders);
        }
    };

    const getSearchTerm = () => {
        searchHandler(inputEl.current.value);
    };

    const getLocation = () => {
        const location = useLocation();
        return location.pathname;
    };
    
    return (
        <div className={ styles.container }>
            {/* <div className={ styles.tenderSearchContainer }>
                <input
                    ref={inputEl}
                    type="text"
                    placeholder="Search Tenders..."
                    value={tenders.searchTerm}
                    //value={""}
                    onChange={getSearchTerm}
                    className={ styles.tenderSearchInput }
                />
            </div> */}

            {/* {<TenderTable data={searchTerm.length < 1 ? tenders : searchResults} popUpChecked={popUpChecked} openTenders={openTenders}/>} */}
            {<TendersDataGrid data={props.data} popUpChecked={popUpChecked} openTenders={true} biddingForm={biddingForm} patients={props.patients}/>}

        </div>
    );
}
