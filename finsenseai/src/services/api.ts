import axios from 'axios';
import type { ApiResponse } from '../types/chat';

class ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.baseUrl = 'https://api.example.com'; // Replace with actual API
    this.apiKey = apiKey;
  }

  async sendMessage(message: string, context: string[] = []): Promise<ApiResponse> {
    // Simulate API delay for demo
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Mock financial AI responses
    const responses = [
      {
        content: "Based on your query, I'd recommend diversifying your portfolio across different asset classes. Consider allocating 60% to stocks, 30% to bonds, and 10% to alternative investments for balanced growth.",
        suggestions: ["Portfolio analysis", "Risk assessment", "Investment timeline"],
        followUpQuestions: ["What's your current risk tolerance?", "How long is your investment timeline?", "Do you have any existing investments?"]
      },
      {
        content: "For retirement planning, the rule of thumb is to save 10-15% of your income. With compound interest, starting early makes a significant difference. Would you like me to calculate projections based on your age and income?",
        suggestions: ["Calculate retirement needs", "401k optimization", "IRA strategies"],
        followUpQuestions: ["What's your current age?", "What's your target retirement age?", "How much do you currently have saved?"]
      },
      {
        content: "Market volatility is normal. During uncertain times, focus on your long-term goals and avoid emotional decisions. Dollar-cost averaging can help reduce the impact of market fluctuations.",
        suggestions: ["Market analysis", "Risk management", "Investment strategies"],
        followUpQuestions: ["Are you concerned about current market conditions?", "What's your investment timeline?", "How do you typically react to market downturns?"]
      },
      {
        content: "Emergency funds should cover 3-6 months of expenses. High-yield savings accounts or money market funds are good options for accessibility while earning some interest.",
        suggestions: ["Emergency fund calculator", "Savings strategies", "Account recommendations"],
        followUpQuestions: ["What are your monthly expenses?", "How much do you currently have saved?", "Do you have any dependents?"]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse.content,
      suggestions: randomResponse.suggestions,
      followUpQuestions: randomResponse.followUpQuestions
    };
  }
}

export default ApiService;