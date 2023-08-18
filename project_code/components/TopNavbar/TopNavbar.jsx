import React from "react";
import styles from "../../styles/TopNavbar.module.css";
import "../../public/logo_P_1.png";
import * as Constants from "../../pages/constants";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

export default function TopNavbar() {

  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
  
  return (
    <div className={styles.topNavbar}>
      <div className={styles.topbarWrapper}>
        <div>
          <span className={styles.topbarLeft}>
            <img src="logo_P_1.png" className={styles.topbarLogo}></img>
            <h3 className={styles.topbarUser}>{Constants.PROJECT_ABR}</h3>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
        {etherBalance && (
          <div className="balance">
            <p className="bold" style={{ margin: "0 20px", color: "#fff" }}>
              Address:{" "}
              {account.substring(0, 5) +
                "..." +
                account.substring(account.length - 4, account.length - 1)} 
                <span className={styles.tab}></span>
              Balance: {formatEther(etherBalance).substring(0, 8)}
            </p>
          </div>
        )}
\      </div>
      </div>
    </div>
  );
}
