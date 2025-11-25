import { useEffect, useRef } from 'react';

/**
 * Custom hook to monitor component render performance
 * Logs render time and helps identify performance bottlenecks
 * 
 * @param {string} componentName - Name of the component being monitored
 * @param {Object} deps - Dependencies to track
 * 
 * @example
 * usePerformance('SearchBox', { searchTerm, filter });
 */
const usePerformance = (componentName, deps = {}) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastRenderTimeRef.current;
    const renderTime = performance.now() - startTimeRef.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}`, {
        renderCount: renderCountRef.current,
        renderTime: `${renderTime.toFixed(2)}ms`,
        timeSinceLastRender: `${timeSinceLastRender}ms`,
        dependencies: deps,
      });
    }

    lastRenderTimeRef.current = currentTime;
  }, [componentName, deps]);

  return {
    renderCount: renderCountRef.current,
  };
};

export default usePerformance;
