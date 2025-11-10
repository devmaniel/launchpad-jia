"use client";
import { useState } from "react";
import { formatDateToRelativeTime } from "../../../Utils";

interface ApplicantCardsProps {
  candidates: any[];
  stage: string;
  handleCandidateMenuOpen: (candidate: any) => void;
  handleCandidateCVOpen: (candidate: any) => void;
  handleEndorseCandidate: (candidate: any) => void;
  handleDropCandidate: (candidate: any) => void;
  handleCandidateHistoryOpen: (candidate: any) => void;
  handleRetakeInterview: (candidate: any) => void;
  emptyMessage?: string;
}

interface ApplicantCardItemProps {
  candidate: any;
  stage: string;
  handleCandidateMenuOpen: (candidate: any) => void;
  handleCandidateCVOpen: (candidate: any) => void;
  handleEndorseCandidate: (candidate: any) => void;
  handleDropCandidate: (candidate: any) => void;
  handleCandidateHistoryOpen: (candidate: any) => void;
  handleRetakeInterview: (candidate: any) => void;
}

function ApplicantCardItem({
  candidate,
  stage,
  handleCandidateMenuOpen,
  handleCandidateCVOpen,
  handleEndorseCandidate,
  handleDropCandidate,
  handleCandidateHistoryOpen,
  handleRetakeInterview
}: ApplicantCardItemProps) {
  const { name, email, image, createdAt, currentStep, cvStatus, jobFit, applicationMetadata } = candidate;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleViewCV = () => {
    handleCandidateCVOpen({ ...candidate, stage });
    setMenuOpen(!menuOpen);
  };

  const handleViewHistory = () => {
    handleCandidateHistoryOpen({ ...candidate, stage });
    setMenuOpen(!menuOpen);
  };

  const handleSelectMenuOption = () => {
    handleCandidateMenuOpen({ ...candidate, stage });
    setMenuOpen(!menuOpen);
  };

  const hasPendingInterviewRetakeRequest =
    candidate?.retakeRequest &&
    !["Approved", "Rejected"].includes(candidate?.retakeRequest?.status);

  // Determine fit label and styling based on stage
  const getFitInfo = () => {
    // Job Offer/Hired stage - no label (like Waiting for Submission)
    if (currentStep === "Job Offer" || currentStep === "Hired" || stage === "Job Offer" || stage === "Hired") {
      return null;
    }
    
    // CV Screening or Pending AI Interview
    if (currentStep === "CV Screening" || stage === "Pending AI Interview") {
      const status = cvStatus;
      if (!status) return null;
      
      let styles = { bg: "#F8F9FC", border: "#D5D9EB", color: "#363F72", hasIcon: false };
      
      if (status === "Good Fit") {
        styles = { bg: "#B2DDFF", border: "#B2DDFF", color: "#175CD3", hasIcon: false };
      } else if (status === "Strong Fit") {
        styles = { bg: "#ECFDF3", border: "#A6F4C5", color: "#027948", hasIcon: true };
      } else if (status === "Maybe Fit") {
        styles = { bg: "#F8F9FC", border: "#D5D9EB", color: "#363F72", hasIcon: false };
      } else if (status === "Bad Fit") {
        styles = { bg: "#FEF3F2", border: "#FECDCA", color: "#B32318", hasIcon: false };
      }
      
      return { label: `JIA: ${status}`, ...styles };
    }
    
    // Human Interview stage - use "Interview: Fit" prefix
    if (currentStep === "Human Interview" || stage === "Human Interview") {
      const fit = jobFit;
      if (!fit) return null;
      
      let styles = { bg: "#F8F9FC", border: "#D5D9EB", color: "#363F72", hasIcon: false };
      
      if (fit === "Good Fit" || fit === "Good") {
        styles = { bg: "#B2DDFF", border: "#B2DDFF", color: "#175CD3", hasIcon: false };
      } else if (fit === "Strong Fit" || fit === "Excellent") {
        styles = { bg: "#ECFDF3", border: "#A6F4C5", color: "#027948", hasIcon: true };
      } else if (fit === "Maybe Fit") {
        styles = { bg: "#F8F9FC", border: "#D5D9EB", color: "#363F72", hasIcon: false };
      } else if (fit === "Bad Fit") {
        styles = { bg: "#FEF3F2", border: "#FECDCA", color: "#B32318", hasIcon: false };
      }
      
      return { label: `Interview: ${fit}`, ...styles };
    }
    
    // AI Interview stage - use "JIA: Fit" prefix
    const fit = jobFit;
    if (!fit) return null;
    
    let styles = { bg: "#F8F9FC", border: "#D5D9EB", color: "#363F72", hasIcon: false };
    
    if (fit === "Good Fit" || fit === "Good") {
      styles = { bg: "#B2DDFF", border: "#B2DDFF", color: "#175CD3", hasIcon: false };
    } else if (fit === "Strong Fit" || fit === "Excellent") {
      styles = { bg: "#ECFDF3", border: "#A6F4C5", color: "#027948", hasIcon: true };
    } else if (fit === "Maybe Fit") {
      styles = { bg: "#F8F9FC", border: "#D5D9EB", color: "#363F72", hasIcon: false };
    } else if (fit === "Bad Fit") {
      styles = { bg: "#FEF3F2", border: "#FECDCA", color: "#B32318", hasIcon: false };
    }
    
    return { label: `JIA: ${fit}`, ...styles };
  };

  const fitInfo = getFitInfo();

  // Get assessed by info
  const getAssessedBy = () => {
    if (!applicationMetadata?.updatedBy) {
      return null; // No assessment yet
    }
    return {
      name: applicationMetadata.updatedBy.name,
      avatar: applicationMetadata.updatedBy.image
    };
  };

  return (
    <div
      style={{
        background: hasPendingInterviewRetakeRequest ? "#FFFAEB" : "white",
        borderRadius: 8,
        padding: "12px",
        border: hasPendingInterviewRetakeRequest ? "1px solid #FEEFC7" : "1px solid #E9EAEB",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer"
      }}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        handleCandidateMenuOpen({ ...candidate, stage });
      }}
    >
      {/* Left side: Label, Avatar, name, email | Right side: Three dots */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        {/* Left side wrapper */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {/* Fit status badge OR Retake Request badge (hide for Waiting for Submission) */}
          {cvStatus !== "Waiting for Submission" && (hasPendingInterviewRetakeRequest || fitInfo) && (
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: 4,
              padding: "4px 8px", 
              borderRadius: 16, 
              background: hasPendingInterviewRetakeRequest ? "#FEEFC7" : fitInfo?.bg,
              border: hasPendingInterviewRetakeRequest ? "1px solid #FEDF89" : `1px solid ${fitInfo?.border}`,
              width: "fit-content"
            }}>
              {!hasPendingInterviewRetakeRequest && fitInfo?.hasIcon && (
                <img
                  src="/temp/star-green.svg"
                  alt="Star"
                  style={{ width: 12, height: 12 }}
                />
              )}
              <span style={{ fontSize: 12, fontWeight: 600, color: hasPendingInterviewRetakeRequest ? "#B54708" : fitInfo?.color }}>
                {hasPendingInterviewRetakeRequest ? "Retake Request" : fitInfo?.label}
              </span>
            </div>
          )}

          {/* Avatar, name, email */}
          <div style={{ display: "flex", gap: 8 }}>
            <img
              src={image}
              alt={name}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#E0E0E0",
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14, color: "#030217" }}>
                {name}
              </div>
              <div style={{ fontSize: 12, color: "#787486", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {email}
              </div>
            </div>
          </div>
        </div>

        {/* Three dots menu */}
        <div style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <img
              src="/temp/more-vertical.svg"
              alt="More options"
              style={{ width: 20, height: 20, transform: "rotate(90deg)" }}
            />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "white",
                border: "1px solid #E9EAEB",
                borderRadius: 8,
                padding: "8px 0",
                minWidth: 200,
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#414651",
                  padding: "8px 12px",
                  cursor: "default"
                }}
              >
                Candidate Menu
              </div>
              <div style={{ height: 1, background: "#E9EAEB" }} />

              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#030217",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectMenuOption();
                }}
              >
                <i className="la la-bolt" style={{ fontSize: 16 }}></i>
                <span>View Analysis by Jia</span>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#030217",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleViewCV();
                }}
              >
                <i className="la la-file-alt" style={{ fontSize: 16 }}></i>
                <span>View CV</span>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#030217",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleViewHistory();
                }}
              >
                <i className="la la-history" style={{ fontSize: 16 }}></i>
                <span>View Application History</span>
              </div>

              <div style={{ height: 1, background: "#E9EAEB" }} />

              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#039855",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleEndorseCandidate({ ...candidate, stage });
                  setMenuOpen(!menuOpen);
                }}
              >
                <i className="la la-user-check" style={{ fontSize: 16 }}></i>
                <span>Endorse Candidate</span>
              </div>

              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#B42318",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleDropCandidate({ ...candidate, stage });
                  setMenuOpen(!menuOpen);
                }}
              >
                <i className="la la-user-times" style={{ fontSize: 16 }}></i>
                <span>Drop Candidate</span>
              </div>

              {hasPendingInterviewRetakeRequest && (
                <>
                  <div style={{ height: 1, background: "#E9EAEB" }} />
                  <div
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#DC6803",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRetakeInterview({ ...candidate, stage });
                      setMenuOpen(!menuOpen);
                    }}
                  >
                    <span>Review Retake Request</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "100%", height: 1, background: "#E9EAEB" }} />

      {/* Footer with timestamp on left and assessed by on right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 12, color: "#787486" }}>
          {createdAt ? formatDateToRelativeTime(new Date(createdAt)) : "N/A"}
        </div>
        {getAssessedBy() && (
          <div style={{ fontSize: 12, color: "#787486", display: "flex", alignItems: "center", gap: 4 }}>
            <img 
              src={getAssessedBy()?.avatar} 
              alt={getAssessedBy()?.name}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
            <span>Endorsed by {getAssessedBy()?.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicantCards({
  candidates,
  stage,
  handleCandidateMenuOpen,
  handleCandidateCVOpen,
  handleEndorseCandidate,
  handleDropCandidate,
  handleCandidateHistoryOpen,
  handleRetakeInterview,
  emptyMessage = "No candidates in this section"
}: ApplicantCardsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {candidates && candidates.length > 0 ? (
        candidates.map((candidate: any, idx: number) => (
          <ApplicantCardItem
            key={idx}
            candidate={candidate}
            stage={stage}
            handleCandidateMenuOpen={handleCandidateMenuOpen}
            handleCandidateCVOpen={handleCandidateCVOpen}
            handleEndorseCandidate={handleEndorseCandidate}
            handleDropCandidate={handleDropCandidate}
            handleCandidateHistoryOpen={handleCandidateHistoryOpen}
            handleRetakeInterview={handleRetakeInterview}
          />
        ))
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#787486",
            fontSize: 14
          }}
        >
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
