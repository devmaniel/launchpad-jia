/**
 * CVHeader - Displays job application header with organization info
 */

import React from "react";
import { Interview } from "../types";
import styles from "../styles/components/CVHeader.module.scss";

interface CVHeaderProps {
  interview: Interview;
  onViewJobDescription: () => void;
}

export function CVHeader({ interview, onViewJobDescription }: CVHeaderProps) {
  return (
    <div className={styles.uploadCVHeader}>
      {interview.organization?.image && (
        <img alt={interview.organization.name} src={interview.organization.image} />
      )}
      <div className={styles.textContainer}>
        <span className={styles.tag}>You're applying for</span>
        <span className={styles.title}>{interview.jobTitle}</span>
        {interview.organization?.name && (
          <span className={styles.name}>{interview.organization.name}</span>
        )}
        <span className={styles.description} onClick={onViewJobDescription}>
          View job description
        </span>
      </div>
    </div>
  );
}
