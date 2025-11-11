/**
 * JobDescriptionModal - Right-side sidebar modal for displaying job description
 * Specific to UploadCV-Refactored component
 */

import React from "react";
import { Interview } from "../types";
import styles from "../styles/components/JobDescriptionModal.module.scss";
import { assetConstants, pathConstants } from "@/lib/utils/constantsV2";
import { processDate } from "@/lib/utils/helpersV2";
import { useAppContext } from "@/lib/context/ContextV2";
import { sanitizeHtml } from "@/lib/utils/sanitize";

interface JobDescriptionModalProps {
  interview: Interview;
  onClose: () => void;
}

export function JobDescriptionModal({ interview, onClose }: JobDescriptionModalProps) {
  const { setModalType } = useAppContext();
  const [viewDropdown, setViewDropdown] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const dropdown = [
    {
      name: "Share Job",
      onClick: () => {
        sessionStorage.setItem("selectedCareer", JSON.stringify(interview));
        setModalType("share");
        setViewDropdown(false);
      },
    },
    {
      name: "Report Job",
      onClick: () => {
        sessionStorage.setItem("selectedCareer", JSON.stringify(interview));
        setModalType("report");
        setViewDropdown(false);
      },
    },
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (viewDropdown && !target.closest(`.${styles.titleContainer}`) && !target.closest(`.${styles.dropdownContainer}`)) {
        setViewDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewDropdown]);

  // Close modal when clicking outside sidebar
  React.useEffect(() => {
    const handleClickOutsideSidebar = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains(styles.modalOverlay)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div 
        className={styles.modalSidebar}
      >
        <div className={styles.gradientContainer}>
          <div className={styles.jobDetailsContainer}>
            {interview.jobTitle && (
              <div className={styles.titleContainer}>
                <span>{interview.jobTitle}</span>
                <img
                  alt="external link"
                  src={assetConstants.externalLink}
                  onClick={() => {
                    const url = `${pathConstants.jobOpenings}/${interview._id || interview.interviewID}`;
                    window.open(url, '_blank');
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <img
                  alt="menu"
                  src={assetConstants.ellipsis}
                  onClick={() => setViewDropdown(!viewDropdown)}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            )}

            {viewDropdown && (
              <div className={styles.dropdownContainer}>
                {dropdown.map((item, index) => (
                  <span key={index} onClick={item.onClick}>
                    {item.name}
                  </span>
                ))}
              </div>
            )}

            {interview.organization?.name && (
              <span className={styles.companyName}>
                {interview.organization.name}
              </span>
            )}

            {interview.location && (
              <span className={`${styles.details} ${styles.withMargin}`}>
                <img alt="location" src={assetConstants.mapPin} />
                {interview.location}
              </span>
            )}

            {interview.createdAt && (
              <span className={styles.details}>
                <img alt="time" src={assetConstants.clock} />
                {processDate(interview.createdAt)}
              </span>
            )}

            {interview.workSetup && (
              <div className={styles.tagContainer}>
                <span>{interview.workSetup}</span>
              </div>
            )}

            <hr />

            <div
              className={styles.jobDescription}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(interview.description || "No description available."),
              }}
            />

            <hr />

            <div className={styles.aboutCompanySection}>
              <h2 className={styles.aboutCompanyTitle}>About The Company</h2>

              <div className={styles.companyInfoContainer}>
                {!imageError && (
                  <img
                    alt="Company Logo"
                    className={styles.companyLogoLarge}
                    src="https://www.pngitem.com/pimgs/m/279-2795161_acme-looney-tunes-logo-png-transparent-png.png"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className={styles.companyLogoFallback}>
                    <span>AC</span>
                  </div>
                )}

                <div className={styles.companyInfoDetails}>
                  <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                    <h3 className={styles.companyName}>
                      Acme Company
                    </h3>

                    <p className={styles.companyLocation}>
                      Software Development | BGC, Metro Manila, Philippines
                    </p>
                  </div>

                  <p className={styles.companyDescription} style={{fontSize: 12}}>
                    Founded in 2014, Acme Company continues to be the
                    innovation partner of choice for many major
                    corporations, leveraging technology to take its
                    client's business to the next level. This technical
                    superiority and commitment to our clients have
                    brought numerous recognition and awards to Acme.
                  </p>

                  <button
                    className={styles.learnMorePillButton}
                    onClick={() => window.open(pathConstants.whitecloak, '_blank')}
                  >
                    Learn More
                    <img alt="arrow" src="/temp/arrow-right-dark.svg" width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
