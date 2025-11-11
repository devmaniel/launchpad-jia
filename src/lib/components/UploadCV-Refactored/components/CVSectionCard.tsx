/**
 * CVSectionCard - Individual CV section with edit capability
 */

import React from "react";
import Markdown from "react-markdown";
import { assetConstants } from "@/lib/utils/constantsV2";
import styles from "../styles/components/CVSectionCard.module.scss";

interface CVSectionCardProps {
  section: string;
  content: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onChange: (value: string) => void;
}

export function CVSectionCard({
  section,
  content,
  isEditing,
  onEdit,
  onSave,
  onChange,
}: CVSectionCardProps) {
  const hasContent = content && content.trim() !== "";

  return (
    <div className={styles.gradient}>
      <div className={styles.cvDetailsCard}>
        <span className={styles.sectionTitle}>
          {section}
          <div className={styles.editIcon}>
            <img
              alt={isEditing ? "Save" : "Edit"}
              src={isEditing ? assetConstants.save : assetConstants.edit}
              onClick={isEditing ? onSave : onEdit}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </span>

        <div className={styles.detailsContainer}>
          {isEditing ? (
            <textarea
              id={section}
              placeholder="Upload your CV to auto-fill this section."
              value={content}
              onBlur={(e) => {
                e.target.placeholder = "Upload your CV to auto-fill this section.";
              }}
              onChange={(e) => onChange(e.target.value)}
              onFocus={(e) => {
                e.target.placeholder = "";
              }}
            />
          ) : (
            <span
              className={`${styles.sectionDetails} ${
                hasContent ? styles.withDetails : ""
              }`}
            >
              <Markdown>
                {hasContent
                  ? content.trim()
                  : "Upload your CV to auto-fill this section."}
              </Markdown>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
