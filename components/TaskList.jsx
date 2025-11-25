import React from 'react';

const TaskList = ({ tasks, onEditClick, onDeleteClick, onToggleComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate, completed) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <section className="tasks-section">
      <h2>📝 Your Tasks</h2>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add one using the form above!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card card ${task.completed ? 'completed' : ''} ${
                isOverdue(task.dueDate, task.completed) ? 'overdue' : ''
              }`}
            >
              <div className="task-header">
                <div className="task-title-section">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    className="task-checkbox"
                    aria-label={`Mark "${task.title}" as ${
                      task.completed ? 'pending' : 'complete'
                    }`}
                  />
                  <div className="task-title-content">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                  </div>
                </div>
                <div className="task-badges">
                  <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.completed && <span className="badge badge-completed">✓ Done</span>}
                  {isOverdue(task.dueDate, task.completed) && (
                    <span className="badge badge-overdue">⚠ Overdue</span>
                  )}
                </div>
              </div>

              <div className="task-footer">
                <div className="task-meta">
                  <span className="due-date">
                    📅 {formatDate(task.dueDate)}
                  </span>
                </div>
                <div className="task-actions">
                  <button
                    className="btn btn-sm btn-edit"
                    onClick={() => onEditClick(task)}
                    title="Edit task"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => onDeleteClick(task.id)}
                    title="Delete task"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
