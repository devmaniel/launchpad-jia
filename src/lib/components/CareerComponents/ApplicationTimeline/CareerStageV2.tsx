import { useEffect, useRef, useState } from "react";
import StageContainer from "./StageContainer";
import SubSection from "./SubSection";

export default function CareerStageColumnV2({ 
  timelineStages, 
  handleCandidateMenuOpen, 
  handleCandidateCVOpen, 
  handleDroppedCandidatesOpen, 
  handleEndorseCandidate, 
  handleDropCandidate, 
  dragEndorsedCandidate, 
  handleCandidateHistoryOpen, 
  handleRetakeInterview 
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(600);

  // Calculate dynamic height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const available = Math.max(600, Math.floor(window.innerHeight - rect.top - 24));
      setRowHeight(available);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  // Helper function to get sub-sections for each stage
  const getSubSections = (stage: string, stageData: any) => {
    // CV Screening stage has two sub-sections
    if (stage === "CV Screening") {
      const waitingSubmission = stageData.candidates?.filter((c: any) => 
        c.cvStatus === "Waiting for Submission" || !c.cvFile
      ) || [];
      const forReview = stageData.candidates?.filter((c: any) => 
        c.cvStatus !== "Waiting for Submission" && c.cvFile
      ) || [];

      return [
        { title: "Waiting Submission", candidates: waitingSubmission },
        { title: "For Review", candidates: forReview }
      ];
    }

    // AI Interview stage has two sub-sections
    if (stage === "AI Interview") {
      const waitingInterview = stageData.candidates?.filter((c: any) => 
        c.status === "For Interview" || c.status === "For AI Interview" || !c.aiInterviewCompleted
      ) || [];
      const forReview = stageData.candidates?.filter((c: any) => 
        c.status === "For AI Interview Review" || c.aiInterviewCompleted
      ) || [];

      return [
        { title: "Waiting Interview", candidates: waitingInterview },
        { title: "For Review", candidates: forReview }
      ];
    }

    // Human Interview stage has three sub-sections
    if (stage === "Human Interview") {
      const waitingSchedule = stageData.candidates?.filter((c: any) => 
        c.status === "For Schedule" || !c.humanInterviewScheduled
      ) || [];
      const waitingInterview = stageData.candidates?.filter((c: any) => 
        c.status === "For Human Interview" || (c.humanInterviewScheduled && !c.humanInterviewCompleted)
      ) || [];
      const forReview = stageData.candidates?.filter((c: any) => 
        c.status === "For Human Interview Review" || c.humanInterviewCompleted
      ) || [];

      return [
        { title: "Waiting Schedule", candidates: waitingSchedule },
        { title: "Waiting Interview", candidates: waitingInterview },
        { title: "For Review", candidates: forReview }
      ];
    }

    // Coding Test stage has one sub-section
    if (stage === "Coding Test") {
      return [
        { title: "Coding Test", candidates: stageData.candidates || [] }
      ];
    }

    // Job Offer stage has four sub-sections
    if (stage === "Job Offer") {
      const forFinalReview = stageData.candidates?.filter((c: any) => 
        c.status === "For Final Review"
      ) || [];
      const waitingForAcceptance = stageData.candidates?.filter((c: any) => 
        c.status === "Waiting for Acceptance" || c.status === "Offered"
      ) || [];
      const forContractSigning = stageData.candidates?.filter((c: any) => 
        c.status === "For Contract Signing" || c.status === "Accepted"
      ) || [];
      const hired = stageData.candidates?.filter((c: any) => 
        c.status === "Hired" || c.status === "Contract Signed"
      ) || [];

      return [
        { title: "For Final Review", candidates: forFinalReview },
        { title: "Waiting for Acceptance", candidates: waitingForAcceptance },
        { title: "For Contract Signing", candidates: forContractSigning },
        { title: "Hired", candidates: hired }
      ];
    }

    // Default: single sub-section with all candidates
    return [
      { title: stage, candidates: stageData.candidates || [] }
    ];
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .career-stage-container {
          scrollbar-width: thin;
          scrollbar-color: #E9EAEB transparent;
        }
        .career-stage-container::-webkit-scrollbar {
          height: 20px;
        }
        .career-stage-container::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .career-stage-container::-webkit-scrollbar-thumb {
          background-color: #E9EAEB;
          border-radius: 10px;
          border: 6px solid transparent;
          background-clip: content-box;
        }
        .career-stage-container::-webkit-scrollbar-corner {
          background: transparent;
        }
      `,
        }}
      />
      <div ref={containerRef} className="career-stage-container" style={{ height: rowHeight, display: "flex", gap: 16, overflowX: "auto" }}>
        {Object.keys(timelineStages).map((stage, idx) => {
        const stageData = timelineStages[stage];
        const subSections = getSubSections(stage, stageData);
        const totalCount = stageData.candidates?.length || 0;
        const droppedCount = stageData.droppedCandidates?.length || 0;

        return (
          <div key={idx} style={{ borderRadius: 8, padding: "8px 12px", border: "1px solid #E9EAEB", backgroundColor: "#fff", width: "fit-content", height: "100%"}}>
            <StageContainer
              title={stage}
              totalCount={totalCount}
              droppedCount={droppedCount}
              onDroppedCandidatesClick={() => handleDroppedCandidatesOpen(stage)}
              onDragOver={(e) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLElement;
                const bounding = target.getBoundingClientRect();
                const offset = bounding.y + bounding.height / 2;

                if (e.clientY - offset > 0) {
                  target.style.borderBottom = "3px solid #6941C6";
                  target.style.borderTop = "none";
                } else {
                  target.style.borderTop = "3px solid #6941C6";
                  target.style.borderBottom = "none";
                }
              }}
              onDragLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderTop = "none";
                target.style.borderBottom = "none";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLElement;
                target.style.borderTop = "none";
                target.style.borderBottom = "none";

                const candidateId = e.dataTransfer.getData("candidateId");
                const originStageKey = e.dataTransfer.getData("stageKey");
                if (candidateId && originStageKey && originStageKey !== stage) {
                  dragEndorsedCandidate(candidateId, originStageKey, stage);
                }
              }}
            >
              {/* Sub-sections container */}
              <div style={{ display: "flex", gap: 12, height: "100%"}}>
                {subSections.map((subSection, subIdx) => (
                  <SubSection
                    key={subIdx}
                    title={subSection.title}
                    count={subSection.candidates.length}
                    candidates={subSection.candidates}
                    stage={stage}
                    isSingleSubsection={subSections.length === 1}
                    handleCandidateMenuOpen={handleCandidateMenuOpen}
                    handleCandidateCVOpen={handleCandidateCVOpen}
                    handleEndorseCandidate={handleEndorseCandidate}
                    handleDropCandidate={handleDropCandidate}
                    handleCandidateHistoryOpen={handleCandidateHistoryOpen}
                    handleRetakeInterview={handleRetakeInterview}
                    emptyMessage={`No candidates in ${subSection.title.toLowerCase()}`}
                  />
                ))}
              </div>

              
            </StageContainer>
          </div>
        );
      })}
      </div>
    </>
  );
}