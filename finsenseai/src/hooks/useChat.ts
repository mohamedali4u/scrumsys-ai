import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import type { Message } from '../types/chat';

export const useChat = () => {
  const store = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    return store.sendMessage(content);
  }, [store]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    store.addMessage(message);
  }, [store]);

  const getFavoriteMessages = useCallback(() => {
    return store.messages.filter(msg => msg.isFavorite);
  }, [store.messages]);

  const getGroupedMessages = useCallback(() => {
    const groups: Record<string, Message[]> = {};
    store.messages.forEach(msg => {
      const group = msg.group || 'default';
      if (!groups[group]) groups[group] = [];
      groups[group].push(msg);
    });
    return groups;
  }, [store.messages]);

  return {
    ...store,
    sendMessage,
    addMessage,
    getFavoriteMessages,
    getGroupedMessages
  };
};