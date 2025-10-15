import React, { useState } from 'react';
import { TrendingUp, PiggyBank, Shield, Calculator, FileText, Lightbulb, ChevronRight, X } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import DataService from '../../services/dataService';
import type { PromptSuggestion, ContextPrompt } from '../../types/chat';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  onClose: () => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt, onClose }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<PromptSuggestion | null>(null);
  const [promptSuggestions, setPromptSuggestions] = useState<PromptSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextAnswers, setContextAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const dataService = React.useMemo(() => new DataService(), []);

  const promptSuggestionsDefault: PromptSuggestion[] = [
    {
      id: 'investment-advice',
      text: 'Get personalized investment advice',
      category: 'Investment',
      contextQuestions: [
        'What is your current age?',
        'What is your risk tolerance? (Conservative/Moderate/Aggressive)',
        'How much are you looking to invest?',
        'What is your investment timeline?'
      ],
      icon: 'TrendingUp'
    }
  ];

  React.useEffect(() => {
    const loadPrompts = async () => {
      try {
        setLoading(true);
        const data = await dataService.getSmartPrompts();
        setPromptSuggestions(data);
      } catch (error) {
        console.error('Failed to load smart prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [dataService]);

  const getIcon = (iconName: string) => {
    const icons = {
      TrendingUp,
      PiggyBank,
      Calculator,
      Shield,
      FileText,
      Lightbulb
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Lightbulb;
    return <IconComponent className="w-5 h-5" />;
  };

  const handleSuggestionClick = (suggestion: PromptSuggestion) => {
    setSelectedSuggestion(suggestion);
    setCurrentStep(0);
    setContextAnswers({});
  };

  const handleContextAnswer = (question: string, answer: string) => {
    setContextAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const handleNextStep = () => {
    if (selectedSuggestion && currentStep < selectedSuggestion.contextQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateContextualPrompt();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateContextualPrompt = () => {
    if (!selectedSuggestion) return;

    let prompt = `I need help with ${selectedSuggestion.text.toLowerCase()}. Here's my situation:\n\n`;
    
    selectedSuggestion.contextQuestions.forEach((question, index) => {
      const answer = contextAnswers[question];
      if (answer) {
        prompt += `• ${question.replace('?', '')}: ${answer}\n`;
      }
    });

    prompt += `\nBased on this information, please provide personalized advice and recommendations.`;

    onSelectPrompt(prompt);
    onClose();
  };

  const canProceed = () => {
    if (!selectedSuggestion) return false;
    const currentQuestion = selectedSuggestion.contextQuestions[currentStep];
    return contextAnswers[currentQuestion]?.trim().length > 0;
  };

  const isLastStep = () => {
    return selectedSuggestion && currentStep === selectedSuggestion.contextQuestions.length - 1;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-6"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded-lg mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedSuggestion) {
    const currentQuestion = selectedSuggestion.contextQuestions[currentStep];
    const progress = ((currentStep + 1) / selectedSuggestion.contextQuestions.length) * 100;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedSuggestion.text}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {selectedSuggestion.contextQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current question */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentQuestion}
          </label>
          <Input
            placeholder="Enter your answer..."
            value={contextAnswers[currentQuestion] || ''}
            onChange={(value) => handleContextAnswer(currentQuestion, value)}
            autoFocus
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() => setSelectedSuggestion(null)}
            >
              Back to suggestions
            </Button>
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={!canProceed()}
            >
              {isLastStep() ? 'Generate Advice' : 'Next'}
              {!isLastStep() && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Get Personalized Financial Advice
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Choose a topic below and I'll guide you through providing the right context for personalized advice.
      </p>

      <div className="space-y-3">
        {promptSuggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {getIcon(suggestion.icon || 'Lightbulb')}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {suggestion.text}
                  </div>
                  <div className="text-sm text-gray-500">
                    {suggestion.category}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> Providing context helps me give you more accurate and personalized financial advice tailored to your specific situation.
          </div>
        </div>
      </div>
    </div>
  );
};