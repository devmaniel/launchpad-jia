"use client";

import React, { useEffect, useRef, useState } from 'react';
import CVScreeningCard from './CVScreeningCard';
import AIInterviewCard from './AIInterviewCard';
import FinalHumanInterviewCard from './FinalHumanInterviewCard';
import JobOfferCard from './JobOfferCard';
import AddCustomStageButton from './AddCustomStageButton';

export default function PipelineCanva() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(360);

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

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 16, width: "100%", height: rowHeight }}>
        <div style={{ flex: 1, height: "100%" }}>
          <CVScreeningCard />
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <AIInterviewCard />
        </div>
        <div style={{height: "100%" }}>
          <AddCustomStageButton />
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <FinalHumanInterviewCard />
        </div>
        <div style={{ flex: 1, height: "100%" }}>
          <JobOfferCard />
        </div>
        
      </div>
    </div>
  );
}
