// src/components/Projects/AddMemberModal.jsx
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

const AddMemberModal = ({ isOpen, onClose, onAddMember, currentMembers }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const user = availableUsers.find(u => u.email === email);
    
    if (!user) {
      setError('User not found. Please enter a valid email address.');
      return;
    }
    
    if (currentMembers.find(m => m.email === email)) {
      setError('User is already a member of this project');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      onAddMember(user);
      setEmail('');
      setLoading(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Team Member</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {loadingUsers ? (
              <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 mb-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Loading users...</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  list="user-emails"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                  required
                  autoFocus
                />
                <datalist id="user-emails">
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.email}>{user.name} ({user.role})</option>
                  ))}
                </datalist>
              </>
            )}
            
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || loadingUsers} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
          
          {availableUsers.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Available team members:</p>
              <div className="flex flex-wrap gap-1">
                {availableUsers.slice(0, 5).map(user => (
                  <span key={user.id} className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                    {user.name}
                  </span>
                ))}
                {availableUsers.length > 5 && (
                  <span className="text-xs text-gray-400">+{availableUsers.length - 5} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddMemberModal;