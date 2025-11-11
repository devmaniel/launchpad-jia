/**
 * CVScreeningLoader - Loading animation during CV screening
 */

import React from "react";
import { assetConstants } from "@/lib/utils/constantsV2";
import styles from "../styles/components/CVScreeningLoader.module.scss";

export function CVScreeningLoader() {
  return (
    <div className={styles.cvScreeningContainer}>
      <img alt="Loading" src={assetConstants.loading} />
      <span className={styles.title}>Sit tight!</span>
      <span className={styles.description}>
        Our smart reviewer is checking your qualifications.
      </span>
      <span className={styles.description}>
        We'll let you know what's next in just a moment.
      </span>
    </div>
  );
}
