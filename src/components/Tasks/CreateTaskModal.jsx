// src/components/Tasks/CreateTaskModal.jsx
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'MEDIUM',
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch real users from data service when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userAPI.getAll();
      // Filter only ACTIVE users
      const activeUsers = (response.data || []).filter(user => user.status === 'ACTIVE');
      setUsers(activeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Please select a user';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const selectedUser = users.find(u => u.id === parseInt(formData.assignedTo));
      const newTask = {
        title: formData.title,
        description: formData.description,
        assignedTo: parseInt(formData.assignedTo),
        priority: formData.priority,
        deadline: formData.deadline,
      };
      
      console.log('Email would be sent to:', selectedUser?.email);
      console.log('New Task Created:', newTask);
      
      onTaskCreated(newTask);
      onClose();
      setLoading(false);
      
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'MEDIUM',
        deadline: '',
      });
    }, 500);
  };

  if (!isOpen) return null;

  const selectedUser = users.find(u => u.id === parseInt(formData.assignedTo));

  return (
    <>
      {/* Backdrop with blur only - NO BLACK BACKGROUND */}
      <div 
        className="fixed inset-0 backdrop-blur-md bg-white/30 z-40 transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container - Centered with flex */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg animate-slide-up">
          {/* Glass Card Modal */}
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200/50">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Create New Task
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Fill in the details to assign a new task</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body - Reduced padding */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter task title"
                  autoFocus
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Describe the task in detail..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To <span className="text-red-500">*</span>
                </label>
                {loadingUsers ? (
                  <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Loading users...</span>
                  </div>
                ) : (
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.assignedTo ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a team member</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
                {errors.assignedTo && <p className="mt-1 text-xs text-red-600">{errors.assignedTo}</p>}
                
                {selectedUser && (
                  <div className="mt-2 p-2 bg-blue-50/80 rounded-xl border border-blue-200/50">
                    <p className="text-xs text-blue-700 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email notification will be sent to: {selectedUser.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Priority and Deadline - 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🔴 High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      errors.deadline ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.deadline && <p className="mt-1 text-xs text-red-600">{errors.deadline}</p>}
                </div>
              </div>

              {/* Info Note - Smaller */}
              <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <p className="text-xs text-gray-500 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  The assigned user will receive an email notification immediately after task creation.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-1 disabled:opacity-50 shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;