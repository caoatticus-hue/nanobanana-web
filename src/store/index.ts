import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message, UserSettings } from '../types';

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  settings: UserSettings;
  
  // 会话操作
  loadSessions: () => void;
  createSession: (modelId?: string) => string;
  deleteSession: (id: string) => void;
  selectSession: (id: string) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  
  // 消息操作
  addMessage: (sessionId: string, message: Message) => void;
  updateLastMessage: (sessionId: string, content: string) => void;
  clearMessages: (sessionId: string) => void;
  
  // 设置操作
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  defaultModel: 'qwen-turbo',
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: '你是一个有帮助的AI助手，请用简洁清晰的语言回答用户的问题。',
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      settings: defaultSettings,

      loadSessions: () => {
        const { sessions } = get();
        if (sessions.length === 0) {
          const newSession = get().createSession();
          set({ currentSession: sessions.find(s => s.id === newSession) || null });
        } else {
          set({ currentSession: sessions[0] });
        }
      },

      createSession: (modelId?: string) => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          title: '新对话',
          messages: [],
          modelId: modelId || get().settings.defaultModel,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set(state => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession,
        }));

        return newSession.id;
      },

      deleteSession: (id: string) => {
        set(state => {
          const newSessions = state.sessions.filter(s => s.id !== id);
          return {
            sessions: newSessions,
            currentSession: state.currentSession?.id === id 
              ? (newSessions[0] || null) 
              : state.currentSession,
          };
        });
      },

      selectSession: (id: string) => {
        const session = get().sessions.find(s => s.id === id);
        if (session) {
          set({ currentSession: session });
        }
      },

      updateSession: (id: string, updates: Partial<ChatSession>) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
          ),
          currentSession: state.currentSession?.id === id
            ? { ...state.currentSession, ...updates, updatedAt: Date.now() }
            : state.currentSession,
        }));
      },

      addMessage: (sessionId: string, message: Message) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
              : s
          ),
          currentSession: state.currentSession?.id === sessionId
            ? { ...state.currentSession, messages: [...state.currentSession.messages, message], updatedAt: Date.now() }
            : state.currentSession,
        }));
      },

      updateLastMessage: (sessionId: string, content: string) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId && s.messages.length > 0
              ? {
                  ...s,
                  messages: s.messages.map((m, i) =>
                    i === s.messages.length - 1 ? { ...m, content } : m
                  ),
                  updatedAt: Date.now(),
                }
              : s
          ),
          currentSession: state.currentSession?.id === sessionId && state.currentSession.messages.length > 0
            ? {
                ...state.currentSession,
                messages: state.currentSession.messages.map((m, i) =>
                  i === state.currentSession!.messages.length - 1 ? { ...m, content } : m
                ),
                updatedAt: Date.now(),
              }
            : state.currentSession,
        }));
      },

      clearMessages: (sessionId: string) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId ? { ...s, messages: [], updatedAt: Date.now() } : s
          ),
          currentSession: state.currentSession?.id === sessionId
            ? { ...state.currentSession, messages: [], updatedAt: Date.now() }
            : state.currentSession,
        }));
      },

      updateSettings: (newSettings: Partial<UserSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'ai-chat-storage',
    }
  )
);

