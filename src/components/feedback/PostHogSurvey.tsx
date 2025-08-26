'use client';

import { useEffect, useState } from 'react';
import { usePostHog } from '@/contexts/PostHogProvider';
import { trackUserSentiment } from '@/lib/posthog-product-analytics';

interface SurveyConfig {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  trigger?: 'page_load' | 'time_based' | 'action_based';
  triggerDelay?: number; // milliseconds
  targetPages?: string[];
}

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'nps';
  question: string;
  options?: string[];
  required?: boolean;
}

interface PostHogSurveyProps {
  config: SurveyConfig;
  onComplete?: (responses: Record<string, unknown>) => void;
  onDismiss?: () => void;
}

export default function PostHogSurvey({ config, onComplete, onDismiss }: PostHogSurveyProps) {
  const { posthog } = usePostHog();
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!posthog) return;

    // Check if survey should be triggered
    const shouldShow = () => {
      if (config.trigger === 'page_load') {
        return config.targetPages?.includes(window.location.pathname) ?? true;
      }
      return false;
    };

    if (shouldShow()) {
      const delay = config.triggerDelay || 5000; // Default 5 second delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Track survey exposure
        posthog.capture('survey_shown', {
          survey_id: config.id,
          survey_title: config.title,
          page: window.location.pathname,
          trigger_type: config.trigger,
        });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [posthog, config]);

  const handleResponse = (questionId: string, response: unknown) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  };

  const handleNext = () => {
    if (currentQuestion < config.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (posthog) {
      posthog.capture('survey_completed', {
        survey_id: config.id,
        survey_title: config.title,
        responses,
        completion_time_ms: Date.now() - startTime,
        questions_answered: Object.keys(responses).length,
        total_questions: config.questions.length,
      });

      // Track user sentiment based on responses
      const sentiment = analyzeSentiment(responses);
      trackUserSentiment(
        window.location.pathname,
        sentiment,
        'survey',
        `Survey: ${config.title}`
      );
    }

    setIsVisible(false);
    onComplete?.(responses);
  };

  const handleDismiss = () => {
    if (posthog) {
      posthog.capture('survey_dismissed', {
        survey_id: config.id,
        survey_title: config.title,
        current_question: currentQuestion,
        questions_answered: Object.keys(responses).length,
        time_before_dismiss_ms: Date.now() - startTime,
      });
    }

    setIsVisible(false);
    onDismiss?.();
  };

  const analyzeSentiment = (responses: Record<string, unknown>): 'positive' | 'neutral' | 'negative' => {
    // Simple sentiment analysis based on ratings and NPS
    const ratings = Object.values(responses).filter(r => typeof r === 'number');
    if (ratings.length === 0) return 'neutral';
    
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    
    if (avgRating >= 4) return 'positive';
    if (avgRating <= 2) return 'negative';
    return 'neutral';
  };

  if (!isVisible) return null;

  const question = config.questions[currentQuestion];
  if (!question) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-w-md z-50">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">{question.question}</p>

        {question.type === 'rating' && (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleResponse(question.id, rating)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                  responses[question.id] === rating
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-blue-500'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        )}

        {question.type === 'nps' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => handleResponse(question.id, score)}
                  className={`w-8 h-8 rounded border text-xs font-medium transition-colors ${
                    responses[question.id] === score
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-blue-500'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        )}

        {question.type === 'multiple_choice' && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            placeholder="Your feedback..."
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none"
            rows={3}
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Question {currentQuestion + 1} of {config.questions.length}
        </div>
        
        <button
          onClick={handleNext}
          disabled={question.required && !responses[question.id]}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion < config.questions.length - 1 ? 'Next' : 'Complete'}
        </button>
      </div>
    </div>
  );
}

// Pre-configured surveys for common use cases
export const calculatorFeedbackSurvey: SurveyConfig = {
  id: 'calculator_feedback',
  title: 'How was your experience?',
  trigger: 'page_load',
  triggerDelay: 30000, // Show after 30 seconds
  targetPages: ['/'],
  questions: [
    {
      id: 'satisfaction',
      type: 'rating',
      question: 'How satisfied are you with the calculator?',
      required: true,
    },
    {
      id: 'ease_of_use',
      type: 'rating',
      question: 'How easy was it to use?',
      required: true,
    },
    {
      id: 'improvements',
      type: 'text',
      question: 'What could we improve?',
      required: false,
    },
  ],
};

export const npsOnboardingSurvey: SurveyConfig = {
  id: 'nps_onboarding',
  title: 'Quick feedback',
  trigger: 'action_based',
  questions: [
    {
      id: 'nps_score',
      type: 'nps',
      question: 'How likely are you to recommend MakerCost to a friend?',
      required: true,
    },
    {
      id: 'reason',
      type: 'text',
      question: 'What\'s the main reason for your score?',
      required: false,
    },
  ],
};

export const featureUsabilitySurvey: SurveyConfig = {
  id: 'feature_usability',
  title: 'Feature feedback',
  trigger: 'action_based',
  questions: [
    {
      id: 'feature_clarity',
      type: 'multiple_choice',
      question: 'Was this feature easy to find and use?',
      options: ['Very easy', 'Somewhat easy', 'Neutral', 'Somewhat difficult', 'Very difficult'],
      required: true,
    },
    {
      id: 'suggestions',
      type: 'text',
      question: 'Any suggestions for improvement?',
      required: false,
    },
  ],
};