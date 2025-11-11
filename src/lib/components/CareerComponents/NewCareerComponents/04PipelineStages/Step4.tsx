"use client";

import React, { useState } from "react";
import Step4Header from "./Step4Header";
import PipelineCanva from "./PipelineCanva/index";
import RestoreConfirmationModal from "./RestoreConfirmationModal";
import CopyPipelineModal from "./CopyPipelineModal";

interface Step4Props {
  pipelineStages?: any[];
  setPipelineStages?: (stages: any[]) => void;
}

// Default core pipeline stages
const DEFAULT_PIPELINE_STAGES = [
  {
    icon: "/temp/user-temp.svg",
    title: "CV Screening",
    substages: ["Waiting Submission", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/mic.svg",
    title: "AI Interview",
    substages: ["Waiting Interview", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Final Human Interview",
    substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
    isCore: true,
  },
  {
    icon: "/temp/user-temp.svg",
    title: "Job Offer",
    substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"],
    isCore: true,
  },
];

export default function Step4({ pipelineStages, setPipelineStages }: Step4Props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const handleRestoreDefault = () => {
    // Check if there are custom stages (non-core stages)
    const hasCustom = pipelineStages ? pipelineStages.some((stage: any) => !stage.isCore) : false;
    
    if (hasCustom) {
      // Show confirmation modal if there are custom stages
      setShowConfirmModal(true);
    } else {
      // Directly restore if no custom stages
      restoreToDefault();
    }
  };

  const restoreToDefault = () => {
    if (setPipelineStages) {
      setPipelineStages(DEFAULT_PIPELINE_STAGES);
    }
    setShowConfirmModal(false);
  };

  const handleCopyFromExisting = () => {
    setShowCopyModal(true);
  };

  const handleApplyTemplate = (template: any) => {
    if (!setPipelineStages) return;

    // Get the first 2 core stages (CV Screening, AI Interview)
    const initialCoreStages = DEFAULT_PIPELINE_STAGES.slice(0, 2);
    
    // Get the last 2 core stages (Final Human Interview, Job Offer)
    const finalCoreStages = DEFAULT_PIPELINE_STAGES.slice(2, 4);
    
    // Combine: [initial core, custom stages from template, final core]
    const newPipeline = [
      ...initialCoreStages,
      ...template.customStages,
      ...finalCoreStages,
    ];

    setPipelineStages(newPipeline);
    setShowCopyModal(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Step4Header 
          onRestoreDefault={handleRestoreDefault} 
          onCopyFromExisting={handleCopyFromExisting}
        />
        <PipelineCanva pipelineStages={pipelineStages} setPipelineStages={setPipelineStages} />
      </div>
      
      {showConfirmModal && (
        <RestoreConfirmationModal
          onConfirm={restoreToDefault}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showCopyModal && (
        <CopyPipelineModal
          onSelect={handleApplyTemplate}
          onCancel={() => setShowCopyModal(false)}
          hasCustomStages={pipelineStages ? pipelineStages.some((stage: any) => !stage.isCore) : false}
        />
      )}
    </div>
  );
}
