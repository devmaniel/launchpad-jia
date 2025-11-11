"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface PipelineTemplate {
  id: string;
  jobTitle: string;
  description: string;
  customStages: Array<{
    icon: string;
    title: string;
    substages: string[];
    isCore: boolean;
  }>;
}

const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  {
    id: "junior-java-dev",
    jobTitle: "Junior Developer - Java",
    description: "Basic screening with coding assessment and technical interview",
    customStages: [
      {
        icon: "/temp/coding-test.svg",
        title: "Coding Test",
        substages: ["Waiting for Test", "Test In Progress", "For Review"],
        isCore: false,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Technical Interview",
        substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
        isCore: false,
      },
    ],
  },
  {
    id: "fullstack-engineer",
    jobTitle: "Full Stack Engineer",
    description: "Comprehensive assessment with technical and system design rounds",
    customStages: [
      {
        icon: "/temp/coding-test.svg",
        title: "Technical Assessment",
        substages: ["Waiting for Test", "Test In Progress", "For Review"],
        isCore: false,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "System Design Round",
        substages: ["Waiting for Schedule", "In Progress", "For Review"],
        isCore: false,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Team Fit Interview",
        substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"],
        isCore: false,
      },
    ],
  },
  {
    id: "senior-software-engineer",
    jobTitle: "Senior Software Engineer",
    description: "In-depth evaluation with multiple technical rounds and architecture review",
    customStages: [
      {
        icon: "/temp/coding-test.svg",
        title: "Advanced Coding Challenge",
        substages: ["Waiting for Test", "Test In Progress", "For Review"],
        isCore: false,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Architecture Review",
        substages: ["Waiting for Schedule", "In Progress", "For Review"],
        isCore: false,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Technical Deep Dive",
        substages: ["Waiting for Schedule", "In Progress", "For Review"],
        isCore: false,
      },
      {
        icon: "/temp/user-temp.svg",
        title: "Leadership Assessment",
        substages: ["Waiting for Schedule", "In Progress", "For Review"],
        isCore: false,
      },
    ],
  },
];

interface Props {
  onSelect: (template: PipelineTemplate) => void;
  onCancel: () => void;
  hasCustomStages: boolean;
}

export default function CopyPipelineModal({ onSelect, onCancel, hasCustomStages }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleTemplateClick = (template: PipelineTemplate) => {
    setSelectedTemplate(template.id);
    if (hasCustomStages) {
      setShowWarning(true);
    }
  };

  const handleConfirm = () => {
    const template = PIPELINE_TEMPLATES.find(t => t.id === selectedTemplate);
    if (template) {
      onSelect(template);
    }
  };

  const handleApply = () => {
    if (!selectedTemplate) return;
    
    const template = PIPELINE_TEMPLATES.find(t => t.id === selectedTemplate);
    if (template) {
      if (hasCustomStages) {
        setShowWarning(true);
      } else {
        onSelect(template);
      }
    }
  };

  if (!mounted) return null;

  const modalContent = showWarning ? (
      <div
        className="modal show fade-in-bottom"
        style={{
          display: "block",
          background: "rgba(0,0,0,0.45)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 99999,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <div 
            className="modal-content" 
            style={{ 
              overflowY: "auto", 
              height: "fit-content", 
              width: "fit-content", 
              background: "#fff", 
              border: "1.5px solid #E9EAEB", 
              borderRadius: 14, 
              boxShadow: "0 8px 32px rgba(30,32,60,0.18)", 
              padding: "24px" 
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
              <i className="la la-exclamation-triangle" style={{ fontSize: 48, color: "#F79009" }}></i>
              <h3 className="modal-title">Replace Current Custom Stages?</h3>
              <span style={{ fontSize: 14, color: "#717680", maxWidth: "352px" }}>
                You will lose all progress on your current custom pipeline stages. Core stages will remain unchanged. This action cannot be undone.
              </span>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 16, width: "100%" }}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowWarning(false);
                    setSelectedTemplate(null);
                  }}
                  style={{ 
                    display: "flex", 
                    width: "50%", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    textAlign: "center", 
                    gap: 8, 
                    backgroundColor: "#FFFFFF", 
                    borderRadius: "60px", 
                    border: "1px solid #D5D7DA", 
                    cursor: "pointer", 
                    padding: "10px 0px" 
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleConfirm();
                  }}
                  style={{ 
                    display: "flex", 
                    width: "50%", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    textAlign: "center", 
                    gap: 8, 
                    backgroundColor: "#DC6803", 
                    color: "#FFFFFF", 
                    borderRadius: "60px", 
                    border: "1px solid #DC6803", 
                    cursor: "pointer", 
                    padding: "10px 0px" 
                  }}
                >
                  Replace Custom Stages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  ) : (
    <div
      className="modal show fade-in-bottom"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.45)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div 
          className="modal-content" 
          style={{ 
            overflowY: "auto", 
            height: "fit-content", 
            maxHeight: "90vh",
            width: "900px", 
            background: "#fff", 
            border: "1.5px solid #E9EAEB", 
            borderRadius: 14, 
            boxShadow: "0 8px 32px rgba(30,32,60,0.18)", 
            padding: "24px" 
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Copy Pipeline from Template</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#717680" }}>
                Select a pre-defined pipeline template. Core stages (CV Screening, AI Interview, Final Interview, Job Offer) will remain unchanged.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {PIPELINE_TEMPLATES.map((template) => {
                const coreStages = [
                  { icon: "/temp/user-temp.svg", title: "CV Screening", substages: ["Waiting Submission", "For Review"], isCore: true },
                  { icon: "/temp/mic.svg", title: "AI Interview", substages: ["Waiting Interview", "For Review"], isCore: true },
                ];
                const finalCoreStages = [
                  { icon: "/temp/user-temp.svg", title: "Final Human Interview", substages: ["Waiting for Schedule", "Waiting for Interview", "For Review"], isCore: true },
                  { icon: "/temp/user-temp.svg", title: "Job Offer", substages: ["For Final Interview", "Waiting Offer Acceptance", "For Contract Signing", "Hired"], isCore: true },
                ];
                const fullPipeline = [...coreStages, ...template.customStages, ...finalCoreStages];

                return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    style={{
                      padding: "16px",
                      border: selectedTemplate === template.id ? "2px solid #6366F1" : "1px solid #E9EAEB",
                      borderRadius: 12,
                      cursor: "pointer",
                      backgroundColor: selectedTemplate === template.id ? "#F5F5FF" : "#F8F9FC",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#181D27" }}>
                            {template.jobTitle}
                          </h4>
                          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#717680" }}>
                            {template.description}
                          </p>
                        </div>
                        {selectedTemplate === template.id && (
                          <i className="la la-check-circle" style={{ fontSize: 24, color: "#6366F1" }}></i>
                        )}
                      </div>

                      <div style={{ 
                        backgroundColor: "#FFFFFF",
                        borderRadius: 8,
                        padding: "12px",
                        overflowX: "auto"
                      }}>
                        <div style={{
                          display: "flex",
                          gap: 12,
                          width: "max-content",
                          minWidth: "100%"
                        }}>
                          {fullPipeline.map((stage, idx) => (
                            <div
                              key={idx}
                              style={{
                                border: "1px solid #EAECF5",
                                borderRadius: 8,
                                backgroundColor: stage.isCore ? "#F0F1FF" : "#F8F9FC",
                                padding: 12,
                                minWidth: 180,
                                maxWidth: 180,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Image src={stage.icon} alt="" width={16} height={16} />
                                <p style={{ 
                                  margin: 0, 
                                  fontSize: 13, 
                                  fontWeight: 600, 
                                  color: stage.isCore ? "#6366F1" : "#1F2430",
                                  lineHeight: 1.3
                                }}>
                                  {stage.title}
                                </p>
                              </div>
                              {stage.substages && stage.substages.length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {stage.substages.slice(0, 2).map((ss, sidx) => (
                                    <div 
                                      key={sidx} 
                                      style={{
                                        padding: "6px 8px",
                                        borderRadius: 4,
                                        backgroundColor: "#FFFFFF",
                                        border: "1px solid #E9EAEB",
                                        fontSize: 11,
                                        color: "#414651",
                                        lineHeight: 1.2,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                      }}
                                    >
                                      {ss}
                                    </div>
                                  ))}
                                  {stage.substages.length > 2 && (
                                    <div style={{ fontSize: 10, color: "#717680", textAlign: "center" }}>
                                      +{stage.substages.length - 2} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 16, width: "100%" }}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onCancel();
                }}
                style={{ 
                  display: "flex", 
                  width: "50%", 
                  flexDirection: "row", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  textAlign: "center", 
                  gap: 8, 
                  backgroundColor: "#FFFFFF", 
                  borderRadius: "60px", 
                  border: "1px solid #D5D7DA", 
                  cursor: "pointer", 
                  padding: "10px 0px",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleApply();
                }}
                disabled={!selectedTemplate}
                style={{ 
                  display: "flex", 
                  width: "50%", 
                  flexDirection: "row", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  textAlign: "center", 
                  gap: 8, 
                  backgroundColor: selectedTemplate ? "#6366F1" : "#D5D7DA", 
                  color: "#FFFFFF", 
                  borderRadius: "60px", 
                  border: selectedTemplate ? "1px solid #6366F1" : "1px solid #D5D7DA", 
                  cursor: selectedTemplate ? "pointer" : "not-allowed", 
                  padding: "10px 0px",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
