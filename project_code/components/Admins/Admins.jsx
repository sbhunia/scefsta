import * as React from "react";
import { useState, useRef } from "react";
import AdminDataGrid from "./AdminDataGrid";
import styles from "../../styles/Admins.module.css";

/**
 * Creates the main component for holding the table of admins. Available in the Contract Administrator page.
 * @param {*} adminData JSON data containing admin information plus the wallet ID.
 */
export default function Admins(adm) {
  // JSON containing data on admins
  let admins = adm.data;
  // Boolean value that enables/disables pop-ups to edit/delete admins
  const popUpChecked = adm.popUpChecked;

  const [searchTerm, setSearchTerm] = useState("");
  const inputEl = useRef("");
  const [searchResults, setSearchResults] = useState([]);

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newDataList = admins.filter((admins) => {
        return Object.values(admins)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newDataList);
    } else {
      setSearchResults(admins);
    }
  };

  const getSearchTerm = () => {
    searchHandler(inputEl.current.value);
  };

  return (
    <div className={styles.container}>
      <AdminDataGrid
        data={searchTerm.length < 1 ? admins : searchResults}
        popUpChecked={popUpChecked}
      ></AdminDataGrid>
    </div>
  );
}
