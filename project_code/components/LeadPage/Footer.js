import React from "react";
import styles from "../../styles/Landing.module.css";
import "../../public/logo_P_1.png";
import Link from "next/link";
import Image from "next/image";
import * as Constants from "../../pages/constants";

export default function Hero() {
  return (
    <div className={styles.footer}>
      <div className={styles.containerFooter}>
        <div className={styles.grid}>
          <div className={styles.footerLogo}>
            <Link href="/">
              <a>
                <Image
                  src="/logo_P_1.png"
                  alt={Constants.PROJECT_ABR + " Logo"}
                  width="70"
                  height="70"
                />
              </a>
            </Link>
          </div>
          <div>
            <div className={styles.footerTitle}>{Constants.PROJECT_ABR}</div>
            <div className={styles.footerItem}>
              <Link href={Constants.DevAmbulanceURL}>
                <a>{Constants.AMBULANCE_PLURAL}</a>
              </Link>
            </div>
            <div className={styles.footerItem}>
              <Link href={Constants.DevPoliceURL}>
                <a>{Constants.POLICE_PLURAL}</a>
              </Link>
            </div>
            <div className={styles.footerItem}>
              <Link href={Constants.DevHospitalURL}>
                <a>{Constants.HOSPITAL_PLURAL}</a>
              </Link>
            </div>
          </div>
          <div>
            <div className={styles.footerTitle}>Project</div>
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
          <a href="/" className={styles.socialLink}>
            <img
              src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c7d899b2ee64_Slack_Mark.svg"
              alt={Constants.PROJECT_ABR + " Slack"}
            />
          </a>
          <a href="/" className={styles.socialLink}>
            <img
              src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c74f2ab2ee65_icon%20twitter.svg"
              alt={Constants.PROJECT_ABR + " Twitter"}
            />
          </a>
          <a href="/" className={styles.socialLink}>
            <img
              src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c712ffb2ee66_icon%20linkedin.svg"
              alt={Constants.PROJECT_ABR + " Linkedin"}
              className="linkedin"
            />
          </a>
          <a href="/" className={styles.socialLink}>
            <img
              src="https://global-uploads.webflow.com/5e387f889619c7f925b2ed39/5e387f889619c72c8fb2ee69_icon-github.svg"
              width="22"
              alt={Constants.PROJECT_ABR + " Github"}
            />
          </a>
        </div>
        <div className={styles.copyright}>
          &copy; {Constants.PROJECT_NAME} - Miami University
        </div>
      </div>
    </div>
  );
}
