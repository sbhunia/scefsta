import React from "react";
import * as IoIcons from "react-icons/io5";
import styles from "../../styles/TopNavbar.module.css";
import "../../public/logo_P_1.png";
import { useState } from "react";
import Popup from "../Popup/Popup";
import stylesP from "../../styles/Popup.module.css";
import * as Constants from "../../pages/constants";

export default function TopNavbar() {
  return (
    <div className={styles.topNavbar}>
      <div className={styles.topbarWrapper}>
        <div>
          <span className={styles.topbarLeft}>
            <img src="logo_P_1.png" className={styles.topbarLogo}></img>
            <h3 className={styles.topbarUser}>{Constants.PROJECT_ABR}</h3>
          </span>
        </div>
        <div className={styles.topbarRight}>
          <div className={styles.topbarIconContainer}>
            <IoIcons.IoNotifications className={styles.topbarRightIcon} />
            <span className={styles.topIconBadge}>2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
