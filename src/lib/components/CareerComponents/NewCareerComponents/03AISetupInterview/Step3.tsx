"use client";
import React from "react";
import AIInterviewSettings from "./AIInterviewSettings";
import AIInterviewQuestions from "./AIInterviewQuestions";
import TipsContainer from "../TipsContainer";

type AISetupInterviewPageProps = {
  onQuestionsCountChange?: (n: number) => void;
  onQuestionsChange?: (questions: any[]) => void;
  aiInterviewSecretPrompt: string;
  setAiInterviewSecretPrompt: (value: string) => void;
  aiInterviewScreeningSetting: string;
  setAiInterviewScreeningSetting: (value: string) => void;
  aiInterviewRequireVideo: boolean;
  setAiInterviewRequireVideo: (value: boolean) => void;
  // Career data for AI question generation
  jobTitle?: string;
  jobDescription?: string;
  employmentType?: string;
  workSetup?: string;
};

const AISetupInterviewPage: React.FC<AISetupInterviewPageProps> = ({ 
  onQuestionsCountChange,
  onQuestionsChange,
  aiInterviewSecretPrompt,
  setAiInterviewSecretPrompt,
  aiInterviewScreeningSetting,
  setAiInterviewScreeningSetting,
  aiInterviewRequireVideo,
  setAiInterviewRequireVideo,
  jobTitle,
  jobDescription,
  employmentType,
  workSetup,
}) => {
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
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <AIInterviewSettings 
            secretPrompt={aiInterviewSecretPrompt}
            setSecretPrompt={setAiInterviewSecretPrompt}
            screeningSetting={aiInterviewScreeningSetting}
            setScreeningSetting={setAiInterviewScreeningSetting}
            requireVideo={aiInterviewRequireVideo}
            setRequireVideo={setAiInterviewRequireVideo}
          />
          <AIInterviewQuestions 
            onTotalCountChange={onQuestionsCountChange}
            onQuestionsChange={onQuestionsChange}
            jobTitle={jobTitle}
            jobDescription={jobDescription}
            employmentType={employmentType}
            workSetup={workSetup}
          />
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

