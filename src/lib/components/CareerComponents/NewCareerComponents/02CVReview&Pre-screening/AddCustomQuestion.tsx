"use client";
import React from 'react';
import DropDownOption from './DropDownOption';
import AddQuestionTextFieldInput from './AddQuestionTextFieldInput';
import AddOptionButton from './AddOptionButton';
import DeleteQuestionButton from './DeleteQuestionButton';
import NumericRangeInput from './PreScreeningQuestions/NumericRangeInput';

type Props = {
  onDelete?: () => void;
};

const AddCustomQuestion: React.FC<Props> = ({ onDelete }) => {
  const [question, setQuestion] = React.useState<string>("");
  const [answerType, setAnswerType] = React.useState<string>("dropdown");
  const [options, setOptions] = React.useState<string[]>(["Option 1"]);
  const [minValue, setMinValue] = React.useState<string>("");
  const [maxValue, setMaxValue] = React.useState<string>("");

  const addOption = () => setOptions((prev) => [...prev, ``]);
  const updateOption = (idx: number, val: string) => setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));
  const deleteOption = (idx: number) => setOptions((prev) => prev.filter((_, i) => i !== idx));

  const showOptions = answerType === 'dropdown' || answerType === 'checkboxes';

  React.useEffect(() => {
    if (answerType !== 'range') {
      setMinValue("");
      setMaxValue("");
    }
  }, [answerType]);

  return (
    <div style={{ position: 'relative', border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9FAFB', padding: '12px 16px', borderBottom: '1px solid #E5E7EB', gap: 12 }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Write your question..."
          style={{ flex: 1, height: 40, boxSizing: 'border-box', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', outline: 'none', background: '#fff', color: '#111827', fontWeight: 500 }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 232, height: 40 }}>
            <DropDownOption
              key={`selector-${answerType}`}
              value={answerType}
              onChange={(val) => setAnswerType(val)}
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
                onMinChange={setMinValue}
                onMaxChange={setMaxValue}
              />
            )}
            {showOptions && options.map((opt, idx) => (
              <AddQuestionTextFieldInput
                key={idx}
                index={idx + 1}
                value={opt}
                onChange={(val) => updateOption(idx, val)}
                onDelete={() => deleteOption(idx)}
              />
            ))}
            {showOptions && <AddOptionButton onClick={addOption} />}
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