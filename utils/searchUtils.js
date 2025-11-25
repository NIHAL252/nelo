/**
 * Elasticsearch-style search utilities
 * Provides advanced matching algorithms for flexible search
 */

/**
 * Exact match: Entire search term must match exactly
 * @param {string} text - Text to search in
 * @param {string} term - Search term
 * @returns {boolean} - True if exact match found
 */
export const exactMatch = (text, term) => {
  return text.toLowerCase() === term.toLowerCase();
};

/**
 * Substring match: Search term appears anywhere in text
 * @param {string} text - Text to search in
 * @param {string} term - Search term
 * @returns {boolean} - True if substring found
 */
export const substringMatch = (text, term) => {
  return text.toLowerCase().includes(term.toLowerCase());
};

/**
 * Word match: Search term matches whole words only
 * @param {string} text - Text to search in
 * @param {string} term - Search term
 * @returns {boolean} - True if word match found
 */
export const wordMatch = (text, term) => {
  const regex = new RegExp(`\\b${term}\\b`, 'gi');
  return regex.test(text);
};

/**
 * Fuzzy match: Allows typos and partial matching
 * @param {string} text - Text to search in
 * @param {string} term - Search term
 * @returns {number} - Match score (0-1), 0 = no match
 */
export const fuzzyMatch = (text, term) => {
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();

  if (lowerText === lowerTerm) return 1; // Exact match
  if (lowerText.includes(lowerTerm)) return 0.9; // Substring match
  if (wordMatch(text, term)) return 0.8; // Word match

  // Character-by-character matching for typos
  let matches = 0;
  let termIndex = 0;

  for (let i = 0; i < lowerText.length && termIndex < lowerTerm.length; i++) {
    if (lowerText[i] === lowerTerm[termIndex]) {
      matches++;
      termIndex++;
    }
  }

  return termIndex === lowerTerm.length ? matches / lowerText.length : 0;
};

/**
 * Prefix match: Search term matches the start of text
 * @param {string} text - Text to search in
 * @param {string} term - Search term
 * @returns {boolean} - True if prefix matches
 */
export const prefixMatch = (text, term) => {
  return text.toLowerCase().startsWith(term.toLowerCase());
};

/**
 * Multi-field search: Search across multiple fields
 * @param {object} item - Object to search in
 * @param {string} term - Search term
 * @param {array} fields - Fields to search (e.g., ['title', 'description'])
 * @param {string} matchType - Type of match: 'substring', 'fuzzy', 'word', 'prefix'
 * @returns {boolean|object} - True if match found, or object with details
 */
export const multiFieldSearch = (
  item,
  term,
  fields = [],
  matchType = 'substring'
) => {
  if (!term || !fields.length) return false;

  const matchFunction = {
    exact: exactMatch,
    substring: substringMatch,
    word: wordMatch,
    fuzzy: fuzzyMatch,
    prefix: prefixMatch,
  }[matchType] || substringMatch;

  for (const field of fields) {
    const value = item[field];
    if (value && typeof value === 'string') {
      if (matchType === 'fuzzy') {
        const score = matchFunction(value, term);
        if (score > 0.5) {
          return { match: true, field, score };
        }
      } else if (matchFunction(value, term)) {
        return { match: true, field };
      }
    }
  }

  return false;
};

/**
 * Parse search query into tokens
 * Handles quoted strings and operators
 * @param {string} query - Search query
 * @returns {array} - Array of search tokens
 */
export const parseSearchQuery = (query) => {
  const tokens = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens.filter(token => token.length > 0);
};

/**
 * Highlight search term in text
 * Returns JSX with highlighted portions
 * @param {string} text - Text to highlight
 * @param {string} term - Term to highlight
 * @param {string} highlightClass - CSS class for highlighting
 * @returns {array} - Array of text and spans for rendering
 */
export const highlightSearchTerm = (text, term, highlightClass = 'search-highlight') => {
  if (!text || !term) return [text];

  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const parts = [];
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerTerm);

  while (index !== -1) {
    // Add text before match
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index));
    }

    // Add highlighted match
    parts.push({
      text: text.substring(index, index + lowerTerm.length),
      highlighted: true,
    });

    lastIndex = index + lowerTerm.length;
    index = lowerText.indexOf(lowerTerm, lastIndex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

/**
 * Score search results for ranking
 * @param {object} item - Item to score
 * @param {string} term - Search term
 * @param {array} searchFields - Fields to consider
 * @returns {number} - Score for ranking (higher = better match)
 */
export const scoreSearchResult = (item, term, searchFields = []) => {
  if (!term) return 0;

  let score = 0;
  const lowerTerm = term.toLowerCase();

  // Bonus for exact field matches
  for (const field of searchFields) {
    const value = item[field];
    if (!value || typeof value !== 'string') continue;

    const lowerValue = value.toLowerCase();

    // Exact match: +100
    if (lowerValue === lowerTerm) {
      score += 100;
    }
    // Starts with: +75
    else if (lowerValue.startsWith(lowerTerm)) {
      score += 75;
    }
    // Contains: +50
    else if (lowerValue.includes(lowerTerm)) {
      score += 50;
    }
    // Word match: +25
    else if (wordMatch(value, term)) {
      score += 25;
    }
  }

  return score;
};

export default {
  exactMatch,
  substringMatch,
  wordMatch,
  fuzzyMatch,
  prefixMatch,
  multiFieldSearch,
  parseSearchQuery,
  highlightSearchTerm,
  scoreSearchResult,
};
