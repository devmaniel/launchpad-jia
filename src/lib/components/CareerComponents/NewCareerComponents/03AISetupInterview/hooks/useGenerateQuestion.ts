import { useState } from 'react';

interface GenerateQuestionParams {
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  workSetup: string;
  category: string;
}

interface GenerateQuestionResponse {
  success: boolean;
  questions: string[];
  category: string;
  error?: string;
}

export const useGenerateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = async (params: GenerateQuestionParams): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          count: 1,
        }),
      });

      const data: GenerateQuestionResponse = await response.json();

      if (!data.success || !data.questions || data.questions.length === 0) {
        throw new Error(data.error || 'Failed to generate question');
      }

      return data.questions[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate question';
      setError(errorMessage);
      console.error('Error generating question:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateQuestion, loading, error };
};
