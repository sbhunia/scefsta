import React from "react";
import styles from "../../styles/Landing.module.css";
import "../../public/logo_P_1.png";
import Link from "next/link";
import Image from "next/image";
import * as Constants from "../../constants";

export default function Hero() {
  return (
    <div className={styles.footer}>
      <div className={styles.containerFooter}>
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
            <div className={styles.footerTitle}>{Constants.PROJECT_ABR}</div>
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
        <div className={styles.copyright}>
          &copy; {Constants.PROJECT_NAME} - Miami University
        </div>
    </div>
  );
}
