"use client";
import React from 'react';

import { Question } from './types';
import { suggestions } from './constants';
import NoticePeriodCard from './NoticePeriodCard';
import WorkSetupCard from './WorkSetupCard';
import AskingSalaryCard from './AskingSalaryCard';
import SuggestionsList from './SuggestionsList';
import AddCustomQuestionButton from '../AddCustomQuestionButton';
import AddCustomQuestion from '../AddCustomQuestion';

interface PreScreeningQuestionsProps {
  preScreeningQuestions: Question[];
  setPreScreeningQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const PreScreeningQuestions = ({
  preScreeningQuestions,
  setPreScreeningQuestions,
}: PreScreeningQuestionsProps) => {
  const [selectedType, setSelectedType] = React.useState<string>('dropdown');
  const [customQuestions, setCustomQuestions] = React.useState<Array<{ id: string }>>([]);
  const addSuggestion = (q: Question) => {
    setPreScreeningQuestions((prev) => {
      if (prev.some((x) => x.id === q.id)) return prev;
      return [...prev, q];
    });
  };

  const addCustom = () => {
    const id = `custom-${Date.now()}`;
    setCustomQuestions((prev) => [...prev, { id }]);
  };

  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDraggingIndex(index);
    const rowEl = (e.currentTarget as HTMLElement).parentElement as HTMLElement | null;
    if (rowEl) {
      try {
        e.dataTransfer.setDragImage(rowEl, 20, 20);
      } catch {}
    }
  };

  const handleDragOverRow = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overIndex !== idx) setOverIndex(idx);
  };

  const handleDropOnItem = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (Number.isNaN(fromIndex) || fromIndex === dropIndex) return;
    setPreScreeningQuestions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    setDraggingIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="layered-card-middle">
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, color: '#181D27', fontWeight: 700, padding: '8px 0px 0px 12px' }}>
            2. Pre-Screening Questions <span style={{ color: '#6B7280', fontWeight: 500 }}>(optional)</span>
          </span>
          <span style={{ display: 'inline-flex', marginTop: 10, border: "1px solid #D5D9EB", alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: '#F3F4F6', color: '#363F72', fontSize: 12, fontWeight: 600 }}>
            {preScreeningQuestions.length + customQuestions.length}
          </span>
        </div>
        <AddCustomQuestionButton onClick={addCustom} style={{ margin: '8px 20px' }} />
      </div>

      <div className="layered-card-content" style={{ gap: 8 }}>
        {preScreeningQuestions.length + customQuestions.length === 0 && (
          <div style={{ color: '#6B7280', fontSize: 16, fontWeight:500 }}>No pre-screening questions added yet.</div>
        )}

        {preScreeningQuestions.length + customQuestions.length === 0 && (
          <hr style={{ borderColor: '#EAECF5', borderWidth: 2, width: '100%', margin: '8px 0' }} />
        )}

        {customQuestions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {customQuestions.map((c) => (
              <AddCustomQuestion key={c.id} onDelete={() => setCustomQuestions((prev) => prev.filter((x) => x.id !== c.id))} />)
            )}
          </div>
        )}
        {customQuestions.length > 0 && (
          <hr style={{ borderColor: '#EAECF5', borderWidth: 2, height: 2, width: '100%', marginTop: 30 }} />
        )}

        {(() => {
          const addedIds = new Set(preScreeningQuestions.map((q) => q.id));
          const hasAnyBuiltIn = preScreeningQuestions.length > 0;
          return (
            <>
              {hasAnyBuiltIn && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {preScreeningQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      onDragOver={(e) => handleDragOverRow(e, idx)}
                      onDrop={(e) => handleDropOnItem(e, idx)}
                      onDragLeave={() => setOverIndex((curr) => (curr === idx ? null : curr))}
                      style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: 8,
                        transform: draggingIndex === idx ? 'translateY(-2px) scale(1.01)' : 'none',
                        opacity: draggingIndex === idx ? 0.98 : 1,
                        boxShadow:
                          draggingIndex === idx
                            ? '0 14px 30px rgba(0,0,0,0.12)'
                            : overIndex === idx
                            ? '0 6px 18px rgba(0,0,0,0.08)'
                            : 'none',
                        transition: 'transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease',
                        borderRadius: 12,
                        background: overIndex === idx ? 'rgba(249,250,251,0.65)' : 'transparent',
                      }}
                    >
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragEnd={handleDragEnd}
                        style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: draggingIndex === idx ? 'grabbing' : 'grab', userSelect: 'none' }}
                        title="Drag to reorder"
                      >
                        <img src="/icons/drag-indicator.svg" alt="drag" style={{ width: 20, height: 20, opacity: 0.8 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        {q.id === 'notice-period' && (
                          <NoticePeriodCard onDelete={() => setPreScreeningQuestions((prev) => prev.filter((x) => x.id !== 'notice-period'))} />
                        )}
                        {q.id === 'work-setup' && (
                          <WorkSetupCard onDelete={() => setPreScreeningQuestions((prev) => prev.filter((x) => x.id !== 'work-setup'))} />
                        )}
                        {q.id === 'asking-salary' && (
                          <AskingSalaryCard onDelete={() => setPreScreeningQuestions((prev) => prev.filter((x) => x.id !== 'asking-salary'))} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {hasAnyBuiltIn && (
                <hr style={{ borderColor: '#EAECF5', borderWidth: 1, height: 2, width: '100%' }} />
              )}
              <SuggestionsList suggestions={suggestions} staticAddedIds={addedIds} onAdd={addSuggestion} />
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default PreScreeningQuestions;


