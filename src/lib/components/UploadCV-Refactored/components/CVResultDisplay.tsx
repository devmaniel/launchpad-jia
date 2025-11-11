/**
 * CVResultDisplay - Displays CV screening results
 */

import React from "react";
import { assetConstants, pathConstants } from "@/lib/utils/constantsV2";
import { ScreeningResult } from "../types";
import styles from "../styles/components/CVResultDisplay.module.scss";

interface CVResultDisplayProps {
  screeningResult: ScreeningResult;
  interviewID: string;
}

export function CVResultDisplay({ screeningResult, interviewID }: CVResultDisplayProps) {
  const handleRedirection = (type: "dashboard" | "interview") => {
    if (type === "dashboard") {
      window.location.href = pathConstants.dashboard;
    }

    if (type === "interview") {
      sessionStorage.setItem("interviewRedirection", pathConstants.dashboard);
      window.location.href = `/interview/${interviewID}`;
    }
  };

  // Dropped Application
  if (screeningResult.applicationStatus === "Dropped") {
    return (
      <div className={styles.cvResultContainer}>
        <img alt="Rejected" src="/temp/badfit-icon.svg" style={{width: 56, height: 56}} />
        <span className={styles.title} style={{fontSize: 18, fontWeight: 600}}>
          This role may not be the best match.
        </span>
        <span className={styles.description} style={{fontSize: 12, color: "#717680", fontWeight: 400, margin: 0}}>
          Based on your application details, it looks like this position might not be the right fit at the moment.
        </span>
        <span className={styles.description} style={{fontSize: 12, color: "#717680", fontWeight: 400, margin: 0, marginTop: 4}}>
          Review your screening results and see recommended next steps.
        </span>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={() => handleRedirection("dashboard")}>
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  // AI Interview Required
  if (screeningResult.status === "For AI Interview") {
    return (
      <div className={styles.cvResultContainer}>
        <img alt="Success" src="/temp/goodfit-icon.svg" style={{width: 56, height: 56}} />
        <span className={styles.title} >
          Hooray! You're a strong fit for this role.
        </span>
        <span className={styles.description}>
          Jia thinks you might be a great match.
        </span>
        <br />
        <span className={`${styles.description} ${styles.bold}`} style={{ marginTop: 20 }}>
          Ready to take the next step?
        </span>
        <span className={styles.description}>
          You may start your AI interview now.
        </span>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={() => handleRedirection("interview")}>
            Start AI Interview
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => handleRedirection("dashboard")}
          >
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Manual Review
  return (
    <div className={styles.cvResultContainer}>
      <img alt="Under Review" src="/temp/maybefit-icon.svg" style={{width: 56, height: 56}} />
      <span className={styles.title} style={{fontSize: 18, fontWeight: 600}}>
        Your application is now being reviewed by the hiring team.
      </span>
      <span className={styles.description} style={{fontSize: 14, color: "#717680", fontWeight: 400, margin: 0}}>
        We'll be in touch soon with updates.
      </span>
      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton} onClick={() => handleRedirection("dashboard")}>
          View Dashboard
        </button>
      </div>
    </div>
  );
}
