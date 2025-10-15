import React, { useState } from 'react';
import { Search, Filter, Tag, Folder, X } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import DataService from '../../services/dataService';
import { useChatStore } from '../../stores/chatStore';

export const SearchAndFilter: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    groups,
    currentGroup,
    setCurrentGroup
  } = useChatStore();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const dataService = React.useMemo(() => new DataService(), []);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await dataService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [dataService]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setCurrentGroup(undefined);
  };

  const hasActiveFilters = searchQuery || selectedCategory || currentGroup;

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-3 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search messages and tags..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="pl-10 pr-10 bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-600"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
              {[searchQuery, selectedCategory, currentGroup].filter(Boolean).length}
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          {/* Categories */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              <Tag className="w-3 h-3 inline mr-1" />
              Categories
            </label>
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? undefined : category.id
                  )}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategory === category.id
                      ? 'border-transparent text-white'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Groups */}
          {groups.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <Folder className="w-3 h-3 inline mr-1" />
                Groups
              </label>
              <div className="flex flex-wrap gap-1">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setCurrentGroup(
                      currentGroup === group.id ? undefined : group.id
                    )}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      currentGroup === group.id
                        ? 'border-transparent text-white'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: currentGroup === group.id ? group.color : 'transparent'
                    }}
                  >
                    {group.name}
                    <span className="ml-1 opacity-75">({group.messageCount})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};