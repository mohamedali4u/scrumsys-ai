import React from 'react';
import { TrendingUp, PiggyBank, Calculator, Shield, FileText, CreditCard, Umbrella, Home, MessageSquare } from 'lucide-react';
import DataService from '../../services/dataService';

interface SuggestionPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestionPrompts: React.FC<SuggestionPromptsProps> = ({ onSelectPrompt }) => {
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const dataService = React.useMemo(() => new DataService(), []);

  React.useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const data = await dataService.getSuggestionPrompts();
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to load suggestion prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [dataService]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      TrendingUp,
      PiggyBank,
      Calculator,
      Shield,
      FileText,
      CreditCard,
      Umbrella,
      Home,
      MessageSquare
    };
    return icons[iconName] || MessageSquare;
  };

  if (loading) {
    return (
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        💡 Quick Start - Choose a topic to begin:
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion) => {
          const IconComponent = getIcon(suggestion.icon);
          return (
            <button
              key={suggestion.id}
              onClick={() => onSelectPrompt(suggestion.prompt)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 hover:shadow-sm ${suggestion.color}`}
            >
              <div className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{suggestion.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Or type your own question below
      </p>
    </div>
  );
};