import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, Message, WidgetConfig, ChatGroup, StockTask, TaskState } from '../types/chat';
import ApiService from '../services/api';
import DataService from '../services/dataService';

interface ChatStore extends ChatState, TaskState {
  config: WidgetConfig;
  apiService: ApiService;
  dataService: DataService;
  hasShownWelcome: boolean;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string) => Promise<void>;
  toggleFavorite: (messageId: string) => void;
  setCurrentGroup: (group: string | undefined) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | undefined) => void;
  setShowGroupPanel: (show: boolean) => void;
  createGroup: (name: string, description?: string) => string;
  updateGroup: (groupId: string, updates: Partial<ChatGroup>) => void;
  deleteGroup: (groupId: string) => void;
  moveMessageToGroup: (messageId: string, groupId: string) => void;
  addTagToMessage: (messageId: string, tag: string) => void;
  removeTagFromMessage: (messageId: string, tag: string) => void;
  getFilteredMessages: () => Message[];
  clearChat: () => void;
  updateConfig: (config: Partial<WidgetConfig>) => void;
  
  // Task Actions
  setShowTaskPanel: (show: boolean) => void;
  createTask: (task: Omit<StockTask, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTask: (taskId: string, updates: Partial<StockTask>) => void;
  deleteTask: (taskId: string) => void;
  setSelectedTask: (task: StockTask | undefined) => void;
  getTasksByStatus: (status: StockTask['status']) => StockTask[];
  getTasksByType: (type: StockTask['type']) => StockTask[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultGroups: ChatGroup[] = [
  {
    id: 'investment',
    name: 'Investment Planning',
    description: 'Stock market, portfolio management, and investment strategies',
    color: '#10B981',
    messageCount: 0,
    lastActivity: new Date(),
    category: 'investment'
  },
  {
    id: 'retirement',
    name: 'Retirement Planning',
    description: '401k, IRA, and long-term retirement strategies',
    color: '#8B5CF6',
    messageCount: 0,
    lastActivity: new Date(),
  }
]
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isOpen: false,
      searchQuery: '',
      selectedCategory: undefined,
      showGroupPanel: false,
      groups: [],
      tasks: [],
      showTaskPanel: false,
      selectedTask: undefined,
      hasShownWelcome: false,
      config: {
        theme: 'light',
        position: 'bottom-right',
        size: 'standard',
        welcomeMessage: 'Hello! I\'m your AI financial assistant. How can I help you today?',
        primaryColor: '#2563EB',
        companyName: 'Financial AI',
        enableSmartPrompting: true
      },
      apiService: new ApiService(),
      dataService: new DataService(),

      setIsOpen: (isOpen) => set({ isOpen }),

      setIsOpen: (isOpen) => set((state) => {
        // Add welcome message when opening chat for the first time
        if (isOpen && !state.hasShownWelcome && state.messages.length === 0 && state.config.welcomeMessage) {
          const welcomeMessage: Message = {
            id: generateId(),
            content: state.config.welcomeMessage,
            role: 'assistant',
            timestamp: new Date(),
            category: 'general'
          };
          return {
            isOpen,
            hasShownWelcome: true,
            messages: [welcomeMessage]
          };
        }
        
        // Load default groups if none exist
        if (isOpen && state.groups.length === 0) {
          state.dataService.getDefaultGroups().then(defaultGroups => {
            const groups = defaultGroups.map(group => ({
              ...group,
              messageCount: 0,
              lastActivity: new Date()
            }));
            set({ groups });
          }).catch(console.error);
        }
        return { isOpen };
      }),

      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: generateId(),
          timestamp: new Date(),
          category: message.role === 'user' ? 'general' : detectCategory(message.content)
        }]
      })),

      sendMessage: async (content) => {
        const { addMessage, apiService, messages } = get();
        
        // Add user message
        addMessage({ content, role: 'user' });
        set({ isLoading: true });

        try {
          // Get context from recent messages
          const context = messages.slice(-5).map(m => m.content);
          const response = await apiService.sendMessage(content, context);
          
          // Add AI response
          addMessage({ 
            content: response.content, 
            role: 'assistant'
          });
        } catch (error) {
          addMessage({ 
            content: 'I apologize, but I\'m having trouble connecting right now. Please try again later.', 
            role: 'assistant'
          });
        } finally {
          set({ isLoading: false });
        }
      },

      toggleFavorite: (messageId) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg
        )
      })),

      setCurrentGroup: (group) => set({ currentGroup: group }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      setShowGroupPanel: (showGroupPanel) => set({ showGroupPanel }),

      createGroup: (name, description) => {
        const groupId = generateId();
        const newGroup: ChatGroup = {
          id: groupId,
          name,
          description,
          color: getRandomColor(),
          messageCount: 0,
          lastActivity: new Date()
        };
        
        set((state) => ({
          groups: [...state.groups, newGroup]
        }));
        
        return groupId;
      },

      updateGroup: (groupId, updates) => set((state) => ({
        groups: state.groups.map(group =>
          group.id === groupId ? { ...group, ...updates } : group
        )
      })),

      deleteGroup: (groupId) => set((state) => ({
        groups: state.groups.filter(group => group.id !== groupId),
        messages: state.messages.map(msg =>
          msg.group === groupId ? { ...msg, group: undefined } : msg
        ),
        currentGroup: state.currentGroup === groupId ? undefined : state.currentGroup
      })),

      moveMessageToGroup: (messageId, groupId) => set((state) => {
        const updatedMessages = state.messages.map(msg =>
          msg.id === messageId ? { ...msg, group: groupId } : msg
        );
        
        const updatedGroups = state.groups.map(group => ({
          ...group,
          messageCount: updatedMessages.filter(msg => msg.group === group.id).length,
          lastActivity: group.id === groupId ? new Date() : group.lastActivity
        }));
        
        return {
          messages: updatedMessages,
          groups: updatedGroups
        };
      }),

      addTagToMessage: (messageId, tag) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId 
            ? { ...msg, tags: [...(msg.tags || []), tag] }
            : msg
        )
      })),

      removeTagFromMessage: (messageId, tag) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId 
            ? { ...msg, tags: (msg.tags || []).filter(t => t !== tag) }
            : msg
        )
      })),

      getFilteredMessages: () => {
        const { messages, searchQuery, currentGroup, selectedCategory } = get();
        
        return messages.filter(msg => {
          // Group filter
          if (currentGroup && msg.group !== currentGroup) return false;
          
          // Category filter
          if (selectedCategory && msg.category !== selectedCategory) return false;
          
          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const contentMatch = msg.content.toLowerCase().includes(query);
            const tagMatch = msg.tags?.some(tag => tag.toLowerCase().includes(query));
            if (!contentMatch && !tagMatch) return false;
          }
          
          return true;
        });
      },

      clearChat: () => set({ messages: [] }),

      updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig },
        apiService: new ApiService(newConfig.apiKey || state.config.apiKey)
      })),

      // Task Actions
      setShowTaskPanel: (showTaskPanel) => set({ showTaskPanel }),

      createTask: (taskData) => {
        const taskId = generateId();
        const newTask: StockTask = {
          ...taskData,
          id: taskId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
        
        return taskId;
      },

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId 
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        )
      })),

      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
        selectedTask: state.selectedTask?.id === taskId ? undefined : state.selectedTask
      })),

      setSelectedTask: (selectedTask) => set({ selectedTask }),

      getTasksByStatus: (status) => {
        const { tasks } = get();
        return tasks.filter(task => task.status === status);
      },

      getTasksByType: (type) => {
        const { tasks } = get();
        return tasks.filter(task => task.type === type);
      }
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({ 
        messages: state.messages,
        config: state.config,
        groups: state.groups,
        tasks: state.tasks,
        hasShownWelcome: state.hasShownWelcome
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert timestamp strings back to Date objects for messages
          state.messages = state.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          
          // Convert lastActivity strings back to Date objects for groups
          state.groups = state.groups.map(group => ({
            ...group,
            lastActivity: new Date(group.lastActivity)
          }));
          
          // Convert date strings back to Date objects for tasks
          state.tasks = state.tasks.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            triggeredAt: task.triggeredAt ? new Date(task.triggeredAt) : undefined
          }));
        }
      }
    }
  )
);

// Helper functions
function detectCategory(content: string): Message['category'] {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('invest') || lowerContent.includes('stock') || lowerContent.includes('portfolio')) {
    return 'investment';
  }
  if (lowerContent.includes('retire') || lowerContent.includes('401k') || lowerContent.includes('ira')) {
    return 'retirement';
  }
  if (lowerContent.includes('budget') || lowerContent.includes('save') || lowerContent.includes('emergency fund')) {
    return 'budgeting';
  }
  if (lowerContent.includes('insurance') || lowerContent.includes('coverage')) {
    return 'insurance';
  }
  if (lowerContent.includes('tax') || lowerContent.includes('deduction')) {
    return 'taxes';
  }
  
  return 'general';
}

function getRandomColor(): string {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}