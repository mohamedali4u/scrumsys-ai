import React, { useState } from 'react';
import { Send, Paperclip, Plus, HelpCircle } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { SmartPromptButton } from './SmartPromptButton';
import { TaskCreator } from '../Tasks/TaskCreator';
import { QuestionGenerator } from './QuestionGenerator';
import { useChatStore } from '../../stores/chatStore';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [showQuestionGenerator, setShowQuestionGenerator] = useState(false);
  const { sendMessage, isLoading } = useChatStore();

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const messageToSend = message.trim();
    setMessage('');
    await sendMessage(messageToSend);
  };

  const handleSelectPrompt = (prompt: string) => {
    setMessage(prompt);
  };
  
  const handleSelectQuestion = async (question: string) => {
    setShowQuestionGenerator(false);
    await sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Smart Prompt Button */}
      <div className="mb-3 flex justify-center">
        <SmartPromptButton onSelectPrompt={handleSelectPrompt} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQuestionGenerator(true)}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200 ml-2"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Question Ideas
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTaskCreator(true)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>
      
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Input
            placeholder="Ask me anything about finances..."
            value={message}
            onChange={setMessage}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={500}
            className="resize-none"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          icon={Send}
          className="shrink-0"
        >
          Send
        </Button>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift + Enter for new line</span>
        </div>
        <span className="text-xs text-gray-400">
          {message.length}/500
        </span>
      </div>
      
      {/* Task Creator Modal */}
      {showTaskCreator && (
        <TaskCreator onClose={() => setShowTaskCreator(false)} />
      )}
      
      {/* Question Generator Modal */}
      {showQuestionGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <QuestionGenerator 
            onSelectQuestion={handleSelectQuestion}
            onClose={() => setShowQuestionGenerator(false)} 
          />
        </div>
      )}
    </div>
  );
};