import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  confidence?: number;
  recommendations?: Array<{
    type: string;
    title: string;
    reason: string;
    priority: string;
  }>;
  next_actions?: string[];
  timestamp: string;
}

interface CopilotState {
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearConversation: () => void;
}

export const useCopilotStore = create<CopilotState>((set) => ({
  conversationId: 'default-conv-1',
  isLoading: false,
  messages: [
    {
      id: 'init-msg-1',
      sender: 'assistant',
      text: "Hello Alex! I am your AI Career Copilot. I analyze your academic records, verified skills, and target goals to give you personalized career recommendations, skill-gap analysis, and actionable roadmaps. What would you like to explore today?",
      confidence: 1.0,
      recommendations: [
        {
          type: 'SKILL',
          title: 'Docker & Microservices',
          reason: 'Required for 85% of Backend Engineer openings matching your profile',
          priority: 'HIGH',
        },
      ],
      next_actions: [
        'Review your active skill gaps for Backend Engineer',
        'Take a 10-minute AI Mock Technical Interview',
      ],
      timestamp: new Date().toISOString(),
    },
  ],

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearConversation: () =>
    set({
      conversationId: `conv-${Date.now()}`,
      messages: [],
    }),
}));
