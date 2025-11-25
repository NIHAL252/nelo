import React from 'react';

const FilterBar = ({ activeFilter, onFilterChange, tasksCount }) => {
  const filters = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'pending', label: 'Pending', icon: '⏳' },
    { id: 'high', label: 'High Priority', icon: '🔴' },
    { id: 'medium', label: 'Medium Priority', icon: '🟠' },
    { id: 'low', label: 'Low Priority', icon: '🟢' },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-label">Filter by:</div>
      <div className="filter-buttons">
        {filters.map((filterItem) => (
          <button
            key={filterItem.id}
            className={`filter-btn ${activeFilter === filterItem.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filterItem.id)}
            title={filterItem.label}
          >
            <span className="filter-icon">{filterItem.icon}</span>
            <span className="filter-text">{filterItem.label}</span>
            {tasksCount && (
              <span className="filter-count">
                {filterItem.id === 'all'
                  ? tasksCount.all
                  : filterItem.id === 'completed'
                  ? tasksCount.completed
                  : filterItem.id === 'pending'
                  ? tasksCount.pending
                  : filterItem.id === 'high'
                  ? tasksCount.high
                  : filterItem.id === 'medium'
                  ? tasksCount.medium
                  : tasksCount.low}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
