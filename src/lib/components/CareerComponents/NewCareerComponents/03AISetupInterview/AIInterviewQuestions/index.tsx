"use client";
import React, { useEffect, useMemo, useState } from "react";
import CategoryRow from "./CategoryRow";
import AddCustomQuestionButton from "../../02CVReview&Pre-screening/AddCustomQuestionButton";

const AIInterviewQuestions: React.FC<{ onTotalCountChange?: (n: number) => void }> = ({ onTotalCountChange }) => {
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
      questions: [
        { id: "demo-cv-1", text: "Walk me through your most recent role and key responsibilities." },
        { id: "demo-cv-2", text: "Which project are you most proud of and why?" },
        { id: "demo-cv-3", text: "What impact did you deliver in the last 6 months?" },
      ],
      numToAsk: null,
    },
    {
      id: 2,
      title: "Technical",
      questions: [
        { id: "demo-tech-1", text: "Explain a challenging technical problem you solved end‑to‑end." },
        { id: "demo-tech-2", text: "How do you approach debugging performance issues?" },
      ],
      numToAsk: null,
    },
    {
      id: 3,
      title: "Behavioral",
      questions: [
        { id: "demo-beh-1", text: "Tell me about a time you disagreed with a teammate. What did you do?" },
      ],
      numToAsk: null,
    },
    {
      id: 4,
      title: "Analytical",
      questions: [
        { id: "demo-ana-1", text: "Describe how you use data to make a product or engineering decision." },
      ],
      numToAsk: null,
    },
    {
      id: 5,
      title: "Others",
      questions: [
        { id: "demo-oth-1", text: "What motivates you to apply for this role?" },
      ],
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
  }, [totalCount, onTotalCountChange]);

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

  const generateForGroup = (groupId: number) => {
    // placeholder: no generation wiring in this UI version
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
        <AddCustomQuestionButton label="Generate all questions" onClick={() => {}} style={{ background: '#111827' }} iconSrc="/icons/auto_awesome_white.svg" />
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
