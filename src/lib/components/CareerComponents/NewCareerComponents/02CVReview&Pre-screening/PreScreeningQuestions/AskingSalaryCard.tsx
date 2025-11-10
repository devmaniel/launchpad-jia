"use client";
import React from 'react';
import DropDownOption from '../DropDownOption';
import AskingSalaryInput from './AskingSalaryInput';
import DeleteQuestionButton from '../DeleteQuestionButton';

type AskingSalaryCardProps = {
  onDelete?: () => void;
  minSalary: string;
  maxSalary: string;
  minCurrency: string;
  maxCurrency: string;
  onMinSalaryChange: (v: string) => void;
  onMaxSalaryChange: (v: string) => void;
  onMinCurrencyChange: (v: string) => void;
  onMaxCurrencyChange: (v: string) => void;
};

const AskingSalaryCard: React.FC<AskingSalaryCardProps> = ({
  onDelete,
  minSalary,
  maxSalary,
  minCurrency,
  maxCurrency,
  onMinSalaryChange,
  onMaxSalaryChange,
  onMinCurrencyChange,
  onMaxCurrencyChange,
}) => {
  const [answerType, setAnswerType] = React.useState<string>('range');

  return (
    <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9FAFB', padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#181D27' }}>How much is your expected monthly salary?</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 232 }}>
            <DropDownOption
              value={answerType}
              onChange={setAnswerType}
              placeholder="Range"
              containerStyle={{ maxWidth: 232 }}
              animated={false}
              disabled
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 12 }}>
          <div>
            <AskingSalaryInput
              label="Minimum"
              value={minSalary}
              onChange={onMinSalaryChange}
              currency={minCurrency}
              onCurrencyChange={onMinCurrencyChange}
            />
          </div>
          <div>
            <AskingSalaryInput
              label="Maximum"
              value={maxSalary}
              onChange={onMaxSalaryChange}
              currency={maxCurrency}
              onCurrencyChange={onMaxCurrencyChange}
            />
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

export default AskingSalaryCard;

