import React from 'react';

const SearchBox = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-box-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
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
            onClick={() => onSearchChange('')}
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
        </p>
      )}
    </div>
  );
};

export default SearchBox;
