"use client";
import React from 'react';
import DropDownOption from '../DropDownOption';
import AskingSalaryInput from './AskingSalaryInput';
import DeleteQuestionButton from '../DeleteQuestionButton';

const AskingSalaryCard: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => {
  const [answerType, setAnswerType] = React.useState<string>('range');

  const [minSalary, setMinSalary] = React.useState<string>('');
  const [maxSalary, setMaxSalary] = React.useState<string>('');
  const [minCurrency, setMinCurrency] = React.useState<string>('PHP');
  const [maxCurrency, setMaxCurrency] = React.useState<string>('PHP');

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
              onChange={setMinSalary}
              currency={minCurrency}
              onCurrencyChange={setMinCurrency}
            />
          </div>
          <div>
            <AskingSalaryInput
              label="Maximum"
              value={maxSalary}
              onChange={setMaxSalary}
              currency={maxCurrency}
              onCurrencyChange={setMaxCurrency}
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
