/**
 * CVDetailsForm - Form for editing CV details with all sections
 */

import React, { useRef } from "react";
import { assetConstants } from "@/lib/utils/constantsV2";
import { UserCV } from "../types";
import { CV_SECTIONS, FILE_ACCEPT_STRING } from "../constants";
import { CVSectionCard } from "./CVSectionCard";
import { checkFile } from "@/lib/utils/helpersV2";
import styles from "../styles/components/CVDetailsForm.module.scss";

interface CVDetailsFormProps {
  userCV: UserCV;
  file: File | null;
  editingCV: string | null;
  onEditSection: (section: string | null) => void;
  onUpdateCV: (updatedCV: UserCV) => void;
  onFileSelected: (file: File) => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
  onMarkChanges: () => void;
}

export function CVDetailsForm({
  userCV,
  file,
  editingCV,
  onEditSection,
  onUpdateCV,
  onFileSelected,
  onRemoveFile,
  onSubmit,
  onMarkChanges,
}: CVDetailsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFile = checkFile(files);
      if (validFile) {
        onFileSelected(validFile);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSectionChange = (section: string, value: string) => {
    onUpdateCV({
      ...userCV,
      [section]: value,
    });
    onMarkChanges();
  };

  return (
    <div className={styles.cvDetailsContainer}>
      {/* File Upload Section */}
      <div className={styles.gradient}>
        <div className={styles.cvDetailsCard}>
          <span className={styles.sectionTitle}>
            <img alt="Account" src={assetConstants.account} />
            Submit CV
            <div className={styles.editIcon}>
              <img
                alt={file ? "Remove" : "Upload"}
                src={file ? assetConstants.xV2 : assetConstants.save}
                onClick={file ? onRemoveFile : handleUploadClick}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <input
              type="file"
              accept={FILE_ACCEPT_STRING}
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </span>

          <div className={styles.detailsContainer}>
            {file ? (
              <span className={styles.fileTitle}>
                <img alt="Completed" src={assetConstants.completed} />
                {file.name}
              </span>
            ) : (
              <span className={styles.fileTitle}>
                <img alt="File" src={assetConstants.fileV2} />
                You can also upload your CV and let our AI automatically fill in
                your profile information.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CV Sections */}
      {CV_SECTIONS.map((section, index) => (
        <CVSectionCard
          key={index}
          section={section}
          content={userCV[section] || ""}
          isEditing={editingCV === section}
          onEdit={() => onEditSection(section)}
          onSave={() => onEditSection(null)}
          onChange={(value) => handleSectionChange(section, value)}
        />
      ))}

      {/* Submit Button */}
      <button className={styles.submitButton} onClick={onSubmit}>
        Submit CV
      </button>
    </div>
  );
}
