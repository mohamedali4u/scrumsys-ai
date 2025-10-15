import React, { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb, X, Sparkles, Filter } from 'lucide-react';
import { Button } from '../UI/Button';
import DataService from '../../services/dataService';

interface QuestionGeneratorProps {
  onSelectQuestion: (question: string) => void;
  onClose: () => void;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context?: string;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ onSelectQuestion, onClose }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dataService = React.useMemo(() => new DataService(), []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await dataService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
    generateQuestions();
  }, [dataService]);

  const generateQuestions = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Simulate AI question generation with realistic financial questions
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const questionBank = {
        investment: [
          { q: "What's the difference between growth and value investing strategies?", d: 'beginner', c: "Understanding different investment approaches can help you choose the right strategy for your goals." },
          { q: "How do I calculate the price-to-earnings ratio and what does it tell me?", d: 'intermediate', c: "P/E ratios are fundamental metrics for evaluating stock valuations." },
          { q: "What are the tax implications of dividend reinvestment plans (DRIPs)?", d: 'advanced', c: "Understanding tax consequences helps optimize your investment returns." },
          { q: "Should I invest in individual stocks or index funds as a beginner?", d: 'beginner', c: "This choice affects your risk level and time commitment to investing." },
          { q: "How does dollar-cost averaging work and when should I use it?", d: 'intermediate', c: "This strategy can help reduce the impact of market volatility on your investments." },
          { q: "What's the role of alternative investments in a diversified portfolio?", d: 'advanced', c: "REITs, commodities, and other alternatives can provide additional diversification." }
        ],
        retirement: [
          { q: "How much should I contribute to my 401(k) to get the full employer match?", d: 'beginner', c: "Employer matching is essentially free money you don't want to miss." },
          { q: "What's the difference between a traditional and Roth IRA?", d: 'beginner', c: "The tax treatment differs significantly between these two retirement accounts." },
          { q: "When should I consider converting my traditional IRA to a Roth IRA?", d: 'intermediate', c: "Roth conversions can be strategic but have immediate tax implications." },
          { q: "How do required minimum distributions (RMDs) work for retirement accounts?", d: 'advanced', c: "Understanding RMD rules helps you plan for retirement income and taxes." },
          { q: "What's the 4% rule and how do I apply it to retirement planning?", d: 'intermediate', c: "This guideline helps estimate how much you can safely withdraw in retirement." },
          { q: "Should I prioritize paying off debt or contributing to retirement?", d: 'beginner', c: "This common dilemma depends on interest rates and your financial situation." }
        ],
        budgeting: [
          { q: "What's the 50/30/20 budgeting rule and how do I implement it?", d: 'beginner', c: "This simple framework helps allocate your income across needs, wants, and savings." },
          { q: "How do I track irregular expenses like car maintenance or gifts?", d: 'intermediate', c: "Planning for irregular expenses prevents budget surprises." },
          { q: "What's the best way to budget for variable income as a freelancer?", d: 'advanced', c: "Irregular income requires different budgeting strategies than steady paychecks." },
          { q: "How much should I keep in my emergency fund?", d: 'beginner', c: "Emergency funds provide financial security during unexpected situations." },
          { q: "Should I use the envelope method or digital budgeting apps?", d: 'beginner', c: "Different budgeting methods work better for different personality types." },
          { q: "How do I budget for annual expenses like insurance or property taxes?", d: 'intermediate', c: "Annual expenses need to be planned for throughout the year." }
        ],
        insurance: [
          { q: "How much life insurance do I need and what type should I buy?", d: 'beginner', c: "Life insurance needs vary based on dependents and financial obligations." },
          { q: "What's the difference between term and whole life insurance?", d: 'beginner', c: "Understanding these types helps you choose the right coverage for your needs." },
          { q: "Do I need disability insurance if I have coverage through work?", d: 'intermediate', c: "Employer coverage may not be sufficient for your income replacement needs." },
          { q: "How do health savings accounts (HSAs) work with high-deductible health plans?", d: 'intermediate', c: "HSAs offer triple tax advantages when used correctly." },
          { q: "What factors affect my auto insurance premiums and how can I lower them?", d: 'beginner', c: "Understanding premium factors helps you find ways to reduce costs." },
          { q: "Should I get umbrella insurance and how much coverage do I need?", d: 'advanced', c: "Umbrella policies provide additional liability protection beyond standard policies." }
        ],
        taxes: [
          { q: "Should I itemize deductions or take the standard deduction?", d: 'beginner', c: "The choice depends on your total deductible expenses versus the standard amount." },
          { q: "How do tax-loss harvesting strategies work for investment accounts?", d: 'advanced', c: "This strategy can help offset capital gains with investment losses." },
          { q: "What business expenses can I deduct if I work from home?", d: 'intermediate', c: "Home office deductions have specific IRS requirements and limitations." },
          { q: "How does the kiddie tax affect my child's investment income?", d: 'advanced', c: "Children's unearned income may be taxed at parents' rates." },
          { q: "What's the difference between tax deductions and tax credits?", d: 'beginner', c: "Credits reduce tax owed dollar-for-dollar, while deductions reduce taxable income." },
          { q: "When should I consider hiring a tax professional versus doing my own taxes?", d: 'intermediate', c: "Complex situations may benefit from professional tax preparation." }
        ],
        general: [
          { q: "How do I improve my credit score and how long does it take?", d: 'beginner', c: "Credit scores affect loan rates and approval chances for major purchases." },
          { q: "What's the best strategy for paying off multiple debts?", d: 'intermediate', c: "Debt avalanche vs. snowball methods have different psychological and mathematical benefits." },
          { q: "How do I financially prepare for buying my first home?", d: 'beginner', c: "Home buying involves more costs than just the down payment." },
          { q: "What financial documents should I keep and for how long?", d: 'beginner', c: "Proper record keeping is important for taxes and financial planning." },
          { q: "How do I protect myself from identity theft and financial fraud?", d: 'intermediate', c: "Financial security requires proactive measures to protect your information." },
          { q: "What's the best way to teach my children about money management?", d: 'intermediate', c: "Financial literacy starts early and builds lifelong money habits." }
        ]
      };

      let availableQuestions: any[] = [];
      
      if (selectedCategory === 'all') {
        availableQuestions = Object.values(questionBank).flat();
      } else {
        availableQuestions = questionBank[selectedCategory as keyof typeof questionBank] || [];
      }

      // Filter by difficulty if specified
      if (difficulty !== 'all') {
        availableQuestions = availableQuestions.filter(q => q.d === difficulty);
      }

      // Randomly select 6 questions
      const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 6).map((q, index) => ({
        id: `q-${Date.now()}-${index}`,
        question: q.q,
        category: selectedCategory === 'all' ? 
          Object.keys(questionBank).find(cat => questionBank[cat as keyof typeof questionBank].includes(q)) || 'general' :
          selectedCategory,
        difficulty: q.d as 'beginner' | 'intermediate' | 'advanced',
        context: q.c
      }));

      setQuestions(selectedQuestions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    generateQuestions(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    generateQuestions();
  };

  const handleDifficultyChange = (newDifficulty: typeof difficulty) => {
    setDifficulty(newDifficulty);
    generateQuestions();
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI Question Generator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          Get AI-generated financial questions tailored to your interests. Select a category and difficulty level to get personalized question recommendations.
        </p>

        {/* Filters */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedCategory === category.id
                      ? 'text-white border-transparent'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Levels' },
                { key: 'beginner', label: 'Beginner' },
                { key: 'intermediate', label: 'Intermediate' },
                { key: 'advanced', label: 'Advanced' }
              ].map((level) => (
                <button
                  key={level.key}
                  onClick={() => handleDifficultyChange(level.key as typeof difficulty)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    difficulty === level.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Generated Questions</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Generating...' : 'Refresh'}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question) => (
              <button
                key={question.id}
                onClick={() => onSelectQuestion(question.question)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(question.category) }}
                    />
                    <span className="text-xs font-medium text-gray-500 capitalize">
                      {question.category}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <Lightbulb className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                
                <p className="font-medium text-gray-900 mb-2 group-hover:text-blue-900">
                  {question.question}
                </p>
                
                {question.context && (
                  <p className="text-sm text-gray-600">
                    {question.context}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        {questions.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No questions found for the selected filters.</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setDifficulty('all');
                generateQuestions();
              }}
              className="mt-2"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-blue-50 rounded-b-lg">
        <div className="flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> These AI-generated questions are designed to help you explore different aspects of personal finance. Click any question to start a detailed conversation about that topic.
          </div>
        </div>
      </div>
    </div>
  );
};