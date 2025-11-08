"use client";
import React from 'react';
import DropDownOption from '../DropDownOption';
import AddQuestionTextFieldInput from '../AddQuestionTextFieldInput';
import AddOptionButton from '../AddOptionButton';
import DeleteQuestionButton from '../DeleteQuestionButton';

const WorkSetupCard: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => {
  const [selectedType, setSelectedType] = React.useState<string>('dropdown');
  const [options, setOptions] = React.useState<string[]>([
    'At most 1-2x a week',
    'At most 3-4x a week',
    'Open to fully onsite work',
    'Only open to fully remote work',
  ]);

  const addOption = () => {
    setOptions((prev) => [...prev, ``]);
  };

  const updateOption = (idx: number, val: string) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));
  };

  const deleteOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };
  return (
    <div style={{ position: 'relative',overflow: 'hidden', border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9FAFB', padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#181D27' }}>How often are you willing to report to the office?</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 232 }}>
            <DropDownOption
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Dropdown"
              containerStyle={{ maxWidth: 232 }}
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

export default WorkSetupCard;

