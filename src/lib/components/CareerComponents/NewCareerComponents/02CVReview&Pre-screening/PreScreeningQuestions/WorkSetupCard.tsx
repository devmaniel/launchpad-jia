"use client";
import React from 'react';
import DropDownOption from '../DropDownOption';
import AddQuestionTextFieldInput from '../AddQuestionTextFieldInput';
import AddOptionButton from '../AddOptionButton';
import DeleteQuestionButton from '../DeleteQuestionButton';

interface WorkSetupCardProps {
  onDelete?: () => void;
  options?: string[];
  onOptionsChange?: (options: string[]) => void;
}

const WorkSetupCard: React.FC<WorkSetupCardProps> = ({ 
  onDelete,
  options: externalOptions,
  onOptionsChange
}) => {
  const [selectedType, setSelectedType] = React.useState<string>('dropdown');
  const defaultOptions = [
    'At most 1-2x a week',
    'At most 3-4x a week',
    'Open to fully onsite work',
    'Only open to fully remote work',
  ];
  const [localOptions, setLocalOptions] = React.useState<string[]>(externalOptions || defaultOptions);

  // Sync with external options when they change
  React.useEffect(() => {
    if (externalOptions) {
      setLocalOptions(externalOptions);
    }
  }, [externalOptions]);

  const updateOptions = (newOptions: string[]) => {
    setLocalOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const addOption = () => {
    updateOptions([...localOptions, '']);
  };

  const updateOption = (idx: number, val: string) => {
    updateOptions(localOptions.map((o, i) => (i === idx ? val : o)));
  };

  const deleteOption = (idx: number) => {
    updateOptions(localOptions.filter((_, i) => i !== idx));
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
            {localOptions.map((opt, idx) => (
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

