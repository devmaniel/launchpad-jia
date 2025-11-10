import { useState } from 'react';

interface GenerateAllQuestionsParams {
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  workSetup: string;
  categories: string[];
}

interface GenerateQuestionResponse {
  success: boolean;
  questions: string[];
  category: string;
  error?: string;
}

export const useGenerateAllQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const generateAllQuestions = async (
    params: GenerateAllQuestionsParams
  ): Promise<Record<string, string[]> | null> => {
    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: params.categories.length });

    try {
      const results: Record<string, string[]> = {};

      // Generate questions for each category sequentially
      for (let i = 0; i < params.categories.length; i++) {
        const category = params.categories[i];
        setProgress({ current: i + 1, total: params.categories.length });

        const response = await fetch('/api/generate-interview-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobTitle: params.jobTitle,
            jobDescription: params.jobDescription,
            employmentType: params.employmentType,
            workSetup: params.workSetup,
            category,
            count: 1,
          }),
        });

        const data: GenerateQuestionResponse = await response.json();

        if (!data.success || !data.questions || data.questions.length === 0) {
          console.error(`Failed to generate question for ${category}:`, data.error);
          // Continue with other categories even if one fails
          continue;
        }

        results[category] = data.questions;
      }

      if (Object.keys(results).length === 0) {
        throw new Error('Failed to generate any questions');
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions';
      setError(errorMessage);
      console.error('Error generating all questions:', err);
      return null;
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return { generateAllQuestions, loading, error, progress };
};
