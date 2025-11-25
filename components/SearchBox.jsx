import React, { useRef, useEffect } from 'react';
import { useDebounce } from '../hooks';

const SearchBox = ({ searchTerm, onSearchChange }) => {
  const inputRef = useRef(null);
  const debouncedTerm = useDebounce(searchTerm, 300);

  // Optional: You can use the debounced term for additional effects
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log debounced search for performance monitoring
      // console.log('Debounced search term:', debouncedTerm);
    }
  }, [debouncedTerm]);

  const handleClearSearch = () => {
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="search-box-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
        {searchTerm && (
          <button
            className="clear-search-btn"
            onClick={handleClearSearch}
            title="Clear search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {searchTerm && (
        <p className="search-hint">
          Searching for: <strong>"{searchTerm}"</strong>
          <span className="debounce-info"> (debouncing...)</span>
        </p>
      )}
    </div>
  );
};

export default SearchBox;
