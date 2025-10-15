class DataService {
  private baseUrl: string;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_DATA_BASE_URL || '/data';
  }

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const now = Date.now();
    
    // Check if we have valid cached data
    if (this.cache.has(cacheKey) && this.cacheExpiry.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey)!;
      if (now < expiry) {
        return this.cache.get(cacheKey);
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the data
      this.cache.set(cacheKey, data);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      
      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        console.warn(`Using expired cache for ${endpoint}`);
        return this.cache.get(cacheKey);
      }
      
      throw error;
    }
  }

  async getSuggestionPrompts() {
    try {
      const data = await this.fetchWithCache<{ suggestionPrompts: any[] }>('prompts.json');
      return data.suggestionPrompts;
    } catch (error) {
      console.error('Failed to load suggestion prompts, using fallback');
      return this.getFallbackSuggestionPrompts();
    }
  }

  async getSmartPrompts() {
    try {
      const data = await this.fetchWithCache<{ smartPrompts: any[] }>('prompts.json');
      return data.smartPrompts;
    } catch (error) {
      console.error('Failed to load smart prompts, using fallback');
      return this.getFallbackSmartPrompts();
    }
  }

  async getCategories() {
    try {
      const data = await this.fetchWithCache<{ categories: any[] }>('categories.json');
      return data.categories;
    } catch (error) {
      console.error('Failed to load categories, using fallback');
      return this.getFallbackCategories();
    }
  }

  async getDefaultGroups() {
    try {
      const data = await this.fetchWithCache<{ defaultGroups: any[] }>('groups.json');
      return data.defaultGroups;
    } catch (error) {
      console.error('Failed to load default groups, using fallback');
      return this.getFallbackGroups();
    }
  }

  // Fallback data in case JSON files fail to load
  private getFallbackSuggestionPrompts() {
    return [
      {
        id: 'investment',
        label: 'Investment Advice',
        icon: 'TrendingUp',
        prompt: 'I need help with investment advice. Can you guide me through creating a diversified portfolio?',
        color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        category: 'investment'
      },
      {
        id: 'retirement',
        label: 'Retirement Planning',
        icon: 'PiggyBank',
        prompt: 'I want to plan for retirement. Can you help me understand how much I should save?',
        color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        category: 'retirement'
      },
      {
        id: 'budgeting',
        label: 'Create Budget',
        icon: 'Calculator',
        prompt: 'I need help creating a monthly budget. Can you guide me through the process?',
        color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        category: 'budgeting'
      }
    ];
  }

  private getFallbackSmartPrompts() {
    return [
      {
        id: 'investment-advice',
        text: 'Get personalized investment advice',
        category: 'Investment',
        contextQuestions: [
          'What is your current age?',
          'What is your risk tolerance?',
          'How much are you looking to invest?'
        ],
        icon: 'TrendingUp'
      }
    ];
  }

  private getFallbackCategories() {
    return [
      { id: 'investment', name: 'Investment', color: '#10B981', icon: 'TrendingUp' },
      { id: 'retirement', name: 'Retirement', color: '#8B5CF6', icon: 'PiggyBank' },
      { id: 'budgeting', name: 'Budgeting', color: '#F59E0B', icon: 'Calculator' },
      { id: 'general', name: 'General', color: '#6B7280', icon: 'MessageSquare' }
    ];
  }

  private getFallbackGroups() {
    return [
      {
        id: 'investment',
        name: 'Investment Planning',
        description: 'Stock market and investment strategies',
        color: '#10B981',
        category: 'investment',
        isDefault: true
      },
      {
        id: 'retirement',
        name: 'Retirement Planning',
        description: '401k, IRA, and retirement strategies',
        color: '#8B5CF6',
        category: 'retirement',
        isDefault: true
      }
    ];
  }

  // Clear cache manually if needed
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Get cache status for debugging
  getCacheStatus() {
    const now = Date.now();
    const status: Record<string, any> = {};
    
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      status[key] = {
        cached: this.cache.has(key),
        expired: now > expiry,
        expiresIn: Math.max(0, expiry - now)
      };
    }
    
    return status;
  }
}

export default DataService;