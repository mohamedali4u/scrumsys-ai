import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Search, AlertTriangle, X } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useChatStore } from '../../stores/chatStore';
import type { StockTask } from '../../types/chat';

interface TaskCreatorProps {
  onClose: () => void;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onClose }) => {
  const { createTask, addMessage } = useChatStore();
  const [step, setStep] = useState(1);
  const [taskData, setTaskData] = useState<Partial<StockTask>>({
    type: 'check_price',
    status: 'pending',
    priority: 'medium',
    alertEnabled: true,
    conditions: {}
  });

  const handleCreateTask = () => {
    if (!taskData.symbol) return;

    const taskId = createTask({
      type: taskData.type!,
      symbol: taskData.symbol.toUpperCase(),
      companyName: taskData.companyName,
      quantity: taskData.quantity,
      targetPrice: taskData.targetPrice,
      orderType: taskData.orderType,
      status: taskData.status!,
      notes: taskData.notes,
      priority: taskData.priority!,
      alertEnabled: taskData.alertEnabled!,
      conditions: taskData.conditions
    });

    // Add a message about the created task
    const taskTypeText = {
      check_price: 'price monitoring',
      buy_order: 'buy order',
      sell_order: 'sell order'
    };

    addMessage({
      content: `I've created a ${taskTypeText[taskData.type!]} task for ${taskData.symbol?.toUpperCase()}. I'll monitor this stock and notify you when your conditions are met.`,
      role: 'assistant'
    });

    onClose();
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What would you like to do?</h3>
            <div className="grid gap-3">
              <button
                onClick={() => setTaskData({ ...taskData, type: 'check_price' })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  taskData.type === 'check_price'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Check Stock Price</div>
                    <div className="text-sm text-gray-500">Monitor a stock and get alerts on price changes</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTaskData({ ...taskData, type: 'buy_order' })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  taskData.type === 'buy_order'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Create Buy Order</div>
                    <div className="text-sm text-gray-500">Set up a buy order with specific conditions</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTaskData({ ...taskData, type: 'sell_order' })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  taskData.type === 'sell_order'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">Create Sell Order</div>
                    <div className="text-sm text-gray-500">Set up a sell order with specific conditions</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Stock Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Symbol *
                </label>
                <Input
                  placeholder="e.g., AAPL, TSLA, MSFT"
                  value={taskData.symbol || ''}
                  onChange={(value) => setTaskData({ ...taskData, symbol: value.toUpperCase() })}
                  className="uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name (Optional)
                </label>
                <Input
                  placeholder="e.g., Apple Inc."
                  value={taskData.companyName || ''}
                  onChange={(value) => setTaskData({ ...taskData, companyName: value })}
                />
              </div>

              {(taskData.type === 'buy_order' || taskData.type === 'sell_order') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <Input
                      placeholder="Number of shares"
                      value={taskData.quantity?.toString() || ''}
                      onChange={(value) => setTaskData({ ...taskData, quantity: parseInt(value) || undefined })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Type
                    </label>
                    <select
                      value={taskData.orderType || 'market'}
                      onChange={(e) => setTaskData({ ...taskData, orderType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="market">Market Order</option>
                      <option value="limit">Limit Order</option>
                      <option value="stop_loss">Stop Loss</option>
                    </select>
                  </div>

                  {taskData.orderType === 'limit' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Price *
                      </label>
                      <Input
                        placeholder="Price per share"
                        value={taskData.targetPrice?.toString() || ''}
                        onChange={(value) => setTaskData({ ...taskData, targetPrice: parseFloat(value) || undefined })}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Alert Conditions</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert when price goes above
                </label>
                <Input
                  placeholder="Price threshold"
                  value={taskData.conditions?.priceAbove?.toString() || ''}
                  onChange={(value) => setTaskData({
                    ...taskData,
                    conditions: {
                      ...taskData.conditions,
                      priceAbove: parseFloat(value) || undefined
                    }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert when price goes below
                </label>
                <Input
                  placeholder="Price threshold"
                  value={taskData.conditions?.priceBelow?.toString() || ''}
                  onChange={(value) => setTaskData({
                    ...taskData,
                    conditions: {
                      ...taskData.conditions,
                      priceBelow: parseFloat(value) || undefined
                    }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert on percentage change
                </label>
                <Input
                  placeholder="e.g., 5 for 5% change"
                  value={taskData.conditions?.percentageChange?.toString() || ''}
                  onChange={(value) => setTaskData({
                    ...taskData,
                    conditions: {
                      ...taskData.conditions,
                      percentageChange: parseFloat(value) || undefined
                    }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={taskData.priority || 'medium'}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Additional notes about this task..."
                  value={taskData.notes || ''}
                  onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="alertEnabled"
                  checked={taskData.alertEnabled}
                  onChange={(e) => setTaskData({ ...taskData, alertEnabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="alertEnabled" className="text-sm text-gray-700">
                  Enable alerts for this task
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return taskData.type;
      case 2:
        if (taskData.type === 'check_price') {
          return taskData.symbol;
        }
        return taskData.symbol && taskData.quantity;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const isLastStep = step === 3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Stock Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {getStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            >
              {step > 1 ? 'Previous' : 'Cancel'}
            </Button>

            <Button
              variant="primary"
              onClick={() => isLastStep ? handleCreateTask() : setStep(step + 1)}
              disabled={!canProceed()}
            >
              {isLastStep ? 'Create Task' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};