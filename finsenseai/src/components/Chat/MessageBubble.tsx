import React from 'react';
import { Heart, Copy, MoreVertical, Tag, Folder } from 'lucide-react';
import type { Message } from '../../types/chat';
import { useChatStore } from '../../stores/chatStore';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { 
    toggleFavorite, 
    groups, 
    moveMessageToGroup, 
    addTagToMessage, 
    removeTagFromMessage 
  } = useChatStore();
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = React.useState(false);
  const [showGroupMenu, setShowGroupMenu] = React.useState(false);
  const [showTagInput, setShowTagInput] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(message.id);
  };

  const handleMoveToGroup = (groupId: string) => {
    moveMessageToGroup(message.id, groupId);
    setShowGroupMenu(false);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTagToMessage(message.id, newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    removeTagFromMessage(message.id, tag);
  };

  const currentGroup = groups.find(g => g.id === message.group);
  const categoryColors = {
    investment: '#10B981',
    retirement: '#8B5CF6',
    budgeting: '#F59E0B',
    insurance: '#06B6D4',
    taxes: '#EF4444',
    general: '#6B7280'
  };
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group relative`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Group and Category Indicators */}
        {(currentGroup || message.category !== 'general') && (
          <div className={`flex items-center space-x-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {currentGroup && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: currentGroup.color }}
              >
                {currentGroup.name}
              </span>
            )}
            {message.category && message.category !== 'general' && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full text-white font-medium capitalize"
                style={{ backgroundColor: categoryColors[message.category] }}
              >
                {message.category}
              </span>
            )}
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          } shadow-sm`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        {/* Tags */}
        {message.tags && message.tags.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full group/tag"
              >
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 opacity-0 group-hover/tag:opacity-100 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        <div className={`flex items-center mt-1 space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
            <button
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Copy message"
            >
              <Copy className="w-3 h-3" />
            </button>
            
            {!isUser && (
              <button
                onClick={handleToggleFavorite}
                className={`p-1 rounded transition-colors ${
                  message.isFavorite 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={message.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-3 h-3 ${message.isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
            
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="More actions"
            >
              <MoreVertical className="w-3 h-3" />
            </button>
            
            {/* Actions Menu */}
            {showActions && (
              <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    setShowGroupMenu(!showGroupMenu);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Folder className="w-3 h-3 mr-2" />
                  Move to Group
                </button>
                <button
                  onClick={() => {
                    setShowTagInput(true);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Tag className="w-3 h-3 mr-2" />
                  Add Tag
                </button>
              </div>
            )}
            
            {/* Group Menu */}
            {showGroupMenu && (
              <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[180px]">
                <div className="px-3 py-1.5 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Move to Group
                </div>
                <button
                  onClick={() => handleMoveToGroup('')}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Remove from group
                </button>
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => handleMoveToGroup(group.id)}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.name}
                  </button>
                ))}
              </div>
            )}
            
            {/* Tag Input */}
            {showTagInput && (
              <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag();
                      if (e.key === 'Escape') setShowTagInput(false);
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close menus */}
      {(showActions || showGroupMenu || showTagInput) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowActions(false);
            setShowGroupMenu(false);
            setShowTagInput(false);
          }}
        />
      )}
    </div>
  );
};