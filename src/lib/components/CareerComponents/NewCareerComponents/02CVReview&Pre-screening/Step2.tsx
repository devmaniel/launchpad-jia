"use client";
import React from 'react'
import TipsContainer from "../TipsContainer";
import CVReviewSettings from "./CVReviewSettings";
import PreScreeningQuestions from "./PreScreeningQuestions";
import { Question } from "./PreScreeningQuestions/types";
import { CustomQuestion } from "./customQuestionTypes";

interface Step2Props {
  screeningSetting: string;
  setScreeningSetting: (val: string) => void;
  secretPrompt: string;
  setSecretPrompt: (val: string) => void;
  preScreeningQuestions: Question[];
  setPreScreeningQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  customQuestions: CustomQuestion[];
  setCustomQuestions: React.Dispatch<React.SetStateAction<CustomQuestion[]>>;
  askingMinSalary: string;
  askingMaxSalary: string;
  askingMinCurrency: string;
  askingMaxCurrency: string;
  onAskingMinSalaryChange: (v: string) => void;
  onAskingMaxSalaryChange: (v: string) => void;
  onAskingMinCurrencyChange: (v: string) => void;
  onAskingMaxCurrencyChange: (v: string) => void;
}

 

const Step2 = ({
  screeningSetting,
  setScreeningSetting,
  secretPrompt,
  setSecretPrompt,
  preScreeningQuestions,
  setPreScreeningQuestions,
  customQuestions,
  setCustomQuestions,
  askingMinSalary,
  askingMaxSalary,
  askingMinCurrency,
  askingMaxCurrency,
  onAskingMinSalaryChange,
  onAskingMaxSalaryChange,
  onAskingMinCurrencyChange,
  onAskingMaxCurrencyChange,
}: Step2Props) => {
  const stepTips = [
    {
      title: 'Add a Secret Prompt',
      text: 'Fine-tune how Jia scores and evaluates submitted CVs.'
    },
    {
      title: 'Use Pre-Screening questions',
      text: 'Collect key details like notice period, work setup, or salary expectations.'
    }
  ];
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
          <CVReviewSettings
            screeningSetting={screeningSetting}
            setScreeningSetting={setScreeningSetting}
            secretPrompt={secretPrompt}
            setSecretPrompt={setSecretPrompt}
          />
          <PreScreeningQuestions
            preScreeningQuestions={preScreeningQuestions}
            setPreScreeningQuestions={setPreScreeningQuestions}
            customQuestions={customQuestions}
            setCustomQuestions={setCustomQuestions}
            askingMinSalary={askingMinSalary}
            askingMaxSalary={askingMaxSalary}
            askingMinCurrency={askingMinCurrency}
            askingMaxCurrency={askingMaxCurrency}
            onAskingMinSalaryChange={onAskingMinSalaryChange}
            onAskingMaxSalaryChange={onAskingMaxSalaryChange}
            onAskingMinCurrencyChange={onAskingMinCurrencyChange}
            onAskingMaxCurrencyChange={onAskingMaxCurrencyChange}
          />
        </div>

        <TipsContainer items={stepTips} />
      </div>
    </div>
  )
}

export default Step2;