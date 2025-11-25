import { useEffect, useCallback, useState } from 'react';
import taskMailAutomation from '../services/taskMailAutomation';

/**
 * Custom hook for task mail automation
 * Manages the lifecycle of mail automation service
 */
export const useTaskMailAutomation = (tasks, onEmailSent = null, enableAutomation = true) => {
  const [automationStatus, setAutomationStatus] = useState({
    isRunning: false,
    lastCheck: null,
    emailsCount: 0,
  });

  // Start automation on mount or when tasks change
  useEffect(() => {
    if (!enableAutomation) return;

    const startAutomation = () => {
      taskMailAutomation.start(
        tasks,
        (email) => {
          // Update status
          setAutomationStatus({
            isRunning: true,
            lastCheck: email.timestamp,
            emailsCount: taskMailAutomation.getSessionEmailLogs().length,
          });

          // Trigger callback
          if (onEmailSent) {
            onEmailSent(email);
          }
        },
        // For development, use 2 minutes instead of 20
        process.env.NODE_ENV === 'development' ? 2 * 60 * 1000 : 20 * 60 * 1000
      );
    };

    if (!taskMailAutomation.isRunning) {
      startAutomation();
    }

    // Cleanup on unmount
    return () => {
      // Don't stop automation here - let it continue in background
      // taskMailAutomation.stop();
    };
  }, [enableAutomation]);

  const stopAutomation = useCallback(() => {
    taskMailAutomation.stop();
    setAutomationStatus({ ...automationStatus, isRunning: false });
  }, [automationStatus]);

  const triggerManual = useCallback(() => {
    taskMailAutomation.triggerNow(tasks, onEmailSent);
  }, [tasks, onEmailSent]);

  const getEmailLogs = useCallback(() => {
    return taskMailAutomation.getSessionEmailLogs();
  }, []);

  const getStatus = useCallback(() => {
    return taskMailAutomation.getStatus();
  }, []);

  return {
    automationStatus,
    stopAutomation,
    triggerManual,
    getEmailLogs,
    getStatus,
  };
};

export default useTaskMailAutomation;
