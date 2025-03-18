import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [input, setInput] = useState(''); // State for input field
  const [editTaskId, setEditTaskId] = useState(null); // State for editing task
  const [editedTitle, setEditedTitle] = useState(''); // State for edited title
  const [filter, setFilter] = useState('all'); // Filter state: 'all', 'completed', 'pending'
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (input.trim() !== '') {
      setLoading(true);
      try {
        await axios.post('http://localhost:5000/tasks', { title: input });
        setInput('');
        fetchTasks();
        toast.success('Task added successfully!');
      } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Edit a task title
  const editTask = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { title: editedTitle });
      setEditTaskId(null);
      setEditedTitle('');
      fetchTasks();
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (id, completed) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks(); // Refresh the task list
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Manager</h1>

      {/* Input Field and Add Button */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
          style={{
            padding: '8px',
            flexGrow: 1,
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={addTask}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            background: filter === 'all' ? '#007bff' : '#f0f0f0',
            color: filter === 'all' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '8px 16px',
            background: filter === 'completed' ? '#007bff' : '#f0f0f0',
            color: filter === 'completed' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 16px',
            background: filter === 'pending' ? '#007bff' : '#f0f0f0',
            color: filter === 'pending' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Pending
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: task.completed ? '#e6ffe6' : '#fff',
              }}
            >
              {/* Checkbox for Task Completion */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
                style={{ marginRight: '10px' }}
              />

              {/* Task Title or Edit Input */}
              {editTaskId === task.id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => editTask(task.id)}
                  onKeyDown={(e) => e.key === 'Enter' && editTask(task.id)}
                  autoFocus
                  style={{
                    flexGrow: 1,
                    padding: '4px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <span
                  style={{
                    flexGrow: 1,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                  }}
                  onDoubleClick={() => {
                    setEditTaskId(task.id);
                    setEditedTitle(task.title);
                  }}
                >
                  {task.title}
                </span>
              )}

              {/* Delete Button */}
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  padding: '4px 8px',
                  background: '#ff4d4d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;