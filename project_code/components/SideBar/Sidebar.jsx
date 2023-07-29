import React, { useState, useEffect } from "react";
import {
  SidebarAdminDataDashbaord,
  SidebarAdminDataSettings,
  getSideBarData,
} from "./SidebarAdminData.jsx";
import styles from "../../styles/Sidebar.module.css";
import Link from "next/link";
import BackgroundBlobWhite from "./BackgroundBlobWhite";
import BackgroundBlobAzure from "./BackgroundBlobAzure";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHospital, setIsHospital] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);
  const [sidebarAdminDataDashboard, setSidebarAdminDataDashboard] = useState(
    SidebarAdminDataDashbaord
  );

  useEffect(() => {
    setIsAdmin(JSON.parse(sessionStorage.getItem("isAdmin")));
    setIsHospital(JSON.parse(sessionStorage.getItem("isHospital")));
    setIsPolice(JSON.parse(sessionStorage.getItem("isPolice")));
    setIsAmbulance(JSON.parse(sessionStorage.getItem("isAmbulance")));
  });

  useEffect(() => {
    setSidebarAdminDataDashboard(
      getSideBarData(isAdmin, isHospital, isPolice, isAmbulance)
    );
  }, [isAdmin, isHospital, isPolice, isAmbulance]);

  return (
    <div className={styles.sidebarStyles}>
      <div className={styles.blobs}>
        <BackgroundBlobWhite />
        <BackgroundBlobAzure />
      </div>
      <div className={styles.sidebarWrapper}>
        <div className={styles.sidebarMenu}>
          <h3 className={styles.sidebarTitle}>Role Navigation</h3>
          <ul className={styles.sidebarList}>
            {sidebarAdminDataDashboard.map((item, index) => {
              return (
                <Link href={item.path}>
                  <li key={index} className={styles.flexListItem}>
                    <h6 className={styles.sidebarIcon}> {item.icon} </h6>
                    <h6 className={styles.sidebarListItem}>{item.title}</h6>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className={styles.sidebarMenu}>
          <h3 className={styles.sidebarTitle}>Settings</h3>
          <ul className={styles.sidebarList}>
            {SidebarAdminDataSettings.map((item, index) => {
              return (
                <Link href={item.path}>
                  <li key={index} className={styles.flexListItem}>
                    <h6 className={styles.sidebarIcon}> {item.icon} </h6>
                    <h6 className={styles.sidebarListItem}>{item.title}</h6>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
