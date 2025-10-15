import React, { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { SearchAndFilter } from './SearchAndFilter';
import { GroupPanel } from './GroupPanel';
import { TaskPanel } from '../Tasks/TaskPanel';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { SuggestionPrompts } from './SuggestionPrompts';
import { useChatStore } from '../../stores/chatStore';

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { 
    messages, 
    isLoading, 
    config, 
    sendMessage,
    showGroupPanel, 
    showTaskPanel,
    getFilteredMessages 
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get filtered messages
  const filteredMessages = getFilteredMessages();

  // Check if we should show suggestion prompts (only after welcome message and no user messages)
  const shouldShowSuggestions = filteredMessages.length === 1 && 
    filteredMessages[0].role === 'assistant' && 
    !filteredMessages.some(msg => msg.role === 'user');

  const handleSelectPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages, isLoading]);

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex overflow-hidden">
      {/* Task Panel */}
      {showTaskPanel && (
        <div className="w-80 flex-shrink-0">
          <TaskPanel />
        </div>
      )}
      
      {/* Group Panel */}
      {showGroupPanel && (
        <div className="w-64 flex-shrink-0">
          <GroupPanel />
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader onClose={onClose} />
        <SearchAndFilter />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>No messages found with current filters</p>
            </div>
          )}
          
          {filteredMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {shouldShowSuggestions && (
            <SuggestionPrompts onSelectPrompt={handleSelectPrompt} />
          )}
          
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInput />
      </div>
    </div>
  );
};