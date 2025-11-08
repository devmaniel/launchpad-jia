import React from 'react';
import { Question } from './types';

type Props = {
  suggestions: Question[];
  staticAddedIds: Set<string>;
  onAdd: (q: Question) => void;
};

const SuggestionsList: React.FC<Props> = ({ suggestions, staticAddedIds, onAdd }) => {
  return (
    <div>
      <span style={{ fontWeight: 600, fontSize: 16, color: '#181D27' }}>Suggested Pre-screening Questions:</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {suggestions.map((s) => {
          const added = staticAddedIds.has(s.id);
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: 16, color: added ? '#D5D7DA' : '#181D27' }}>{s.title}</strong>
                <div style={{ fontSize: 16, color: added ? '#D5D7DA' : '#6B7280' }}>{s.description}</div>
              </div>
              <button
                onClick={() => onAdd(s)}
                disabled={added}
                style={{
                  borderRadius: 999,
                  border: `1px solid ${added ? '#D5D7DA' : '#D1D5DB'}`,
                  background: added ? 'transparent' : '#fff',
                  color: added ? '#D5D7DA' : 'inherit',
                  padding: '6px 14px',
                  cursor: added ? 'default' : 'pointer',
                  fontWeight: 600
                }}
              >
                {added ? 'Added' : 'Add'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestionsList;
