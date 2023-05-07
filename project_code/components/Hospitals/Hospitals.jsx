import * as React from 'react';
import { useState, useRef } from 'react';
import HospitalTable from "./HospitalTable";
import styles from '../../styles/Hospitals.module.css'
import HospitalDataGrid from './HospitalDataGrid';

/**
 * Creates the main component for holding the table of hospitals. Available in the Contract Administrator page.
 * @param {*} hospitalData JSON data containing hospital information plus the wallet ID.
 */
export default function Hospitals(hospitalData) {

    let testData = hospitalData.data

    const popUpChecked = hospitalData.popUpChecked;

    const [searchTerm, setSearchTerm] = useState("");
    const inputEl = useRef("");
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm !== "") {
            const newDataList = testData.filter((testData) => {
                return Object.values(testData).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(newDataList);
        } else {
            setSearchResults(testData);
        }
    };

    const getSearchTerm = () => {
        searchHandler(inputEl.current.value);
    };

    return (
        <div className={styles.container}>
            {/* <div className={ styles.hospitalSearchContainer }>
                <input
                    ref={inputEl}
                    type="text"
                    placeholder="Search Hospitals..."
                    value={testData.searchTerm}
                    onChange={getSearchTerm}
                    className={ styles.hospitalSearchInput }
                />
            </div> */}

            {/* <HospitalTable data={searchTerm.length < 1 ? testData : searchResults} popUpChecked={popUpChecked} /> */}
            <HospitalDataGrid data={searchTerm.length < 1 ? testData : searchResults} popUpChecked={popUpChecked} />
        </div>
    );
}