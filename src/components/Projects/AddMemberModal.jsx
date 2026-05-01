// src/components/Projects/AddMemberModal.jsx
import React, { useState } from 'react';

const AddMemberModal = ({ isOpen, onClose, onAddMember, currentMembers }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock available users - replace with API call
  const availableUsers = [
    { id: 1, name: 'John Doe', email: 'john@taskflow.com', role: 'USER' },
    { id: 2, name: 'Jane Smith', email: 'jane@taskflow.com', role: 'USER' },
    { id: 3, name: 'Mike Johnson', email: 'mike@taskflow.com', role: 'USER' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@taskflow.com', role: 'USER' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const user = availableUsers.find(u => u.email === email);
    
    if (!user) {
      setError('User not found');
      return;
    }
    
    if (currentMembers.find(m => m.email === email)) {
      setError('User already in project');
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3"
              required
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Available users: {availableUsers.map(u => u.email).join(', ')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMemberModal;