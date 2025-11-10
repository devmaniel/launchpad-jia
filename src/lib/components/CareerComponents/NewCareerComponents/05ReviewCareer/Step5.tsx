"use client";
import React from 'react';
import Image from 'next/image';
import CVScreeningContainer from './CVScreeningContainer';
import CareerDetailsTeamAccess from './CareerDetails&TeamAccess';
import AIInterviewSetup from './AIInterviewSetup';
import PipeLaneStages from './PipeLaneStages';
import { Question } from "../02CVReview&Pre-screening/PreScreeningQuestions/types";
import { CustomQuestion } from "../02CVReview&Pre-screening/customQuestionTypes";

type Stage = {
  icon: string;
  title: string;
  substages: string[];
};

type Step5Props = {
  screeningSetting: string;
  secretPrompt: string;
  preScreeningQuestions: Question[];
  customQuestions: CustomQuestion[];
  jobTitle: string;
  employmentType: string;
  workSetup: string;
  country: string;
  province: string;
  city: string;
  descriptionHtml: string;
  teamMembers: Array<{ name: string; email: string; avatar?: string; role?: string }>;
  minimumSalary: string;
  maximumSalary: string;
  minimumSalaryCurrency: string;
  maximumSalaryCurrency: string;
  salaryNegotiable: boolean;
  askingMinSalary: string;
  askingMaxSalary: string;
  askingMinCurrency: string;
  askingMaxCurrency: string;
  pipelineStages?: Stage[];
  aiInterviewSecretPrompt: string;
  aiInterviewScreeningSetting: string;
  aiInterviewRequireVideo: boolean;
  onEditCareerDetails?: () => void;
  onEditCVScreening?: () => void;
  onEditAIInterview?: () => void;
  onEditPipelineStages?: () => void;
};

const Step5 = ({
  screeningSetting,
  secretPrompt,
  preScreeningQuestions,
  customQuestions,
  jobTitle,
  employmentType,
  workSetup,
  country,
  province,
  city,
  descriptionHtml,
  teamMembers,
  minimumSalary,
  maximumSalary,
  minimumSalaryCurrency,
  maximumSalaryCurrency,
  salaryNegotiable,
  askingMinSalary,
  askingMaxSalary,
  askingMinCurrency,
  askingMaxCurrency,
  pipelineStages,
  aiInterviewSecretPrompt,
  aiInterviewScreeningSetting,
  aiInterviewRequireVideo,
  onEditCareerDetails,
  onEditCVScreening,
  onEditAIInterview,
  onEditPipelineStages,
}: Step5Props) => {

  return (
    <div style={{ width: "100%", maxWidth: "1560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <CareerDetailsTeamAccess
        onEditClick={onEditCareerDetails}
        jobTitle={jobTitle}
        employmentType={employmentType}
        workSetup={workSetup}
        country={country}
        state={province}
        city={city}
        minimumSalary={minimumSalary}
        maximumSalary={maximumSalary}
        minimumSalaryCurrency={minimumSalaryCurrency}
        maximumSalaryCurrency={maximumSalaryCurrency}
        salaryNegotiable={salaryNegotiable}
        descriptionHtml={descriptionHtml}
        teamAccess={teamMembers}
      />
      <CVScreeningContainer
        screeningSetting={screeningSetting}
        secretPrompt={secretPrompt}
        preScreeningQuestions={preScreeningQuestions}
        customQuestions={customQuestions}
        askingMinSalary={askingMinSalary}
        askingMaxSalary={askingMaxSalary}
        askingMinCurrency={askingMinCurrency}
        askingMaxCurrency={askingMaxCurrency}
        onEditClick={onEditCVScreening}
      />
      <AIInterviewSetup 
        onEditClick={onEditAIInterview}
        aiInterviewSecretPrompt={aiInterviewSecretPrompt}
        aiInterviewScreeningSetting={aiInterviewScreeningSetting}
        aiInterviewRequireVideo={aiInterviewRequireVideo}
      />
      <PipeLaneStages stages={pipelineStages} onEditClick={onEditPipelineStages} />
    </div>
  );
};

export default Step5;