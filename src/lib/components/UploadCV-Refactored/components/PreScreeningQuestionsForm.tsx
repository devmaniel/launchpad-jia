/**
 * PreScreeningQuestionsForm - Form for answering pre-screening questions
 */

"use client";

import React, { useState } from "react";
import { assetConstants } from "@/lib/utils/constantsV2";
import styles from "../styles/components/PreScreeningQuestionsForm.module.scss";

// Reusable input components
interface SalaryInputProps {
  questionId: string;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

function SalaryInput({ questionId, answers, onAnswerChange }: SalaryInputProps) {
  return (
    <div className={styles.salaryInputs}>
      <div className={styles.salaryField}>
        <label className={styles.salaryLabel}>Minimum Salary</label>
        <div className={styles.inputGroup}>
          <span className={styles.currencyPrefix}>₱</span>
          <input
            type="number"
            className={styles.salaryInput}
            placeholder="0"
            value={
              answers[`${questionId}-min`]
                ? answers[`${questionId}-min`].replace(/[^0-9]/g, "")
                : ""
            }
            onChange={(e) => onAnswerChange(`${questionId}-min`, e.target.value)}
          />
        </div>
      </div>

      <div className={styles.salaryField}>
        <label className={styles.salaryLabel}>Maximum Salary</label>
        <div className={styles.inputGroup}>
          <span className={styles.currencyPrefix}>₱</span>
          <input
            type="number"
            className={styles.salaryInput}
            placeholder="0"
            value={
              answers[`${questionId}-max`]
                ? answers[`${questionId}-max`].replace(/[^0-9]/g, "")
                : ""
            }
            onChange={(e) => onAnswerChange(`${questionId}-max`, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

interface TextInputProps {
  questionId: string;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}

function TextInput({ questionId, value, onAnswerChange }: TextInputProps) {
  return (
    <input
      type="text"
      className={styles.textInput}
      placeholder="Type your answer here"
      value={value}
      onChange={(e) => onAnswerChange(questionId, e.target.value)}
    />
  );
}

interface ShortAnswerInputProps {
  questionId: string;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}

function ShortAnswerInput({ questionId, value, onAnswerChange }: ShortAnswerInputProps) {
  return (
    <input
      type="text"
      className={styles.shortAnswerInput}
      placeholder="Type your answer here"
      value={value}
      onChange={(e) => onAnswerChange(questionId, e.target.value)}
    />
  );
}

interface LongAnswerInputProps {
  questionId: string;
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}

function LongAnswerInput({ questionId, value, onAnswerChange }: LongAnswerInputProps) {
  return (
    <textarea
      className={styles.longAnswerInput}
      placeholder="Type your answer here"
      value={value}
      onChange={(e) => onAnswerChange(questionId, e.target.value)}
      rows={4}
    />
  );
}

interface DropdownInputProps {
  questionId: string;
  options: string[];
  value: string;
  onAnswerChange: (questionId: string, value: string) => void;
}

function DropdownInput({
  questionId,
  options,
  value,
  onAnswerChange,
}: DropdownInputProps) {
  return (
    <div className={styles.selectWrapper}>
      <select
        className={styles.selectInput}
        value={value}
        onChange={(e) => onAnswerChange(questionId, e.target.value)}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      <img
        src={assetConstants.chevron}
        alt="dropdown"
        className={styles.selectIcon}
      />
    </div>
  );
}

interface CheckboxInputProps {
  questionId: string;
  options: string[];
  value: string[];
  onAnswerChange: (questionId: string, value: string[]) => void;
}

function CheckboxInput({
  questionId,
  options,
  value,
  onAnswerChange,
}: CheckboxInputProps) {
  const handleCheckboxChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onAnswerChange(questionId, newValue);
  };

  return (
    <div className={styles.checkboxGroup}>
      {options.map((option, idx) => (
        <label key={idx} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={value.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          />
          <span className={styles.checkboxText}>{option}</span>
        </label>
      ))}
    </div>
  );
}

export interface CustomQuestion {
  id: string;
  question: string;
  answerType: "dropdown" | "text" | "checkbox" | "short-answer" | "long-answer";
  options?: string[];
}

export interface PreScreeningQuestion {
  id: string;
  question: string;
  type: "notice-period" | "work-setup" | "asking-salary";
}

interface PreScreeningQuestionsFormProps {
  customQuestions?: CustomQuestion[];
  preScreeningQuestions?: PreScreeningQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  onChange?: (answers: Record<string, string>) => void;
  onBack?: () => void;
}

export function PreScreeningQuestionsForm({
  customQuestions = [],
  preScreeningQuestions = [],
  onSubmit,
  onChange,
  onBack,
}: PreScreeningQuestionsFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Debug: Log what props we received
  console.log("🔍 PreScreeningQuestionsForm Props:", {
    customQuestions,
    preScreeningQuestions,
  });

  // Helper functions - defined first
  function getQuestionText(q: PreScreeningQuestion): string {
    switch (q.type) {
      case "notice-period":
        return "How long is your notice period?";
      case "work-setup":
        return "Are you open to a hybrid work setup?";
      case "asking-salary":
        return "How much is your expected monthly salary?";
      default:
        return q.question;
    }
  }

  function getQuestionOptions(type: string): string[] {
    switch (type) {
      case "notice-period":
        return ["Immediately", "1 week", "2 weeks", "1 month", "2 months", "3 months"];
      case "work-setup":
        return [
          "At least 1-2x a week",
          "At least 3-4x a week",
          "At least 5x a week",
          "Full remote",
        ];
      default:
        return [];
    }
  }

  // Combine all questions
  const allQuestions = [
    ...preScreeningQuestions.map((q) => {
      const options = getQuestionOptions(q.type);
      console.log(`🔍 PreScreening Question: ${q.id}, type: ${q.type}, options:`, options);
      return {
        id: q.id,
        question: getQuestionText(q),
        type: q.type,
        options: options,
      };
    }),
    ...customQuestions.map((q) => {
      console.log(`🔍 Custom Question: ${q.id}, answerType: ${q.answerType}, options:`, q.options);
      return {
        id: q.id,
        question: q.question,
        type: "custom" as const,
        answerType: q.answerType,
        options: q.options || [],
      };
    }),
  ];

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    const newAnswers = {
      ...answers,
      [questionId]: value,
    };
    setAnswers(newAnswers);
    
    // Notify parent component of changes
    if (onChange) {
      // Convert to Record<string, string> for parent
      const stringAnswers: Record<string, string> = {};
      Object.entries(newAnswers).forEach(([key, val]) => {
        stringAnswers[key] = Array.isArray(val) ? val.join(',') : val;
      });
      onChange(stringAnswers);
    }
  };


  // Debug: Log questions structure
  console.log("🔍 All Questions:", allQuestions);

  return (
    <div className={styles.preScreeningContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Pre-screening</h2>
        <p className={styles.subtitle}>
          Just a few short questions to help your recruiters assess you faster. Takes less
          than a minute.
        </p>
      </div>

      <div className={styles.questionsContainer}>
        {allQuestions.map((question, index) => {
          console.log(`🎨 Rendering question ${index}:`, {
            id: question.id,
            type: question.type,
            question: question.question,
            optionsLength: question.options?.length || 0,
            optionsSample: question.options?.slice(0, 2),
          });

          const renderInput = () => {
            if (question.type === "asking-salary") {
              return (
                <SalaryInput
                  questionId={question.id}
                  answers={answers as Record<string, string>}
                  onAnswerChange={(id, val) => handleAnswerChange(id, val)}
                />
              );
            }

            if (question.type === "custom" && (question as any).answerType === "text") {
              return (
                <TextInput
                  questionId={question.id}
                  value={(answers[question.id] as string) || ""}
                  onAnswerChange={handleAnswerChange}
                />
              );
            }

            if (question.type === "custom" && (question as any).answerType === "short-answer") {
              return (
                <ShortAnswerInput
                  questionId={question.id}
                  value={(answers[question.id] as string) || ""}
                  onAnswerChange={handleAnswerChange}
                />
              );
            }

            if (question.type === "custom" && (question as any).answerType === "long-answer") {
              return (
                <LongAnswerInput
                  questionId={question.id}
                  value={(answers[question.id] as string) || ""}
                  onAnswerChange={handleAnswerChange}
                />
              );
            }

            if (question.type === "custom" && (question as any).answerType === "checkbox") {
              return (
                <CheckboxInput
                  questionId={question.id}
                  options={question.options || []}
                  value={(answers[question.id] as string[]) || []}
                  onAnswerChange={handleAnswerChange}
                />
              );
            }

            return (
              <DropdownInput
                questionId={question.id}
                options={question.options || []}
                value={(answers[question.id] as string) || ""}
                onAnswerChange={(id, val) => handleAnswerChange(id, val)}
              />
            );
          };

          return (
            <div key={question.id} className={styles.gradient}>
              <div className={styles.questionCard}>
                <label className={styles.questionLabel}>{question.question}</label>
                <div style={{backgroundColor: "#fff", padding: 16, borderRadius: 16}}>
                  {renderInput()}
                </div>
                
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
