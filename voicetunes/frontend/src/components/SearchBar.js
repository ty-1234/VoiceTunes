import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  searchQuery, 
  onSearchQueryChange, 
  onSearch, 
  isConnected 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleClear = () => {
    onSearchQueryChange('');
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
      <h3 className="text-lg font-semibold mb-4 text-center">Or search manually</h3>
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type to search for music..."
            className="w-full px-4 py-3 pr-9 bg-white/20 rounded-xl border border-white/30 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all text-white placeholder-gray-300"
            data-testid="search-input"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              aria-label="Clear search"
              data-testid="clear-button"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          onClick={onSearch}
          disabled={!isConnected}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          data-testid="search-button"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;