import React, { useState } from 'react';
import { Sparkles, MessageSquarePlus } from 'lucide-react';
import { Button } from '../UI/Button';
import { PromptSuggestions } from './PromptSuggestions';

interface SmartPromptButtonProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SmartPromptButton: React.FC<SmartPromptButtonProps> = ({ onSelectPrompt }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSuggestions(true)}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Smart Prompts
      </Button>

      {showSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PromptSuggestions
            onSelectPrompt={onSelectPrompt}
            onClose={() => setShowSuggestions(false)}
          />
        </div>
      )}
    </>
  );
};