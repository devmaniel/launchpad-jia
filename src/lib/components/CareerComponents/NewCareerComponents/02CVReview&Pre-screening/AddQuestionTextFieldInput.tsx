"use client";
import React from 'react';

type Props = {
  index: number;
  value: string;
  onChange: (val: string) => void;
  onDelete: () => void;
};

const AddQuestionTextFieldInput: React.FC<Props> = ({ index, value, onChange, onDelete }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <div style={{ flex: 1, display: 'flex', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
        <div style={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontWeight: 600, borderRight: '1px solid #E5E7EB' }}>{index}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Option ${index}`}
          style={{ flex: 1, padding: '10px 12px', color: '#111827', fontWeight: 500, outline: 'none', border: 'none' }}
        />
      </div>
      <button
        onClick={onDelete}
        style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <img src="/icons/close-new-icon.svg" alt="close" width={18} height={18} />
      </button>
    </div>
  );
};

export default AddQuestionTextFieldInput;

