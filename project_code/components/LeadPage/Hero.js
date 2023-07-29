import React from "react";
import styles from "../../styles/Landing.module.css";
import * as Constants from "../../pages/constants";

export default function Hero() {
  return (
    <div>
      <div className={styles.headerHero}>
        <div>
          <h1 className={styles.headerTitle}>{Constants.PROJECT_NAME}</h1>
          <p className={styles.headerDesc}>
            Blockchain in Emergency Response Systems
          </p>
        </div>
        <img
          src="/service-banner.png"
          className={styles.headerImg}
          width="927"
          sizes="(max-width: 767px) 85vw, (max-width: 991px) 66vw, 85vw"
        ></img>
      </div>
    </div>
  );
}
