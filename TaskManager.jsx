import React, { useState, useEffect } from 'react';
import './TaskManager.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import EditModal from './components/EditModal';
import DeleteConfirmation from './components/DeleteConfirmation';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Create Task
  const handleAddTask = (formData) => {
    const newTask = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  // Open Edit Modal
  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // Save Edited Task
  const handleSaveEdit = (updatedData) => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, ...updatedData }
          : task
      )
    );
    setEditingTask(null);
    setShowModal(false);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowModal(false);
  };

  // Toggle Complete Status
  const handleToggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Open Delete Confirmation
  const handleDeleteClick = (taskId) => {
    setDeletingTaskId(taskId);
    setShowDeleteConfirm(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== deletingTaskId));
    setDeletingTaskId(null);
    setShowDeleteConfirm(false);
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    setDeletingTaskId(null);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1>📋 Task Manager</h1>
        <p className="task-count">{tasks.length} task(s)</p>
      </div>

      <div className="task-manager-content">
        <TaskForm onAddTask={handleAddTask} />
        <TaskList
          tasks={tasks}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onToggleComplete={handleToggleComplete}
        />
      </div>

      {showModal && editingTask && (
        <EditModal
          task={editingTask}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmation
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          taskTitle={tasks.find((t) => t.id === deletingTaskId)?.title}
        />
      )}
    </div>
  );
};

export default TaskManager;
