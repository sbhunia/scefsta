import * as React from 'react';
import { useState, useRef } from 'react';
import PatientTable from './PatientTable';
import styles from "../../styles/Patients.module.css"
import PatientsDataGrid from './PatientsDataGrid';

export default function Patients(pat) {

    // JSON containing patient data
    let patients = pat.data

    // Boolean value that enables/disables pop-ups to confirm patient arrival.
    const arrival = pat.arrival;

    const [searchTerm, setSearchTerm] = useState("");
    const inputEl = useRef("");
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm !== "") {
            const newDataList = patients.filter((patients) => {
                return Object.values(patients).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(newDataList);
        } else {
            setSearchResults(patients);
        }
    };

    const getSearchTerm = () => {
        searchHandler(inputEl.current.value);
    };
    
    return (
        <div className={styles.container}>
            {/* <div className={ styles.patientSearchContainer }>
                <input
                    ref={inputEl}
                    type="text"
                    placeholder="Search Patients..."
                    value={patients.searchTerm}
                    onChange={getSearchTerm}
                    className={ styles.patientSearchInput }
                />
            </div> */}

            {/* <PatientTable data={searchTerm.length < 1 ? patients : searchResults} arrival={arrival}/> */}
            <PatientsDataGrid data={searchTerm.length < 1 ? patients : searchResults} arrival={arrival}/>
        </div>
    );
}
