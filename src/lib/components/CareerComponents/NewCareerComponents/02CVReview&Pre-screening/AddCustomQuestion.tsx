"use client";
import React from 'react';
import DropDownOption from './DropDownOption';
import AddQuestionTextFieldInput from './AddQuestionTextFieldInput';
import AddOptionButton from './AddOptionButton';
import DeleteQuestionButton from './DeleteQuestionButton';
import NumericRangeInput from './PreScreeningQuestions/NumericRangeInput';
import { CustomQuestion } from './customQuestionTypes';

type Props = {
  data: CustomQuestion;
  onChange: (data: CustomQuestion) => void;
  onDelete?: () => void;
};

const AddCustomQuestion: React.FC<Props> = ({ data, onChange, onDelete }) => {
  const { question, answerType, options = [], minValue = '', maxValue = '' } = data;

  const updateData = (updates: Partial<CustomQuestion>) => {
    onChange({ ...data, ...updates });
  };

  const addOption = () => {
    const newOptions = [...options, ''];
    updateData({ options: newOptions });
  };

  const updateOption = (idx: number, val: string) => {
    const newOptions = options.map((o, i) => (i === idx ? val : o));
    updateData({ options: newOptions });
  };

  const deleteOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    updateData({ options: newOptions });
  };

  const showOptions = answerType === 'dropdown' || answerType === 'checkboxes';
  const showTextPreview = answerType === 'short_answer' || answerType === 'long_answer';

  React.useEffect(() => {
    if (answerType !== 'range' && (minValue || maxValue)) {
      updateData({ minValue: '', maxValue: '' });
    }
    if ((answerType === 'short_answer' || answerType === 'long_answer') && options.length > 0) {
      updateData({ options: [] });
    }
  }, [answerType]);

  return (
    <div style={{ position: 'relative', border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9FAFB', padding: '12px 16px', borderBottom: '1px solid #E5E7EB', gap: 12 }}>
        <input
          value={question}
          onChange={(e) => updateData({ question: e.target.value })}
          onBlur={() => updateData({ question })}
          placeholder="Write your question..."
          style={{ flex: 1, height: 44, boxSizing: 'border-box', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', outline: 'none', background: '#fff', color: '#111827', fontWeight: 500 }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 232, height: 40 }}>
            <DropDownOption
              key={`selector-${answerType}`}
              value={answerType}
              onChange={(val) => updateData({ answerType: val as CustomQuestion['answerType'] })}
              placeholder="Select answer type"
              containerStyle={{ width: '100%', height: '100%' }}
              animated={false}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', columnGap: 8 }}>
          <div key={answerType} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {answerType === 'range' && (
              <NumericRangeInput
                minValue={minValue}
                maxValue={maxValue}
                onMinChange={(val) => updateData({ minValue: val })}
                onMaxChange={(val) => updateData({ maxValue: val })}
              />
            )}
            
            {/* Show options only for dropdown and checkboxes */}
            {showOptions && (
              <>
                {options.map((opt, idx) => (
                  <AddQuestionTextFieldInput
                    key={idx}
                    index={idx + 1}
                    value={opt}
                    onChange={(val) => updateOption(idx, val)}
                    onDelete={() => deleteOption(idx)}
                    isCheckbox={answerType === 'checkboxes'}
                  />
                ))}
                <AddOptionButton onClick={addOption} />
              </>
            )}
            
            {/* Show text preview only for short/long answer */}
            {showTextPreview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                  <div style={{ flex: 1, display: 'flex', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                    <input
                      placeholder={answerType === 'short_answer' ? "Short answer text" : "Long answer text"}
                      style={{ flex: 1, padding: '10px 12px', color: '#111827', fontWeight: 500, outline: 'none', border: 'none' }}
                      disabled
                    />
                  </div>
                  <div style={{ width: 36 }} /> {/* Spacer for delete button */}
                </div>
              </div>
            )}
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

export default AddCustomQuestion;