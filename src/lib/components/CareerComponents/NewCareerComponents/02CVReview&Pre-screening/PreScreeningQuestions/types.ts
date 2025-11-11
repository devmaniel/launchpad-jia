export type Question = { 
  id: string; 
  title: string; 
  description: string;
  answerType?: 'dropdown' | 'checkboxes' | 'range';
  options?: string[];
  minValue?: string;
  maxValue?: string;
};
