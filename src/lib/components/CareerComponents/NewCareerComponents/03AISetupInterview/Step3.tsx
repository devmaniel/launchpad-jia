"use client";
import React from "react";
import AIInterviewSettings from "./AIInterviewSettings";
import AIInterviewQuestions from "./AIInterviewQuestions";
import TipsContainer from "../TipsContainer";

const AISetupInterviewPage: React.FC<{ onQuestionsCountChange?: (n: number) => void }> = ({ onQuestionsCountChange }) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1560px",
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          gap: 16,
          alignItems: "flex-start",
          marginTop: 16,
        }}
      >
        <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: 24 }}>
          <AIInterviewSettings />
          <AIInterviewQuestions onTotalCountChange={onQuestionsCountChange} />
        </div>

        <TipsContainer
          items={[
            { title: "Add a Secret Prompt", text: " to fine-tune how Jia scores and evaluates the interview responses." },
            { title: "Use \"Generate Questions\"", text: " to quickly create tailored interview questions, then refine or mix them with your own for balanced results." },
          ]}
        />
      </div>
    </div>
  );
};

export default AISetupInterviewPage;

