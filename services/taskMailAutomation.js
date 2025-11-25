/**
 * Task Mail Automation Service
 * Simulates cron job that runs every 20 minutes to check pending tasks
 * and send mock email notifications
 */

class TaskMailAutomation {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.cronInterval = 20 * 60 * 1000; // 20 minutes in milliseconds
    this.emailLog = [];
    this.lastCheck = null;
  }

  /**
   * Start the automated mail service
   * @param {array} tasks - Array of tasks to monitor
   * @param {function} onEmailSent - Callback when email is sent
   * @param {number} customInterval - Custom interval in milliseconds (optional)
   */
  start(tasks, onEmailSent = null, customInterval = null) {
    if (this.isRunning) {
      console.warn('Task mail automation already running');
      return;
    }

    if (customInterval) {
      this.cronInterval = customInterval;
    }

    this.isRunning = true;
    this.lastCheck = new Date();

    // Run immediately first time
    this.checkAndNotify(tasks, onEmailSent);

    // Then run every interval
    this.intervalId = setInterval(() => {
      this.checkAndNotify(tasks, onEmailSent);
    }, this.cronInterval);

    console.log(`✉️ Task Mail Automation started (interval: ${this.cronInterval / 60000} minutes)`);
  }

  /**
   * Stop the automated mail service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('✉️ Task Mail Automation stopped');
  }

  /**
   * Check pending tasks and send notifications
   * @private
   */
  checkAndNotify(tasks, onEmailSent) {
    this.lastCheck = new Date();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      console.log('No tasks to check');
      return;
    }

    // Filter pending and overdue tasks
    const pendingTasks = tasks.filter(task => !task.completed);
    const overdueTasks = pendingTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.dueDate;
    });

    const dueSoonTasks = pendingTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
      return hoursUntilDue > 0 && hoursUntilDue <= 24;
    });

    const highPriorityTasks = pendingTasks.filter(task => task.priority === 'High');

    // Send emails for different categories
    if (overdueTasks.length > 0) {
      this.sendMockEmail({
        type: 'OVERDUE_TASKS',
        tasks: overdueTasks,
        subject: `⚠️ You have ${overdueTasks.length} overdue task(s)!`,
        priority: 'high',
      }, onEmailSent);
    }

    if (dueSoonTasks.length > 0) {
      this.sendMockEmail({
        type: 'DUE_SOON_TASKS',
        tasks: dueSoonTasks,
        subject: `📌 ${dueSoonTasks.length} task(s) due in the next 24 hours`,
        priority: 'medium',
      }, onEmailSent);
    }

    if (highPriorityTasks.length > 0 && pendingTasks.length > 5) {
      this.sendMockEmail({
        type: 'HIGH_PRIORITY_REMINDER',
        tasks: highPriorityTasks,
        subject: `🔴 ${highPriorityTasks.length} high priority task(s) pending`,
        priority: 'high',
      }, onEmailSent);
    }

    // Daily summary (if enough pending tasks)
    if (pendingTasks.length > 0 && Math.random() > 0.7) {
      this.sendMockEmail({
        type: 'DAILY_SUMMARY',
        tasks: pendingTasks,
        subject: `📊 Daily Task Summary - ${pendingTasks.length} pending task(s)`,
        priority: 'low',
      }, onEmailSent);
    }
  }

  /**
   * Send mock email notification
   * @private
   */
  sendMockEmail(emailData, onEmailSent) {
    const mockEmail = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      from: 'noreply@taskmanager.local',
      to: 'user@example.com', // Would come from user context in production
      ...emailData,
      body: this.generateEmailBody(emailData),
      status: 'sent',
    };

    this.emailLog.push(mockEmail);

    console.log('📧 Mock Email Sent:', {
      type: mockEmail.type,
      subject: mockEmail.subject,
      tasks: mockEmail.tasks.length,
      timestamp: mockEmail.timestamp,
    });

    // Trigger callback
    if (onEmailSent && typeof onEmailSent === 'function') {
      onEmailSent(mockEmail);
    }

    // Log to localStorage for persistence
    this.logEmailToStorage(mockEmail);

    return mockEmail;
  }

  /**
   * Generate HTML email body
   * @private
   */
  generateEmailBody(emailData) {
    const { type, tasks, subject } = emailData;
    const taskList = tasks
      .map(task => `
        <li style="margin-bottom: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
          <strong>${task.title}</strong> 
          <span style="color: #999; font-size: 0.9em;">${task.priority} Priority</span>
          ${task.dueDate ? `<br><small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small>` : ''}
          ${task.description ? `<br><small>${task.description}</small>` : ''}
        </li>
      `)
      .join('');

    return `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>${subject}</h2>
          <p>Hello User,</p>
          <p>${this.getEmailGreeting(type)}</p>
          <h3>Task Details:</h3>
          <ul style="list-style: none; padding: 0;">
            ${taskList}
          </ul>
          <p style="margin-top: 20px; color: #999; font-size: 0.9em;">
            This is an automated email from Task Manager. 
            Please login to your account to manage these tasks.
          </p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
          <footer style="font-size: 0.85em; color: #999;">
            Sent at: ${new Date().toLocaleString()}
          </footer>
        </body>
      </html>
    `;
  }

  /**
   * Get greeting message based on email type
   * @private
   */
  getEmailGreeting(type) {
    const greetings = {
      OVERDUE_TASKS: 'You have tasks that are past their due date. Please review and complete them as soon as possible.',
      DUE_SOON_TASKS: 'Some of your tasks are due in the next 24 hours. Make sure to prioritize them!',
      HIGH_PRIORITY_REMINDER: 'You have high priority tasks awaiting attention. Please review them.',
      DAILY_SUMMARY: 'Here is your daily task summary. Keep up the great work!',
    };
    return greetings[type] || 'Here are your task updates.';
  }

  /**
   * Log email to localStorage for persistence
   * @private
   */
  logEmailToStorage(email) {
    try {
      const emailLogs = JSON.parse(localStorage.getItem('taskEmailLogs') || '[]');
      emailLogs.push(email);
      // Keep only last 100 emails
      if (emailLogs.length > 100) {
        emailLogs.shift();
      }
      localStorage.setItem('taskEmailLogs', JSON.stringify(emailLogs));
    } catch (err) {
      console.error('Failed to log email to storage:', err);
    }
  }

  /**
   * Get all email logs
   */
  getEmailLogs() {
    try {
      return JSON.parse(localStorage.getItem('taskEmailLogs') || '[]');
    } catch (err) {
      console.error('Failed to retrieve email logs:', err);
      return [];
    }
  }

  /**
   * Get email logs for current session
   */
  getSessionEmailLogs() {
    return this.emailLog;
  }

  /**
   * Clear all email logs from storage
   */
  clearEmailLogs() {
    localStorage.removeItem('taskEmailLogs');
    this.emailLog = [];
    console.log('Email logs cleared');
  }

  /**
   * Get automation status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      cronInterval: this.cronInterval,
      intervalMinutes: this.cronInterval / 60000,
      lastCheck: this.lastCheck,
      sessionEmailsCount: this.emailLog.length,
      totalEmailsCount: this.getEmailLogs().length,
    };
  }

  /**
   * Manual trigger for testing
   */
  triggerNow(tasks, onEmailSent = null) {
    console.log('🔔 Manually triggering mail automation...');
    this.checkAndNotify(tasks, onEmailSent);
  }
}

// Export singleton instance
export const taskMailAutomation = new TaskMailAutomation();
export default taskMailAutomation;
