/**
 * CVUploadOptions - Upload or review CV options
 */

import React, { useRef } from "react";
import { assetConstants } from "@/lib/utils/constantsV2";
import { checkFile } from "@/lib/utils/helpersV2";
import { FILE_ACCEPT_STRING } from "../constants";
import styles from "../styles/components/CVUploadOptions.module.scss";

interface CVUploadOptionsProps {
  hasDigitalCV: boolean;
  onFileSelected: (file: File) => void;
  onReviewCV: () => void;
  onContinue?: () => void;
}

export function CVUploadOptions({
  hasDigitalCV,
  onFileSelected,
  onReviewCV,
  onContinue,
}: CVUploadOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  };

  const handleFile = (files: FileList) => {
    const file = checkFile(files);
    if (file) {
      onFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.cvManageContainer}>
      {/* Upload CV Option */}
      <div
        className={styles.cvContainer}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <img alt="Upload CV" src={assetConstants.uploadV2} />
        <button onClick={handleUploadClick}>Upload CV</button>
        <span>
          Choose or drag and drop a file here. Our AI tools will automatically
          pre-fill your CV and also check how well it matches the role.
        </span>
      </div>

      <input
        type="file"
        accept={FILE_ACCEPT_STRING}
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Review Current CV Option */}
      <div className={styles.cvContainer}>
        <img alt="Review CV" src={assetConstants.review} />
        <button
          className={hasDigitalCV ? "" : "disabled"}
          disabled={!hasDigitalCV}
          onClick={onReviewCV}
        >
          Review Current CV
        </button>
        <span>
          Already uploaded a CV? Take a moment to review your details before we
          proceed.
        </span>
      </div>

      {onContinue && (
        <div className={styles.buttonGroup}>
          <button className={styles.continueButton} onClick={onContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
