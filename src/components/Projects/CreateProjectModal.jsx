// src/components/Projects/CreateProjectModal.jsx
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberList, setMemberList] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch real users from data service when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userAPI.getAll();
      // Filter only ACTIVE users
      const activeUsers = (response.data || []).filter(user => user.status === 'ACTIVE');
      setAvailableUsers(activeUsers);
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

  const addMember = () => {
    if (!memberEmail.trim()) return;
    const user = availableUsers.find(u => u.email === memberEmail);
    if (user && !memberList.find(m => m.id === user.id)) {
      setMemberList([...memberList, user]);
      setMemberEmail('');
      setErrors(prev => ({ ...prev, members: '' }));
    } else {
      setErrors(prev => ({ ...prev, members: 'User not found or already added' }));
    }
  };

  const removeMember = (userId) => {
    setMemberList(memberList.filter(m => m.id !== userId));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
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
    
    setTimeout(() => {
      // Get current logged-in user (manager) to add as default member
      const currentUserStr = localStorage.getItem('taskflow_user');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      
      // Create members list with user IDs only
      const memberIds = memberList.map(m => m.id);
      
      // Add current manager if not already in list
      if (currentUser && !memberIds.includes(currentUser.id)) {
        memberIds.push(currentUser.id);
      }
      
      const newProject = {
        name: formData.name,
        description: formData.description,
        members: memberIds,
      };
      
      console.log('Project created:', newProject);
      console.log('Email notifications sent to:', memberList.map(m => m.email));
      
      onProjectCreated(newProject);
      onClose();
      setLoading(false);
      
      setFormData({ name: '', description: '', members: [] });
      setMemberList([]);
      setMemberEmail('');
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 backdrop-blur-md bg-white/30 z-40 transition-all duration-300"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg animate-slide-up">
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200/50">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Create New Project
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Create a project and add team members</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter project name"
                  autoFocus
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Describe the project..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Team Members
                </label>
                {loadingUsers ? (
                  <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Loading users...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Enter email address"
                        list="user-emails"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <datalist id="user-emails">
                        {availableUsers.map(user => (
                          <option key={user.id} value={user.email}>{user.name}</option>
                        ))}
                      </datalist>
                      <button
                        type="button"
                        onClick={addMember}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {errors.members && <p className="mt-1 text-xs text-red-600">{errors.members}</p>}
                    
                    {memberList.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 mb-1">Selected members:</p>
                        {memberList.map(member => (
                          <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm">{member.name} ({member.email})</span>
                            <button
                              type="button"
                              onClick={() => removeMember(member.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200/50">
                <p className="text-xs text-blue-700 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Team members will receive an email notification when added to this project.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm hover:bg-gray-50"
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
                      <span>Create Project</span>
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

export default CreateProjectModal;