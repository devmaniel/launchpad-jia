"use client";
import React from 'react';

type Props = {
  onClick?: () => void;
};

const DeleteQuestionButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        border: '1px solid #FCA5A5',
        background: '#fff',
        color: '#DC2626',
        padding: '10px 14px',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <img src="/icons/trash-2-warning.svg" alt="trash" width={18} height={18} />
      <span>Delete Question</span>
    </button>
  );
};

export default DeleteQuestionButton;

