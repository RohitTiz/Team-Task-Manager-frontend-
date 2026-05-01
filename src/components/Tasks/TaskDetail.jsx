import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../Common/StatusBadge';
import PriorityBadge from '../Common/PriorityBadge';
import { TASK_STATUS } from '../../utils/constants';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    id: id,
    title: 'Fix Login Authentication Bug',
    description: 'The login API endpoint is not responding properly. Users are unable to sign in to the application. Need to investigate and fix the authentication flow.',
    assignedTo: 'John Doe',
    deadline: '2024-05-12',
    priority: 'HIGH',
    status: 'PENDING',
    comments: [
      { id: 1, user: 'Jane Smith', text: 'I think the issue might be with the JWT token generation', timestamp: '2024-05-10 10:30 AM' },
      { id: 2, user: 'John Doe', text: 'Checking the authentication service now', timestamp: '2024-05-10 11:15 AM' },
    ],
    activities: [
      { id: 1, action: 'Task created by Manager', timestamp: '2024-05-09 09:00 AM' },
      { id: 2, action: 'Assigned to John Doe', timestamp: '2024-05-09 09:00 AM' },
      { id: 3, action: 'Status updated to In Progress', timestamp: '2024-05-10 11:20 AM' },
    ],
  });
  
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(task.status);

  const handleStatusUpdate = () => {
    setTask({ ...task, status: selectedStatus });
    // Add activity log
    const newActivity = {
      id: task.activities.length + 1,
      action: `Status updated to ${selectedStatus}`,
      timestamp: new Date().toLocaleString(),
    };
    setTask({ ...task, status: selectedStatus, activities: [...task.activities, newActivity] });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: task.comments.length + 1,
      user: 'Current User',
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };
    
    setTask({ ...task, comments: [...task.comments, comment] });
    setNewComment('');
    
    // Add activity log
    const newActivity = {
      id: task.activities.length + 1,
      action: 'Comment added',
      timestamp: new Date().toLocaleString(),
    };
    setTask({ ...task, activities: [...task.activities, newActivity] });
  };

  const statusOptions = [
    { value: TASK_STATUS.PENDING, label: 'Pending' },
    { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: TASK_STATUS.COMPLETED, label: 'Completed' },
  ];

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
              {task.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
              ))}
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
                <p className="text-gray-900 mt-1">{task.assignedTo}</p>
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
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            
            <div className="space-y-3">
              {task.activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;