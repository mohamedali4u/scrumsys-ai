import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Folder, FolderOpen, MessageSquare } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useChatStore } from '../../stores/chatStore';
import type { ChatGroup } from '../../types/chat';

export const GroupPanel: React.FC = () => {
  const {
    groups,
    currentGroup,
    setCurrentGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    messages
  } = useChatStore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    createGroup(newGroupName.trim(), newGroupDescription.trim() || undefined);
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateForm(false);
  };

  const handleUpdateGroup = (groupId: string) => {
    if (!newGroupName.trim()) return;
    
    updateGroup(groupId, {
      name: newGroupName.trim(),
      description: newGroupDescription.trim() || undefined
    });
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group? Messages will be moved to ungrouped.')) {
      deleteGroup(groupId);
    }
  };

  const startEditing = (group: ChatGroup) => {
    setEditingGroup(group.id);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description || '');
  };

  const cancelEditing = () => {
    setEditingGroup(null);
    setShowCreateForm(false);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  // Calculate message counts for each group
  const groupsWithCounts = groups.map(group => ({
    ...group,
    messageCount: messages.filter(msg => msg.group === group.id).length,
    lastActivity: messages
      .filter(msg => msg.group === group.id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]?.timestamp || group.lastActivity
  }));

  const ungroupedCount = messages.filter(msg => !msg.group).length;

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Conversation Groups</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* All Messages */}
        <button
          onClick={() => setCurrentGroup(undefined)}
          className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
            !currentGroup
              ? 'bg-blue-100 text-blue-900 border border-blue-200'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="font-medium">All Messages</span>
            </div>
            <span className="text-sm opacity-75">({messages.length})</span>
          </div>
        </button>

        {/* Ungrouped Messages */}
        {ungroupedCount > 0 && (
          <div className="p-3 rounded-lg mb-2 bg-gray-100 text-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-2" />
                <span className="font-medium">Ungrouped</span>
              </div>
              <span className="text-sm">({ungroupedCount})</span>
            </div>
          </div>
        )}

        {/* Group Items */}
        {groupsWithCounts.map((group) => (
          <div key={group.id} className="mb-2">
            {editingGroup === group.id ? (
              <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                <Input
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={setNewGroupName}
                  className="text-sm"
                />
                <Input
                  placeholder="Description (optional)"
                  value={newGroupDescription}
                  onChange={setNewGroupDescription}
                  className="text-sm"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateGroup(group.id)}
                    disabled={!newGroupName.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCurrentGroup(currentGroup === group.id ? undefined : group.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors group ${
                  currentGroup === group.id
                    ? 'bg-white border-2 shadow-sm'
                    : 'hover:bg-white hover:shadow-sm'
                }`}
                style={{
                  borderColor: currentGroup === group.id ? group.color : 'transparent'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    {currentGroup === group.id ? (
                      <FolderOpen className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: group.color }} />
                    ) : (
                      <Folder className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: group.color }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{group.name}</div>
                      {group.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{group.description}</div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {group.messageCount} messages
                        </span>
                        <span className="text-xs text-gray-400">
                          {group.lastActivity.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(group);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </button>
            )}
          </div>
        ))}

        {/* Create Group Form */}
        {showCreateForm && (
          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
            <Input
              placeholder="Group name"
              value={newGroupName}
              onChange={setNewGroupName}
              className="text-sm"
              autoFocus
            />
            <Input
              placeholder="Description (optional)"
              value={newGroupDescription}
              onChange={setNewGroupDescription}
              className="text-sm"
            />
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
              >
                Create
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};