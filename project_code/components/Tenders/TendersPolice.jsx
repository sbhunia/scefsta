import * as React from 'react';
import { useState, useRef } from 'react';
import styles from "../../styles/Tender.module.css"
import TendersDataGrid from './TendersDataGrid';

/**
 * Main component for Tenders table and search; used when looking at Open Tenders.
 * @param {*} tend JSON object containing open tenders.
 */
export default function Tenders(tend) {

    let tenders = tend.data

    const popUpChecked = tend.popUpChecked;

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
    
    return (
        <div className={ styles.containerPolice }>
            {<TendersDataGrid data={searchTerm.length < 1 ? tenders : searchResults} popUpChecked={popUpChecked} openTenders={false} account={tend.account}/>}

        </div>
    );
}
