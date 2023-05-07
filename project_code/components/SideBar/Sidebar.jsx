import React from 'react'
import {
    SidebarAdminDataDashbaord,
    SidebarAdminDataNotifications,
    SidebarAdminDataSettings
} from './SidebarAdminData.jsx';
import styles from '../../styles/Sidebar.module.css';
import Link from 'next/link';
import BackgroundBlobWhite from './BackgroundBlobWhite';
import BackgroundBlobAzure from './BackgroundBlobAzure';


export default function Sidebar() {

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
                        {SidebarAdminDataDashbaord.map((item, index) => {
                            return (
                                <Link href={item.path}>
                                    <li key={index} className={styles.flexListItem}>
                                        <h6 className={styles.sidebarIcon} > {item.icon} </h6>
                                        <h6 className={styles.sidebarListItem}>{item.title}</h6>
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                </div>

                <div className={styles.sidebarMenu}>
                    <h3 className={styles.sidebarTitle}>Notifications</h3>
                    <ul className={styles.sidebarList}>
                        {SidebarAdminDataNotifications.map((item, index) => {
                            return (
                                <li key={index} className={styles.flexListItem}>
                                    <h6 className={styles.sidebarIcon} > {item.icon} </h6>
                                    <h6 className={styles.sidebarListItem}>{item.title}</h6>
                                </li>
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
                                        <h6 className={styles.sidebarIcon} > {item.icon} </h6>
                                        <h6 className={styles.sidebarListItem}>{item.title}</h6>
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}
