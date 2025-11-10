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
import { CustomQuestion } from '../customQuestionTypes';

interface PreScreeningQuestionsProps {
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

const PreScreeningQuestions = ({
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
}: PreScreeningQuestionsProps) => {
  // Track the order of all questions (IDs only)
  const [questionOrder, setQuestionOrder] = React.useState<string[]>([]);

  // Unified list combining custom questions and pre-screening questions
  type UnifiedQuestion = 
    | { type: 'custom'; data: CustomQuestion }
    | { type: 'prescreening'; data: Question };

  // Sync questionOrder with actual questions
  React.useEffect(() => {
    const allIds = new Set([
      ...customQuestions.map(q => q.id),
      ...preScreeningQuestions.map(q => q.id)
    ]);
    
    // Remove deleted IDs and add new ones at the end (they'll be moved to top when added)
    setQuestionOrder(prev => {
      const filtered = prev.filter(id => allIds.has(id));
      const newIds = Array.from(allIds).filter(id => !prev.includes(id));
      return [...filtered, ...newIds];
    });
  }, [customQuestions.length, preScreeningQuestions.length]);

  const allQuestions: UnifiedQuestion[] = React.useMemo(() => {
    const customMap = new Map(customQuestions.map(q => [q.id, q]));
    const prescreeningMap = new Map(preScreeningQuestions.map(q => [q.id, q]));
    
    return questionOrder
      .map(id => {
        if (customMap.has(id)) {
          return { type: 'custom' as const, data: customMap.get(id)! };
        } else if (prescreeningMap.has(id)) {
          return { type: 'prescreening' as const, data: prescreeningMap.get(id)! };
        }
        return null;
      })
      .filter((q): q is UnifiedQuestion => q !== null);
  }, [customQuestions, preScreeningQuestions, questionOrder]);

  const addSuggestion = (q: Question) => {
    setPreScreeningQuestions((prev) => {
      if (prev.some((x) => x.id === q.id)) return prev;
      return [...prev, q];
    });
    // Add to top of order
    setQuestionOrder(prev => [q.id, ...prev.filter(id => id !== q.id)]);
  };

  const addCustom = () => {
    const newQuestion: CustomQuestion = {
      id: `custom-${Date.now()}`,
      question: '',
      answerType: 'dropdown',
      options: [''],
    };
    setCustomQuestions((prev) => [...prev, newQuestion]);
    // Add to top of order
    setQuestionOrder(prev => [newQuestion.id, ...prev]);
  };

  const updateCustomQuestion = (id: string, data: CustomQuestion) => {
    setCustomQuestions((prev) => prev.map((q) => (q.id === id ? data : q)));
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
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    
    if (e.clientY > mid) {
      target.style.borderBottom = "2px solid";
      target.style.borderImage = "linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1";
      target.style.borderTop = "none";
    } else {
      target.style.borderTop = "2px solid";
      target.style.borderImage = "linear-gradient(90deg, #9fcaed 0%, #ceb6da 33%, #ebacc9 66%, #fccec0 100%) 1";
      target.style.borderBottom = "none";
    }
  };

  const handleDropOnItem = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.style.borderTop = "none";
    target.style.borderBottom = "none";
    target.style.borderImage = "unset";
    
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (Number.isNaN(fromIndex) || fromIndex === dropIndex) return;
    
    // Calculate insert position based on cursor Y
    const rect = target.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const insertIndex = e.clientY > mid ? dropIndex + 1 : dropIndex;
    
    // Reorder the questionOrder array
    setQuestionOrder(prev => {
      const newOrder = [...prev];
      const [movedId] = newOrder.splice(fromIndex, 1);
      const adjustedIndex = fromIndex < insertIndex ? insertIndex - 1 : insertIndex;
      newOrder.splice(adjustedIndex, 0, movedId);
      return newOrder;
    });

    setDraggingIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget.parentElement as HTMLElement | null;
    if (target) {
      target.style.borderTop = "none";
      target.style.borderBottom = "none";
      target.style.borderImage = "unset";
    }
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
        {allQuestions.length === 0 && (
          <div style={{ color: '#6B7280', fontSize: 16, fontWeight:500 }}>No pre-screening questions added yet.</div>
        )}

        {allQuestions.length === 0 && (
          <hr style={{ borderColor: '#EAECF5', borderWidth: 2, width: '100%', margin: '8px 0' }} />
        )}

        {allQuestions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {allQuestions.map((item, idx) => (
              <div
                key={item.type === 'custom' ? item.data.id : item.data.id}
                onDragOver={(e) => handleDragOverRow(e, idx)}
                onDrop={(e) => handleDropOnItem(e, idx)}
                onDragLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.borderTop = "none";
                  target.style.borderBottom = "none";
                  target.style.borderImage = "unset";
                  setOverIndex((curr) => (curr === idx ? null : curr));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 8,
                  transform: 'none',
                  opacity: draggingIndex === idx ? 0.9 : 1,
                  boxShadow: draggingIndex === idx ? '0 4px 16px rgba(16, 24, 40, 0.12)' : 'none',
                  transition: 'box-shadow 180ms ease, opacity 180ms ease',
                  borderRadius: 12,
                  background: draggingIndex === idx ? '#F9FAFB' : 'transparent',
                  borderTop: 'none',
                  borderBottom: 'none',
                  padding: '2px 0',
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
                  {item.type === 'custom' ? (
                    <AddCustomQuestion
                      data={item.data}
                      onChange={(data) => updateCustomQuestion(item.data.id, data)}
                      onDelete={() => setCustomQuestions((prev) => prev.filter((x) => x.id !== item.data.id))}
                    />
                  ) : (
                    <>
                      {item.data.id === 'notice-period' && (
                        <NoticePeriodCard onDelete={() => setPreScreeningQuestions((prev) => prev.filter((x) => x.id !== 'notice-period'))} />
                      )}
                      {item.data.id === 'work-setup' && (
                        <WorkSetupCard onDelete={() => setPreScreeningQuestions((prev) => prev.filter((x) => x.id !== 'work-setup'))} />
                      )}
                      {item.data.id === 'asking-salary' && (
                        <AskingSalaryCard
                          onDelete={() => setPreScreeningQuestions((prev) => prev.filter((x) => x.id !== 'asking-salary'))}
                          minSalary={askingMinSalary}
                          maxSalary={askingMaxSalary}
                          minCurrency={askingMinCurrency}
                          maxCurrency={askingMaxCurrency}
                          onMinSalaryChange={onAskingMinSalaryChange}
                          onMaxSalaryChange={onAskingMaxSalaryChange}
                          onMinCurrencyChange={onAskingMinCurrencyChange}
                          onMaxCurrencyChange={onAskingMaxCurrencyChange}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {allQuestions.length > 0 && (
          <hr style={{ borderColor: '#EAECF5', borderWidth: 1, height: 2, width: '100%' }} />
        )}

        <SuggestionsList 
          suggestions={suggestions} 
          staticAddedIds={new Set(preScreeningQuestions.map((q) => q.id))} 
          onAdd={addSuggestion} 
        />
      </div>
    </div>
  );
};

export default PreScreeningQuestions;


