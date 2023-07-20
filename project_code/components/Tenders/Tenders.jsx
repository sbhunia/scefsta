import * as React from "react";
import { useState, useRef } from "react";
import styles from "../../styles/Tender.module.css";
import TendersDataGrid from "./TendersDataGrid";

export default function Tenders(props) {
  const popUpChecked = props.popUpChecked;
  const biddingForm = props.biddingForm;

  return (
    <div className={styles.container}>
      {
        <TendersDataGrid
          data={props.data}
          popUpChecked={popUpChecked}
          openTenders={true}
          biddingForm={biddingForm}
          patients={props.patients}
          getWinner={props.getWinner}
        />
      }
    </div>
  );
}
