import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TaskManager.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import EditModal from './components/EditModal';
import DeleteConfirmation from './components/DeleteConfirmation';
import FilterBar from './components/FilterBar';
import SearchBox from './components/SearchBox';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, pending, high, medium, low
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimerRef = useRef(null);

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

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchTerm]);

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

  // Filter and search logic
  const getFilteredTasks = useCallback(() => {
    let filtered = tasks;

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter((task) => {
        const searchableText = `${task.title} ${task.description}`.toLowerCase();
        return searchableText.includes(debouncedSearchTerm);
      });
    }

    // Apply status and priority filters
    if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (['high', 'medium', 'low'].includes(filter)) {
      filtered = filtered.filter((task) => task.priority === filter);
    }

    return filtered;
  }, [tasks, debouncedSearchTerm, filter]);

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1>📋 Task Manager</h1>
        <p className="task-count">{filteredTasks.length} of {tasks.length} task(s)</p>
      </div>

      <div className="task-manager-content">
        <TaskForm onAddTask={handleAddTask} />
        
        <div className="filters-and-search">
          <SearchBox 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
          />
          <FilterBar 
            activeFilter={filter}
            onFilterChange={setFilter}
            tasksCount={{
              all: tasks.length,
              completed: tasks.filter(t => t.completed).length,
              pending: tasks.filter(t => !t.completed).length,
              high: tasks.filter(t => t.priority === 'high').length,
              medium: tasks.filter(t => t.priority === 'medium').length,
              low: tasks.filter(t => t.priority === 'low').length,
            }}
          />
        </div>

        <TaskList
          tasks={filteredTasks}
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
