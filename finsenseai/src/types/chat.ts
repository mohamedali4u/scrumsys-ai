export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isFavorite?: boolean;
  group?: string;
  tags?: string[];
  category?: 'investment' | 'retirement' | 'budgeting' | 'insurance' | 'taxes' | 'general';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  currentGroup?: string;
  searchQuery: string;
  selectedCategory?: string;
  showGroupPanel: boolean;
  groups: ChatGroup[];
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  color: string;
  messageCount: number;
  lastActivity: Date;
  category?: string;
}

export interface WidgetConfig {
  apiKey?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  welcomeMessage?: string;
  primaryColor?: string;
  companyName?: string;
  enableSmartPrompting?: boolean;
  promptSuggestions?: string[];
  size?: 'compact' | 'standard' | 'large' | 'custom';
  customWidth?: string;
  customHeight?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

export interface ApiResponse {
  content: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export interface PromptSuggestion {
  id: string;
  text: string;
  category: string;
  contextQuestions: string[];
  icon?: string;
}

export interface ContextPrompt {
  question: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

export interface StockTask {
  id: string;
  type: 'check_price' | 'buy_order' | 'sell_order';
  symbol: string;
  companyName?: string;
  quantity?: number;
  targetPrice?: number;
  currentPrice?: number;
  orderType?: 'market' | 'limit' | 'stop_loss';
  status: 'pending' | 'monitoring' | 'triggered' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  triggeredAt?: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  alertEnabled: boolean;
  conditions?: {
    priceAbove?: number;
    priceBelow?: number;
    percentageChange?: number;
  };
}

export interface TaskState {
  tasks: StockTask[];
  showTaskPanel: boolean;
  selectedTask?: StockTask;
}