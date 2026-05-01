// src/components/Tasks/TaskDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../Common/StatusBadge';
import PriorityBadge from '../Common/PriorityBadge';
import { taskAPI, userAPI } from '../../services/api';
import { TASK_STATUS } from '../../utils/constants';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);

  // Load task data from data service
  useEffect(() => {
    fetchTaskData();
    fetchUsers();
  }, [id]);

  const fetchTaskData = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getById(parseInt(id));
      const taskData = response.data;
      setTask(taskData);
      setSelectedStatus(taskData.status);
      
      // Load comments from localStorage (if any)
      loadCommentsAndActivities(taskData.id);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const loadCommentsAndActivities = (taskId) => {
    // Load comments from localStorage
    const storedComments = localStorage.getItem(`task_comments_${taskId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments([]);
    }
    
    // Load activities from localStorage
    const storedActivities = localStorage.getItem(`task_activities_${taskId}`);
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      // Initialize with creation activity
      const initialActivities = [
        {
          id: 1,
          action: 'Task created',
          timestamp: new Date().toLocaleString(),
        }
      ];
      setActivities(initialActivities);
      localStorage.setItem(`task_activities_${taskId}`, JSON.stringify(initialActivities));
    }
  };

  const saveComments = (taskId, newComments) => {
    localStorage.setItem(`task_comments_${taskId}`, JSON.stringify(newComments));
  };

  const saveActivities = (taskId, newActivities) => {
    localStorage.setItem(`task_activities_${taskId}`, JSON.stringify(newActivities));
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === task.status) return;
    
    setUpdating(true);
    try {
      await taskAPI.updateStatus(task.id, selectedStatus);
      
      // Add activity log
      const newActivity = {
        id: activities.length + 1,
        action: `Status updated from ${task.status} to ${selectedStatus}`,
        timestamp: new Date().toLocaleString(),
      };
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      saveActivities(task.id, updatedActivities);
      
      // Update local task
      setTask({ ...task, status: selectedStatus });
      
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    // Get current user
    const userStr = localStorage.getItem('taskflow_user');
    const currentUser = userStr ? JSON.parse(userStr) : { name: 'User' };
    
    const comment = {
      id: comments.length + 1,
      user: currentUser.name,
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    saveComments(task.id, updatedComments);
    setNewComment('');
    
    // Add activity log
    const newActivity = {
      id: activities.length + 1,
      action: `Comment added by ${currentUser.name}`,
      timestamp: new Date().toLocaleString(),
    };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    saveActivities(task.id, updatedActivities);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const statusOptions = [
    { value: TASK_STATUS.PENDING, label: 'Pending' },
    { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: TASK_STATUS.COMPLETED, label: 'Completed' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex items-center space-x-3 mt-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
            
            {/* Add Comment */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.user}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Assigned To</label>
                <p className="text-gray-900 mt-1">{getUserName(task.assignedTo)}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Deadline</label>
                <p className="text-gray-900 mt-1">{task.deadline}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating || selectedStatus === task.status}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No activities yet</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;