import { createContext, useContext, ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import { Message } from '../types';

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  processMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatState = useChat();

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}