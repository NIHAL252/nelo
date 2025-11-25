import { useState, useCallback, useMemo } from 'react';
import useDebounce from './useDebounce';

/**
 * Custom hook for search and filter functionality with debouncing
 * Optimizes re-renders and provides filtered task results
 * 
 * @param {Array} tasks - Array of tasks to search/filter
 * @param {number} debounceDelay - Debounce delay in milliseconds (default: 300ms)
 * @returns {Object} - Object containing search state, filter state, and filtered tasks
 * 
 * @example
 * const { 
 *   searchTerm, 
 *   setSearchTerm, 
 *   filter, 
 *   setFilter, 
 *   filteredTasks,
 *   taskCounts
 * } = useSearch(tasks);
 */
const useSearch = (tasks, debounceDelay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm.toLowerCase(), debounceDelay);

  // Memoized filter and search logic
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply search filter
    if (debouncedSearchTerm) {
      result = result.filter((task) => {
        const searchableText = `${task.title} ${task.description}`.toLowerCase();
        return searchableText.includes(debouncedSearchTerm);
      });
    }

    // Apply status and priority filters
    if (filter === 'completed') {
      result = result.filter((task) => task.completed);
    } else if (filter === 'pending') {
      result = result.filter((task) => !task.completed);
    } else if (['high', 'medium', 'low'].includes(filter)) {
      result = result.filter((task) => task.priority === filter);
    }

    return result;
  }, [tasks, debouncedSearchTerm, filter]);

  // Memoized task counts for filter badges
  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    };
  }, [tasks]);

  // Callback to clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Callback to clear filters
  const clearFilters = useCallback(() => {
    setFilter('all');
  }, []);

  // Callback to reset all search and filters
  const resetAll = useCallback(() => {
    setSearchTerm('');
    setFilter('all');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    filteredTasks,
    taskCounts,
    clearSearch,
    clearFilters,
    resetAll,
    isSearching: searchTerm.length > 0,
    isFiltering: filter !== 'all',
  };
};

export default useSearch;
