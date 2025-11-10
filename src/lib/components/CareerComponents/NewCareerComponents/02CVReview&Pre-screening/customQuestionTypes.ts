export type CustomQuestion = {
  id: string;
  question: string;
  answerType: 'short_answer' | 'long_answer' | 'dropdown' | 'checkboxes' | 'range';
  options?: string[];
  minValue?: string;
  maxValue?: string;
};
