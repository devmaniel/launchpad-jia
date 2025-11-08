import { Question } from './types';

export const suggestions: Question[] = [
  {
    id: 'notice-period',
    title: 'Notice Period',
    description: 'How long is your notice period?',
  },
  {
    id: 'work-setup',
    title: 'Work Setup',
    description: 'How often are you willing to report to the office each week?',
  },
  {
    id: 'asking-salary',
    title: 'Asking Salary',
    description: 'What is your expected monthly salary?',
  },
];

export const staticAddedIds = new Set(['notice-period', 'work-setup', 'asking-salary']);
