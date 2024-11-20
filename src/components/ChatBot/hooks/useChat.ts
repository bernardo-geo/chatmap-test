import { useState, useCallback } from 'react';
import { Message } from '../types';
import { searchLocalData } from '../utils/search';
import { processWithAI } from '../utils/ai';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    content: 'Olá! Como posso ajudar você hoje? Você pode me perguntar sobre museus, restaurantes, rotas de caminhada, castelos, praias fluviais e muito mais!',
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const processMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      addMessage(input, 'user');

      // Search local data first
      const localResults = await searchLocalData(input);
      
      // Process with AI using local results
      const response = await processWithAI(input, localResults);
      
      if (response) {
        addMessage(response, 'bot');
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Chat processing error:', error);
      addMessage(
        'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente em alguns momentos.',
        'bot'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage]);

  return {
    messages,
    isLoading,
    processMessage
  };
}