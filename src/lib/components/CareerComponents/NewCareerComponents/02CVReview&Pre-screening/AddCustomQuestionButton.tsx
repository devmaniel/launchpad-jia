"use client";
import React from 'react';
import Image from 'next/image';

type Props = {
  onClick: () => void;
  label?: string;
  style?: React.CSSProperties;
  iconSrc?: string;
};

const AddCustomQuestionButton: React.FC<Props> = ({ onClick, label = 'Add custom', style, iconSrc }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        background: '#111827',
        color: '#fff',
        border: 0,
        borderRadius: 999,
        padding: '8px 15px',
        cursor: 'pointer',
        margin: '8px 20px',
        ...style,
      }}
    >
      <Image 
        src={iconSrc || "/icons/plus.svg"} 
        alt="Add" 
        width={16} 
        height={16} 
        style={{ display: 'block' }}
      />
      <span style={{ fontWeight: 600 }}>{label}</span>
    </button>
  );
};

export default AddCustomQuestionButton;
