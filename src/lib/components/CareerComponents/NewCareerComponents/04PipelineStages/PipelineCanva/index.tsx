"use client";

import React, { useEffect, useRef, useState } from 'react';
import CVScreeningCard from './CVScreeningCard';
import AIInterviewCard from './AIInterviewCard';
import FinalHumanInterviewCard from './FinalHumanInterviewCard';
import JobOfferCard from './JobOfferCard';
import AddCustomStageButton from './AddCustomStageButton';
import AddCustomStageContainer from './AddCustomStageContainer';

interface PipelineCanvaProps {
  pipelineStages?: any[];
  setPipelineStages?: (stages: any[]) => void;
}

export default function PipelineCanva({ pipelineStages, setPipelineStages }: PipelineCanvaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(360);
  const [customStages, setCustomStages] = useState<{ id: number; animateFrom: 'left' | 'right'; icon: string; title: string; substages: string[] }[]>([]);
  const [draggedStageId, setDraggedStageId] = useState<number | null>(null);
  const isInitializing = useRef<boolean>(false);
  const lastSyncedPipelineRef = useRef<string>('');

  // Initialize custom stages from pipelineStages prop
  useEffect(() => {
    if (isInitializing.current) return;
    
    const pipelineStr = JSON.stringify(pipelineStages);
    
    // Skip if this is the same pipeline we just synced
    if (pipelineStr === lastSyncedPipelineRef.current) return;
    
    isInitializing.current = true;
    
    if (pipelineStages && pipelineStages.length > 0) {
      const customOnly = pipelineStages.filter((stage: any) => !stage.isCore);
      const mapped = customOnly.map((stage: any, index: number) => ({
        id: stage.id || Date.now() + index,
        animateFrom: 'right' as 'left' | 'right',
        icon: stage.icon || '/temp/personality-test.svg',
        title: stage.title || '',
        substages: stage.substages || []
      }));
      setCustomStages(mapped);
    } else if (pipelineStages && pipelineStages.length === 4) {
      // If pipelineStages has exactly 4 stages (the core stages), clear custom stages
      setCustomStages([]);
    }
    
    setTimeout(() => {
      isInitializing.current = false;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pipelineStages)]);

  useEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const available = Math.max(360, Math.floor(window.innerHeight - rect.top - 24));
      setRowHeight(available);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Sync custom stages back to pipelineStages
  useEffect(() => {
    if (!setPipelineStages || isInitializing.current) return;

    const coreStages = [
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
    ];

    // Include all custom stages, even if they have no title or substages
    const customStagesData = customStages.map(stage => ({
      id: stage.id,
      icon: stage.icon,
      title: stage.title || 'Custom Stage',
      substages: stage.substages,
      isCore: false,
    }));

    const endStages = [
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

    const allStages = [...coreStages, ...customStagesData, ...endStages];
    const allStagesStr = JSON.stringify(allStages);
    
    // Only update if the pipeline has actually changed
    if (allStagesStr !== lastSyncedPipelineRef.current) {
      lastSyncedPipelineRef.current = allStagesStr;
      setPipelineStages(allStages);
    }
  }, [customStages, setPipelineStages]);

  const handleAddCustomStage = (position: 'left' | 'right') => {
    const newStageId = Date.now();
    const newStage = { 
      id: newStageId, 
      animateFrom: position, // right button → slide from right, left button → slide from left
      icon: '/temp/personality-test.svg',
      title: '',
      substages: []
    };
    
    if (position === 'left') {
      setCustomStages([newStage, ...customStages]);
    } else {
      setCustomStages([...customStages, newStage]);
    }
  };

  const handleDeleteCustomStage = (stageId: number) => {
    setCustomStages(customStages.filter(stage => stage.id !== stageId));
  };

  const handleDragStart = (stageId: number) => {
    setDraggedStageId(stageId);
  };

  const handleDragEnd = () => {
    setDraggedStageId(null);
  };

  const handleDragOver = (e: React.DragEvent, targetStageId: number) => {
    e.preventDefault();
  };

  const handleDrop = (targetStageId: number) => {
    if (draggedStageId === null || draggedStageId === targetStageId) {
      setDraggedStageId(null);
      return;
    }

    const draggedIndex = customStages.findIndex(stage => stage.id === draggedStageId);
    const targetIndex = customStages.findIndex(stage => stage.id === targetStageId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedStageId(null);
      return;
    }

    // Reorder the array
    const newCustomStages = [...customStages];
    const [draggedStage] = newCustomStages.splice(draggedIndex, 1);
    newCustomStages.splice(targetIndex, 0, draggedStage);

    setCustomStages(newCustomStages);
    setDraggedStageId(null);
  };

  const handleStageUpdate = (stageId: number, data: { icon: string; title: string; substages: string[] }) => {
    setCustomStages(prevStages => 
      prevStages.map(stage => 
        stage.id === stageId 
          ? { ...stage, icon: data.icon, title: data.title, substages: data.substages }
          : stage
      )
    );
  };

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar-x {
          scrollbar-width: thin;
          scrollbar-color: #E9EAEB transparent;
        }
        .custom-scrollbar-x::-webkit-scrollbar {
          height: 20px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb {
          background-color: #E9EAEB;
          border-radius: 10px;
          border: 6px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar-x::-webkit-scrollbar-corner {
          background: transparent;
        }
      `,
        }}
      />
      <div 
        className="custom-scrollbar-x"
        style={{ 
          width: "100%", 
          overflowX: "auto", 
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", gap: 16, height: rowHeight }}>
        {/* CV Screening - Always first */}
        <div style={{ width: 352, minWidth: 352, height: "100%" }}>
          <CVScreeningCard />
        </div>
        
        {/* AI Interview - Always second */}
        <div style={{ width: 352, minWidth: 352, height: "100%" }}>
          <AIInterviewCard />
        </div>
        
        {/* Conditional Button Rendering */}
        {customStages.length === 0 ? (
          /* Single button when no custom stages */
          <div style={{ height: "100%", minWidth: 40 }}>
            <AddCustomStageButton 
              onClick={() => handleAddCustomStage('right')} 
              position="right"
            />
          </div>
        ) : (
          <>
            {/* Left Add Button - adds to the start of custom stages */}
            <div style={{ height: "100%", minWidth: 40 }}>
              <AddCustomStageButton 
                onClick={() => handleAddCustomStage('left')} 
                position="left"
              />
            </div>
            
            {/* Custom Stages - Dynamic with slide animation */}
            {customStages.map((stage, index) => (
              <div 
                key={stage.id}
                style={{ 
                  width: 352,
                  minWidth: 352,
                  height: "100%",
                  overflow: "hidden",
                  animation: stage.animateFrom === 'left' ? "slideInFromLeft 0.3s ease-in-out" : "slideInFromRight 0.3s ease-in-out",
                }}
              >
                <AddCustomStageContainer 
                  stageId={stage.id}
                  onDelete={handleDeleteCustomStage}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={draggedStageId === stage.id}
                  initialIcon={stage.icon}
                  initialTitle={stage.title}
                  initialSubstages={stage.substages}
                  onStageUpdate={handleStageUpdate}
                />
              </div>
            ))}
            
            {/* Right Add Button - adds to the end of custom stages */}
            <div style={{ height: "100%", minWidth: 40 }}>
              <AddCustomStageButton 
                onClick={() => handleAddCustomStage('right')} 
                position="right"
              />
            </div>
          </>
        )}
        
        {/* Final Human Interview - Always second-to-last */}
        <div style={{ width: 352, minWidth: 352, height: "100%" }}>
          <FinalHumanInterviewCard />
        </div>
        
        {/* Job Offer - Always last */}
        <div style={{ width: 352, minWidth: 352, height: "100%" }}>
          <JobOfferCard />
        </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
