import * as React from 'react';
import { useState, useRef } from 'react';
import styles from "../../styles/Police.module.css";
import InitiatorHandler from './InitiatorHandler';

/**
 * Creates the main component for holding the table of police departments. Available in the Contract Administrator page.
 * @param {*} policeData JSON data containing police department information plus the wallet ID.
 */
export default function Police(policeData) {

    let testData = policeData.data

    const popUpChecked = policeData.popUpChecked;

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
            <InitiatorHandler data={searchTerm.length < 1 ? testData : searchResults} popUpChecked={popUpChecked} openTenders={false}/>
        </div>
    );
}