"use client";
import React, { useEffect, useMemo, useState } from "react";
import CategoryRow from "./CategoryRow";
import GenerateAllBtn from "./GenerateAllBtn";
import { useGenerateQuestion } from "../hooks/useGenerateQuestion";
import { useGenerateAllQuestions } from "../hooks/useGenerateAllQuestions";

export interface AIInterviewQuestionsProps {
  onTotalCountChange?: (n: number) => void;
  onQuestionsChange?: (questions: any[]) => void;
  jobTitle?: string;
  jobDescription?: string;
  employmentType?: string;
  workSetup?: string;
}

const AIInterviewQuestions: React.FC<AIInterviewQuestionsProps> = ({ 
  onTotalCountChange,
  onQuestionsChange,
  jobTitle = "",
  jobDescription = "",
  employmentType = "",
  workSetup = "",
}) => {
  type Group = {
    id: number;
    title: string;
    questions: { id: string; text: string }[];
    numToAsk: number | null;
  };

  const moveQuestion = (
    draggedId: string,
    fromGroupId: number,
    toGroupId: number,
    insertIndex?: number
  ) => {
    setGroups((prev) => {
      const next = prev.map((g) => ({ ...g, questions: [...g.questions] }));
      const fromIdx = next.findIndex((g) => g.id === fromGroupId);
      const toIdx = next.findIndex((g) => g.id === toGroupId);
      if (fromIdx === -1 || toIdx === -1) return prev;

      const fromQs = next[fromIdx].questions;
      const qIndex = fromQs.findIndex((q) => q.id === draggedId);
      if (qIndex === -1) return prev;
      const [moved] = fromQs.splice(qIndex, 1);

      if (fromGroupId === toGroupId) {
        const toQs = fromQs; // same array now after removal
        const idx = Math.max(0, Math.min(insertIndex ?? toQs.length, toQs.length));
        toQs.splice(idx, 0, moved);
      } else {
        const toQs = next[toIdx].questions;
        const idx = Math.max(0, Math.min(insertIndex ?? toQs.length, toQs.length));
        toQs.splice(idx, 0, moved);
        // clamp numToAsk of from group if it exceeds remaining length
        const fg = next[fromIdx];
        if (fg.numToAsk !== null && fg.numToAsk > fg.questions.length) {
          fg.numToAsk = fg.questions.length;
        }
      }

      return next;
    });
  };

  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      title: "CV Validation / Experience",
      questions: [],
      numToAsk: null,
    },
    {
      id: 2,
      title: "Technical",
      questions: [],
      numToAsk: null,
    },
    {
      id: 3,
      title: "Behavioral",
      questions: [],
      numToAsk: null,
    },
    {
      id: 4,
      title: "Analytical",
      questions: [],
      numToAsk: null,
    },
    {
      id: 5,
      title: "Others",
      questions: [],
      numToAsk: null,
    },
  ]);

  const totalCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.questions.length, 0),
    [groups]
  );

  useEffect(() => {
    if (typeof onTotalCountChange === 'function') {
      onTotalCountChange(totalCount);
    }
    if (typeof onQuestionsChange === 'function') {
      onQuestionsChange(groups);
    }
  }, [totalCount, groups, onTotalCountChange, onQuestionsChange]);

  const reorderWithinGroup = (groupId: number, draggedId: string, overId: string) => {
    setGroups((prev) => {
      const next = prev.map((g) => ({ ...g, questions: [...g.questions] }));
      const gi = next.findIndex((g) => g.id === groupId);
      if (gi === -1) return prev;
      const qs = next[gi].questions;
      const from = qs.findIndex((q) => q.id === draggedId);
      const to = qs.findIndex((q) => q.id === overId);
      if (from === -1 || to === -1 || from === to) return prev;
      const [moved] = qs.splice(from, 1);
      qs.splice(to, 0, moved);
      return next;
    });
  };

  const deleteQuestion = (groupId: number, questionId: string) => {
    setGroups((prev) => prev.map((g) =>
      g.id !== groupId
        ? g
        : { ...g, questions: g.questions.filter((q) => q.id !== questionId), numToAsk: g.numToAsk !== null && g.numToAsk > g.questions.length - 1 ? g.questions.length - 1 : g.numToAsk }
    ));
  };

  const changeNumToAsk = (groupId: number, value: number | null) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      if (value === null) return { ...g, numToAsk: null };
      const clamped = Math.max(0, Math.min(value, g.questions.length));
      return { ...g, numToAsk: clamped };
    }));
  };

  const editQuestion = (groupId: number, questionId: string) => {
    // placeholder: no modal wired here; keep as no-op for static UI
  };

  const { generateQuestion } = useGenerateQuestion();
  const { generateAllQuestions, loading: generateAllLoading, progress } = useGenerateAllQuestions();
  const [loadingCategories, setLoadingCategories] = useState<Set<number>>(new Set());

  const generateForGroup = async (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    if (!jobTitle || !jobDescription) {
      alert("Please fill in job title and description in Step 1 before generating questions.");
      return;
    }

    // Set this category as loading
    setLoadingCategories(prev => new Set(prev).add(groupId));

    try {
      const question = await generateQuestion({
        jobTitle,
        jobDescription,
        employmentType,
        workSetup,
        category: group.title,
      });

      if (question) {
        setGroups((prev) => prev.map((g) =>
          g.id === groupId
            ? { ...g, questions: [...g.questions, { id: `q${Date.now()}`, text: question }] }
            : g
        ));
      }
    } finally {
      // Remove this category from loading
      setLoadingCategories(prev => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    }
  };

  const addManually = (groupId: number) => {
    // insert a blank question which will render as an input in the row
    setGroups((prev) => prev.map((g) =>
      g.id === groupId ? { ...g, questions: [...g.questions, { id: `q${Date.now()}`, text: "" }] } : g
    ));
  };

  const updateQuestionText = (groupId: number, questionId: string, text: string) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        questions: g.questions.map((q) => (q.id === questionId ? { ...q, text } : q)),
      };
    }));
  };

  return (
    <div className="layered-card-middle">
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700, padding: '8px 0px 0px 12px' }}>
            2. AI Interview Questions <span style={{ color: '#6B7280', fontWeight: 500 }}>(optional)</span>
          </span>
          <span style={{ display: 'inline-flex', marginTop: 10, border: "1px solid #D5D9EB", alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: '#F3F4F6', color: '#363F72', fontSize: 12, fontWeight: 600 }}>
            {totalCount}
          </span>
        </div>
        <GenerateAllBtn 
          onClick={async () => {
            if (!jobTitle || !jobDescription) {
              alert("Please fill in job title and description in Step 1 before generating questions.");
              return;
            }

            const categories = groups.map(g => g.title);
            const results = await generateAllQuestions({
              jobTitle,
              jobDescription,
              employmentType,
              workSetup,
              categories,
            });

            if (results) {
              setGroups((prev) => prev.map((g) => {
                const newQuestions = results[g.title];
                if (newQuestions && newQuestions.length > 0) {
                  return {
                    ...g,
                    questions: [...g.questions, ...newQuestions.map(text => ({ id: `q${Date.now()}-${Math.random()}`, text }))],
                  };
                }
                return g;
              }));
            }
          }}
          loading={generateAllLoading}
          progress={progress}
        />
      </div>

      <div className="layered-card-content" style={{ gap: 8 }}>
        {totalCount < 5 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0px' }}>
            <img src="/icons/alert-triangle.svg" alt="alert" style={{ width: 18, height: 18 }} />
            <span style={{ color: '#D92D20', fontWeight: 500, fontSize: 14 }}>Please add at least 5 interview questions.</span>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map((g, idx) => (
            <React.Fragment key={g.id}>
              <CategoryRow
                title={g.title}
                groupId={g.id}
                questions={g.questions}
                numToAsk={g.numToAsk}
                onReorderQuestion={reorderWithinGroup}
                onMoveQuestion={moveQuestion}
                onDeleteQuestion={deleteQuestion}
                onEditQuestion={editQuestion}
                onChangeNumToAsk={changeNumToAsk}
                onGenerate={generateForGroup}
                onAddManually={addManually}
                onUpdateQuestionText={updateQuestionText}
                generateLoading={loadingCategories.has(g.id)}
              />
              {idx < groups.length - 1 && (
                <hr style={{ borderColor: '#EAECF5', borderWidth: 1, width: '100%', margin: '8px 0' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewQuestions;
