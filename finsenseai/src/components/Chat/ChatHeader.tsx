import React from 'react';
import { X, Minimize2, Search, Star, Trash2, Sidebar, CheckSquare } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useChatStore } from '../../stores/chatStore';

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  const { 
    config, 
    searchQuery, 
    setSearchQuery, 
    clearChat, 
    messages, 
    showGroupPanel, 
    setShowGroupPanel,
    showTaskPanel,
    setShowTaskPanel,
    tasks
  } = useChatStore();
  const [showSearch, setShowSearch] = React.useState(false);

  const favoriteCount = messages.filter(m => m.isFavorite).length;
  const activeTasks = tasks.filter(t => t.status === 'monitoring' || t.status === 'pending').length;

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearChat();
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">FS</span>
          </div>
          <div>
            <h3 className="font-semibold">{config.companyName}</h3>
            <p className="text-blue-100 text-xs">Financial Assistant AI to Enable You</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTaskPanel(!showTaskPanel)}
            className={`text-white hover:bg-blue-500 relative ${showTaskPanel ? 'bg-blue-500' : ''}`}
          >
            <CheckSquare className="w-4 h-4" />
            {activeTasks > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeTasks}
              </span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGroupPanel(!showGroupPanel)}
            className={`text-white hover:bg-blue-500 ${showGroupPanel ? 'bg-blue-500' : ''}`}
          >
            <Sidebar className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="text-white hover:bg-blue-500"
          >
            <Search className="w-4 h-4" />
          </Button>
          
          {favoriteCount > 0 && (
            <div className="relative">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="absolute -top-2 -right-2 bg-yellow-300 text-blue-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {favoriteCount}
              </span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-white hover:bg-blue-500"
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {showSearch && (
        <div className="mt-3">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="bg-blue-500 border-blue-400 text-white placeholder-blue-200"
          />
        </div>
      )}
    </div>
  );
};