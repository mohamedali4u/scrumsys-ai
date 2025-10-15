import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { TaskCreator } from './TaskCreator';
import { useChatStore } from '../../stores/chatStore';
import type { StockTask } from '../../types/chat';

export const TaskPanel: React.FC = () => {
  const { 
    tasks, 
    deleteTask, 
    updateTask, 
    setSelectedTask, 
    selectedTask 
  } = useChatStore();
  
  const [showCreator, setShowCreator] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'monitoring' | 'completed'>('all');
  const [showActions, setShowActions] = useState<string | null>(null);

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
  };

  const getTaskIcon = (task: StockTask) => {
    switch (task.type) {
      case 'check_price':
        return <Search className="w-4 h-4" />;
      case 'buy_order':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'sell_order':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: StockTask['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'monitoring':
        return 'text-blue-600 bg-blue-100';
      case 'triggered':
        return 'text-orange-600 bg-orange-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: StockTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: StockTask['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  const filteredTasks = getFilteredTasks();
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    monitoring: tasks.filter(t => t.status === 'monitoring').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Stock Tasks</h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreator(true)}
            icon={Plus}
          >
            New Task
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', count: taskCounts.all },
            { key: 'pending', label: 'Pending', count: taskCounts.pending },
            { key: 'monitoring', label: 'Active', count: taskCounts.monitoring },
            { key: 'completed', label: 'Done', count: taskCounts.completed }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs opacity-75">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {filter !== 'all' ? filter : ''} tasks found</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreator(true)}
              className="mt-2"
            >
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg border-l-4 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getPriorityColor(task.priority)}`}
                onClick={() => setSelectedTask(selectedTask?.id === task.id ? undefined : task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-0.5">
                      {getTaskIcon(task)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {task.symbol}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      {task.companyName && (
                        <p className="text-xs text-gray-600 mb-1">{task.companyName}</p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {task.type === 'check_price' && 'Price monitoring'}
                        {task.type === 'buy_order' && `Buy ${task.quantity} shares`}
                        {task.type === 'sell_order' && `Sell ${task.quantity} shares`}
                        {task.targetPrice && ` at $${task.targetPrice}`}
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-1">
                        Created {task.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(showActions === task.id ? null : task.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showActions === task.id && (
                      <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, task.status === 'pending' ? 'monitoring' : 'pending');
                            setShowActions(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {task.status === 'pending' ? 'Start Monitoring' : 'Pause'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'completed');
                            setShowActions(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                            setShowActions(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expanded details */}
                {selectedTask?.id === task.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    {task.conditions && (
                      <div className="text-xs">
                        <div className="font-medium text-gray-700 mb-1">Alert Conditions:</div>
                        {task.conditions.priceAbove && (
                          <div className="text-gray-600">• Price above ${task.conditions.priceAbove}</div>
                        )}
                        {task.conditions.priceBelow && (
                          <div className="text-gray-600">• Price below ${task.conditions.priceBelow}</div>
                        )}
                        {task.conditions.percentageChange && (
                          <div className="text-gray-600">• {task.conditions.percentageChange}% change</div>
                        )}
                      </div>
                    )}
                    
                    {task.notes && (
                      <div className="text-xs">
                        <div className="font-medium text-gray-700 mb-1">Notes:</div>
                        <div className="text-gray-600">{task.notes}</div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Priority: {task.priority}</span>
                      <span>Alerts: {task.alertEnabled ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Creator Modal */}
      {showCreator && (
        <TaskCreator onClose={() => setShowCreator(false)} />
      )}
      
      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(null)}
        />
      )}
    </div>
  );
};