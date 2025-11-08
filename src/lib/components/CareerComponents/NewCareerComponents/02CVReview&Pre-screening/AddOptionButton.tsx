"use client";
import React from 'react';

type Props = {
  onClick: () => void;
  label?: string;
  style?: React.CSSProperties;
};

const AddOptionButton: React.FC<Props> = ({ onClick, label = 'Add Option', style }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        color: '#6B7280',
        background: 'transparent',
        border: 0,
        padding: '6px 0',
        fontWeight: 500,
        marginLeft: 44,
        cursor: 'pointer',
        ...style,
      }}
    >
      <span style={{ fontSize: 18, lineHeight: '18px' }}>+</span>
      <span>{label}</span>
    </button>
  );
};

export default AddOptionButton;

