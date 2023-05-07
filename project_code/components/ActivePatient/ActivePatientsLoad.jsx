import * as React from 'react';
import { useState, useRef } from 'react';
import PatientsTable from "./ActivePatientsTable";
import styles from '../../styles/Patients.module.css'
import ActivePatientsDataGrid from "./ActivePatientsDataGrid";

export default function Hosptials(patientData) {

    let testData = patientData.data

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
            {/* <PatientsTable data={searchTerm.length < 1 ? testData : searchResults} /> */}
            <ActivePatientsDataGrid data={searchTerm.length < 1 ? testData : searchResults} />
        </div>
    );
}