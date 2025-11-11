/**
 * CVBuildingLoader - Shows loading state while CV is being processed
 */

import React from "react";
import { assetConstants } from "@/lib/utils/constantsV2";
import { FileInfo } from "../types";
import styles from "../styles/components/CVBuildingLoader.module.scss";

interface CVBuildingLoaderProps {
  file: FileInfo;
}

export function CVBuildingLoader({ file }: CVBuildingLoaderProps) {
  return (
    <div className={styles.cvDetailsContainer}>
      <div className={styles.gradient}>
        <div className={styles.cvDetailsCard}>
          <span className={styles.sectionTitle}>
            <img alt="Account" src={assetConstants.account} />
            Submit CV
          </span>
          <div className={styles.detailsContainer}>
            <span className={styles.fileTitle}>
              <img alt="Completed" src={assetConstants.completed} />
              {file.name}
            </span>
            <div className={styles.loadingContainer}>
              <img alt="Loading" src={assetConstants.loading} />
              <div className={styles.textContainer}>
                <span className={styles.title}>
                  Extracting information from your CV...
                </span>
                <span className={styles.description}>
                  Jia is building your profile...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
