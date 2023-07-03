import React from "react";
import styles from "../../styles/Landing.module.css";
import '../../public/logo_P_1.png'
import Link from 'next/link';
import Image from 'next/image';
import * as Constants from '../../pages/constants'

export default function Hero() {
    return (
        <div className={styles.footer}>
            <div className={styles.containerFooter}>
                <div className={styles.grid}>
                    <div className={styles.footerLogo}>
                        <Link href="/">
                            <a><Image src="/logo_P_1.png" alt="AIS Logo" width="70" height="70"/></a>
                        </Link>
                    </div>
                    <div>
                        <div className={styles.footerTitle}>
                            AIS
                        </div>
                        <div className={styles.footerItem}>
                            <Link href={Constants.DevAmbulanceURL}>
                                <a>EMS Providers</a>
                            </Link>
                        </div>
                        <div className={styles.footerItem}>
                            <Link href={Constants.DevPoliceURL}>
                                <a>{Constants.POLICE}</a>
                            </Link>
                        </div>
                        <div className={styles.footerItem}>
                            <Link href={Constants.DevHospitalURL}>
                                <a>Healthcare Institutions</a>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className={styles.footerTitle}>
                            Project
                        </div>
                        <div className={styles.footerItem}>
                            <Link href={Constants.DevAboutURL}>
                                <a>About</a>
                            </Link>
                        </div>
                        <div className={styles.footerItem}>
                            <Link href={Constants.DevAboutURL}>
                                <a>Our Team</a>
                            </Link>
                        </div>
                        <div className={styles.footerItem}>
                            <Link href="/">
                                <a>Contact</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.socialwrap}>
                    <a href="/" className={styles.socialLink}><img src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c7d899b2ee64_Slack_Mark.svg" alt="AIS Slack" /></a>
                    <a href="/" className={styles.socialLink}><img src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c74f2ab2ee65_icon%20twitter.svg" alt="AIS Twitter" /></a>
                    <a href="/" className={styles.socialLink}><img src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c712ffb2ee66_icon%20linkedin.svg" alt="AIS Linkedin" className="linkedin" /></a>
                    <a href="/" className={styles.socialLink}><img src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c72c8fb2ee69_icon-github.svg" width="22" alt="AIS Github" /></a>
                </div>
                <div className={styles.copyright}>
                    &copy; Ambulance Incentive System - Miami University
                </div>
            </div>
        </div>
    )
}
