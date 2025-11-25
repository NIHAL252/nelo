import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to monitor session expiry and handle automatic logout
 * @param {number} warningThresholdMinutes - Show warning when time remaining is below this threshold
 * @param {function} onWarning - Callback when session is about to expire
 */
export const useSessionMonitor = (warningThresholdMinutes = 5, onWarning = null) => {
  const { getSessionInfo, logout, isSessionActive } = useAuth();

  useEffect(() => {
    if (!isSessionActive()) return;

    const checkSession = setInterval(() => {
      const sessionInfo = getSessionInfo();
      
      if (!sessionInfo) {
        logout();
        return;
      }

      if (sessionInfo.isExpired) {
        logout();
        if (onWarning) {
          onWarning('Session expired. Please login again.');
        }
      } else if (sessionInfo.timeRemainingMinutes < warningThresholdMinutes) {
        if (onWarning) {
          onWarning(`Your session will expire in ${sessionInfo.timeRemainingMinutes} minutes`);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkSession);
  }, [warningThresholdMinutes, onWarning, logout, isSessionActive, getSessionInfo]);
};

/**
 * Custom hook to format and track session timing
 * @returns {object} Session timing info
 */
export const useSessionTiming = () => {
  const { getSessionInfo } = useAuth();

  const formatTimeRemaining = useCallback(() => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return 'No active session';

    const { timeRemainingMinutes, isExpired } = sessionInfo;
    
    if (isExpired) {
      return 'Session Expired';
    }

    const hours = Math.floor(timeRemainingMinutes / 60);
    const minutes = timeRemainingMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  }, [getSessionInfo]);

  return {
    timeRemaining: formatTimeRemaining(),
    sessionInfo: getSessionInfo(),
    isSessionActive: getSessionInfo() !== null && !getSessionInfo().isExpired,
  };
};

export default useSessionMonitor;
