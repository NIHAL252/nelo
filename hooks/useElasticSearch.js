import { useState, useMemo, useCallback } from 'react';
import useDebounce from './useDebounce';
import {
  multiFieldSearch,
  scoreSearchResult,
  parseSearchQuery,
} from '../utils/searchUtils';

/**
 * Elasticsearch-style search hook
 * Implements advanced search workflow:
 * Input → Debounce → Filter local data → Rank results → Render
 *
 * @param {Array} data - Array of items to search
 * @param {Array} searchFields - Fields to search (e.g., ['title', 'description'])
 * @param {Object} options - Configuration options
 * @returns {Object} - Search state and utilities
 *
 * @example
 * const {
 *   searchTerm,
 *   setSearchTerm,
 *   results,
 *   resultCount,
 *   searchTime,
 *   filters,
 * } = useElasticSearch(tasks, ['title', 'description'], {
 *   debounceDelay: 300,
 *   matchType: 'substring',
 *   rankResults: true,
 * });
 */
const useElasticSearch = (
  data = [],
  searchFields = [],
  options = {}
) => {
  const {
    debounceDelay = 300,
    matchType = 'substring', // 'exact', 'substring', 'word', 'fuzzy', 'prefix'
    rankResults = true,
    maxResults = null,
    caseInsensitive = true,
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'recent', 'name'

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Main search and filter logic
  const { results, resultCount, searchTime, statistics } = useMemo(() => {
    const startTime = performance.now();

    if (!debouncedSearchTerm && appliedFilters.length === 0) {
      return {
        results: data,
        resultCount: data.length,
        searchTime: 0,
        statistics: {
          searched: false,
          termsCount: 0,
        },
      };
    }

    let filtered = [...data];

    // Parse search query into tokens
    const searchTokens = parseSearchQuery(debouncedSearchTerm);

    // Apply search filters
    if (debouncedSearchTerm && searchFields.length > 0) {
      filtered = filtered.filter((item) => {
        // All tokens must match (AND logic)
        return searchTokens.every((token) =>
          multiFieldSearch(item, token, searchFields, matchType)
        );
      });

      // Score and rank results
      if (rankResults) {
        filtered = filtered.map((item) => ({
          ...item,
          _searchScore: scoreSearchResult(item, debouncedSearchTerm, searchFields),
        }));

        filtered.sort((a, b) => b._searchScore - a._searchScore);
      }
    }

    // Apply additional filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((item) =>
        appliedFilters.every((filter) => {
          if (filter.type === 'status' && filter.value !== undefined) {
            return item.completed === filter.value;
          }
          if (filter.type === 'priority' && filter.value) {
            return item.priority === filter.value;
          }
          if (filter.type === 'dueDate' && filter.value) {
            const itemDate = new Date(item.dueDate).toDateString();
            const filterDate = new Date(filter.value).toDateString();
            return itemDate === filterDate;
          }
          return true;
        })
      );
    }

    // Sort results
    if (sortBy === 'name' && searchFields.includes('title')) {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply max results limit
    if (maxResults && filtered.length > maxResults) {
      filtered = filtered.slice(0, maxResults);
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      results: filtered,
      resultCount: filtered.length,
      searchTime: executionTime,
      statistics: {
        searched: true,
        termsCount: searchTokens.length,
        tokensUsed: searchTokens,
      },
    };
  }, [
    data,
    debouncedSearchTerm,
    appliedFilters,
    searchFields,
    matchType,
    rankResults,
    sortBy,
    maxResults,
  ]);

  // Add search to history
  const addToSearchHistory = useCallback(() => {
    if (debouncedSearchTerm && !searchHistory.includes(debouncedSearchTerm)) {
      setSearchHistory((prev) => [debouncedSearchTerm, ...prev.slice(0, 9)]);
    }
  }, [debouncedSearchTerm, searchHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Add filter
  const addFilter = useCallback((filter) => {
    setAppliedFilters((prev) => [...prev, filter]);
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterIndex) => {
    setAppliedFilters((prev) => prev.filter((_, i) => i !== filterIndex));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setAppliedFilters([]);
  }, []);

  // Get search suggestions based on current term
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const uniqueMatches = new Set();
    const maxSuggestions = 5;

    for (const field of searchFields) {
      for (const item of data) {
        if (uniqueMatches.size >= maxSuggestions) break;

        const fieldValue = item[field];
        if (fieldValue && typeof fieldValue === 'string') {
          const lowerField = fieldValue.toLowerCase();
          const lowerTerm = searchTerm.toLowerCase();

          if (lowerField.includes(lowerTerm)) {
            uniqueMatches.add(fieldValue);
          }
        }
      }
      if (uniqueMatches.size >= maxSuggestions) break;
    }

    return Array.from(uniqueMatches).slice(0, maxSuggestions);
  }, [searchTerm, data, searchFields]);

  return {
    // Search input
    searchTerm,
    setSearchTerm,

    // Results
    results,
    resultCount,
    searchTime,
    statistics,

    // History
    searchHistory,
    addToSearchHistory,
    clearHistory,

    // Filters
    appliedFilters,
    addFilter,
    removeFilter,
    clearFilters,

    // Sorting
    sortBy,
    setSortBy,

    // Utilities
    clearSearch,
    suggestions,

    // Status flags
    isSearching: searchTerm.length > 0,
    hasFilters: appliedFilters.length > 0,
    hasResults: resultCount > 0,
  };
};

export default useElasticSearch;
