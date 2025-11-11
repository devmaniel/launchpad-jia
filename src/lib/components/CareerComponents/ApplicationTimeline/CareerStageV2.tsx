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

  console.log("🎭 CareerStageV2 received timelineStages:", timelineStages);
  console.log("🎭 Timeline stages keys:", Object.keys(timelineStages || {}));

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
    console.log(`  🔍 Getting substages for "${stage}":`, stageData.substages);
    
    // If substages are defined in the data, use them
    if (stageData.substages && stageData.substages.length > 0) {
      // For stages with single substage, show all candidates in one group
      if (stageData.substages.length === 1) {
        return [
          { title: stageData.substages[0], candidates: stageData.candidates || [] }
        ];
      }
      
      // For stages with multiple substages, we need to filter candidates
      // Based on their status or other properties
      // For now, we'll distribute evenly or show all in each substage
      return stageData.substages.map((substage: string, index: number) => {
        // Try to intelligently filter candidates based on substage name and candidate status
        let candidates = [];
        
        if (substage.toLowerCase().includes("waiting") || substage.toLowerCase().includes("pending")) {
          // First substage usually contains waiting/pending candidates
          if (index === 0) {
            candidates = stageData.candidates?.filter((c: any) => 
              !c.completed && !c.inReview
            ) || [];
          }
        } else if (substage.toLowerCase().includes("review")) {
          // Last substage usually contains candidates in review
          candidates = stageData.candidates?.filter((c: any) => 
            c.completed || c.inReview || c.status?.toLowerCase().includes("review")
          ) || [];
        } else if (index === 0) {
          // First substage gets candidates that don't have special status
          candidates = stageData.candidates?.filter((c: any) => 
            !c.completed && !c.inReview
          ) || [];
        } else {
          // Middle substages get remaining candidates
          candidates = stageData.candidates?.filter((c: any) => 
            c.status?.toLowerCase().includes(substage.toLowerCase())
          ) || [];
        }
        
        // If no filtering logic matched, distribute candidates
        if (candidates.length === 0 && index === 0) {
          candidates = stageData.candidates || [];
        }
        
        return { title: substage, candidates };
      });
    }
    
    // Fallback to default single sub-section with all candidates
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