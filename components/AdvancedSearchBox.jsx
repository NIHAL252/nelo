import React, { useState, useRef, useEffect } from 'react';
import useElasticSearch from '../hooks/useElasticSearch';

/**
 * Advanced Search Component with Elasticsearch-style features
 * Provides:
 * - Debounced search input
 * - Auto-suggestions
 * - Search history
 * - Multiple match types
 * - Filter management
 * - Performance metrics
 */
const AdvancedSearchBox = ({
  tasks = [],
  onSearchChange,
  onResultsChange,
  debounceDelay = 300,
  matchType = 'substring',
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const inputRef = useRef(null);

  const {
    searchTerm,
    setSearchTerm,
    results,
    resultCount,
    searchTime,
    statistics,
    suggestions,
    searchHistory,
    clearSearch,
    clearHistory,
    isSearching,
  } = useElasticSearch(
    tasks,
    ['title', 'description'],
    {
      debounceDelay,
      matchType,
      rankResults: true,
    }
  );

  // Notify parent of results
  useEffect(() => {
    onResultsChange?.({
      results,
      count: resultCount,
      time: searchTime,
    });
  }, [results, resultCount, searchTime, onResultsChange]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleHistoryClick = (historyItem) => {
    setSearchTerm(historyItem);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    clearSearch();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="advanced-search-container">
      <div className="search-input-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="advanced-search-input"
            placeholder="Search tasks... (title, description)"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            aria-label="Advanced search input"
            aria-autocomplete="list"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={handleClear}
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button
            className="stats-toggle-btn"
            onClick={() => setShowStats(!showStats)}
            title="Show search statistics"
          >
            📊
          </button>
        </div>

        {/* Search Statistics */}
        {showStats && statistics.searched && (
          <div className="search-stats">
            <div className="stat-item">
              <span className="stat-label">Results:</span>
              <span className="stat-value">{resultCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{searchTime.toFixed(2)}ms</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Terms:</span>
              <span className="stat-value">{statistics.termsCount}</span>
            </div>
          </div>
        )}

        {/* Search Status */}
        {isSearching && (
          <p className="search-status">
            Found <strong>{resultCount}</strong> result{resultCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Suggestions and History Dropdown */}
      {showSuggestions && (searchTerm.length > 0 || searchHistory.length > 0) && (
        <div className="search-dropdown">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-header">💡 Suggestions</div>
              <div className="dropdown-items">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="dropdown-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="item-icon">✓</span>
                    <span className="item-text">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !isSearching && (
            <div className="dropdown-section">
              <div className="dropdown-header">
                ⏱️ Recent Searches
                {searchHistory.length > 0 && (
                  <button
                    className="clear-history-btn"
                    onClick={clearHistory}
                    title="Clear history"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="dropdown-items">
                {searchHistory.map((historyItem, idx) => (
                  <button
                    key={idx}
                    className="dropdown-item history-item"
                    onClick={() => handleHistoryClick(historyItem)}
                  >
                    <span className="item-icon">🕐</span>
                    <span className="item-text">{historyItem}</span>
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

export default AdvancedSearchBox;
