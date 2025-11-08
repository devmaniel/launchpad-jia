"use client";
import React, { useState } from 'react';
import DropDownOption from "../DropDownOption";
import AddQuestionTextFieldInput from '../AddQuestionTextFieldInput';
import AddOptionButton from '../AddOptionButton';
import DeleteQuestionButton from '../DeleteQuestionButton';

const NoticePeriodCard: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => {
  const [answerType, setAnswerType] = useState<string>("dropdown");
  const [options, setOptions] = useState<string[]>([
    'Immediately',
    '< 30 days',
    '> 30 days',
  ]);

  const addOption = () => setOptions((prev) => [...prev, ``]);
  const updateOption = (idx: number, val: string) => setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));
  const deleteOption = (idx: number) => setOptions((prev) => prev.filter((_, i) => i !== idx));
  return (
    <div style={{ position: 'relative', border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9FAFB', padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#181D27' }}>How long is your notice period?</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 232, height: 40 }}>
            <DropDownOption
              value={answerType}
              onChange={setAnswerType}
              placeholder="Dropdown"
              containerStyle={{ width: '100%', height: '100%' }}
              animated={false}
              disabled
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', columnGap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {options.map((opt, idx) => (
              <AddQuestionTextFieldInput
                key={idx}
                index={idx + 1}
                value={opt}
                onChange={(val) => updateOption(idx, val)}
                onDelete={() => deleteOption(idx)}
              />
            ))}
            <AddOptionButton onClick={addOption} />
          </div>
        </div>
        <hr style={{ borderColor: '#EAECF5', borderWidth: 1, width: '100%', marginTop: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DeleteQuestionButton onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoticePeriodCard;

