import React, { useState, useEffect } from 'react';
import taskMailAutomation from '../services/taskMailAutomation';

const EmailNotifications = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [automationStatus, setAutomationStatus] = useState(null);
  const [expandedEmail, setExpandedEmail] = useState(null);

  useEffect(() => {
    // Initial load
    updateEmailLogs();
    updateStatus();

    // Refresh logs periodically
    const interval = setInterval(() => {
      updateEmailLogs();
      updateStatus();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const updateEmailLogs = () => {
    const logs = taskMailAutomation.getSessionEmailLogs();
    setEmailLogs(logs);
  };

  const updateStatus = () => {
    const status = taskMailAutomation.getStatus();
    setAutomationStatus(status);
  };

  const triggerManualCheck = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    taskMailAutomation.triggerNow(tasks);
    setTimeout(updateEmailLogs, 500);
  };

  const getEmailIcon = (type) => {
    const icons = {
      OVERDUE_TASKS: '⚠️',
      DUE_SOON_TASKS: '📌',
      HIGH_PRIORITY_REMINDER: '🔴',
      DAILY_SUMMARY: '📊',
    };
    return icons[type] || '📧';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    };
    return colors[priority] || '#6b7280';
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="email-notifications-container">
      <div className="email-notifications-header">
        <button
          className="btn-email-toggle"
          onClick={() => setShowLogs(!showLogs)}
          title="Toggle Email Notifications Panel"
        >
          📧 Email Notifications {emailLogs.length > 0 && `(${emailLogs.length})`}
        </button>

        <div className="automation-controls">
          <button
            className="btn-trigger-email"
            onClick={triggerManualCheck}
            title="Manually trigger email check now"
          >
            🔔 Check Now
          </button>
        </div>
      </div>

      {showLogs && (
        <div className="email-notifications-panel">
          {automationStatus && (
            <div className="automation-status">
              <div className="status-row">
                <span className="status-label">Status:</span>
                <span className={`status-value ${automationStatus.isRunning ? 'active' : 'inactive'}`}>
                  {automationStatus.isRunning ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
              <div className="status-row">
                <span className="status-label">Interval:</span>
                <span className="status-value">{automationStatus.intervalMinutes} minutes</span>
              </div>
              <div className="status-row">
                <span className="status-label">Last Check:</span>
                <span className="status-value">
                  {automationStatus.lastCheck
                    ? formatTime(automationStatus.lastCheck)
                    : 'Never'}
                </span>
              </div>
              <div className="status-row">
                <span className="status-label">Emails Sent:</span>
                <span className="status-value">{automationStatus.sessionEmailsCount}</span>
              </div>
            </div>
          )}

          <div className="emails-list">
            {emailLogs.length === 0 ? (
              <div className="no-emails">
                <p>No emails sent yet</p>
                <small>Emails will appear here as they are sent</small>
              </div>
            ) : (
              emailLogs
                .slice()
                .reverse()
                .map((email) => (
                  <div
                    key={email.id}
                    className="email-item"
                    onClick={() =>
                      setExpandedEmail(expandedEmail === email.id ? null : email.id)
                    }
                  >
                    <div className="email-header">
                      <div className="email-subject">
                        <span className="email-icon">{getEmailIcon(email.type)}</span>
                        <span className="email-subject-text">{email.subject}</span>
                        <span
                          className="email-priority"
                          style={{ backgroundColor: getPriorityColor(email.priority) }}
                        >
                          {email.priority}
                        </span>
                      </div>
                      <span className="email-time">{formatTime(email.timestamp)}</span>
                    </div>

                    {expandedEmail === email.id && (
                      <div className="email-details">
                        <div className="detail-row">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{email.type}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">From:</span>
                          <span className="detail-value">{email.from}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">To:</span>
                          <span className="detail-value">{email.to}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Timestamp:</span>
                          <span className="detail-value">{email.timestamp}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Status:</span>
                          <span className="detail-value status-sent">✅ {email.status}</span>
                        </div>

                        <div className="tasks-in-email">
                          <h4>Tasks in Email:</h4>
                          <ul>
                            {email.tasks.map((task) => (
                              <li key={task.id} className="task-item">
                                <div className="task-info">
                                  <strong>{task.title}</strong>
                                  <span
                                    className="task-priority"
                                    style={{
                                      backgroundColor: getPriorityColor(task.priority.toLowerCase()),
                                    }}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                                {task.description && (
                                  <small className="task-desc">{task.description}</small>
                                )}
                                {task.dueDate && (
                                  <small className="task-due">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </small>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailNotifications;
