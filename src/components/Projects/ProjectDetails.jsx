// src/components/Projects/ProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../Common/StatusBadge';
import PriorityBadge from '../Common/PriorityBadge';
import AddMemberModal from './AddMemberModal';
import { projectAPI, taskAPI, userAPI } from '../../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'MEDIUM',
    deadline: '',
  });
  const [allUsers, setAllUsers] = useState([]);

  // Load project data from data service
  useEffect(() => {
    fetchProjectData();
    fetchAllUsers();
  }, [id]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      // Fetch project details
      const projectRes = await projectAPI.getById(parseInt(id));
      setProject(projectRes.data);
      
      // Fetch project tasks
      const tasksRes = await projectAPI.getTasks(parseInt(id));
      setTasks(tasksRes.data || []);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const usersRes = await userAPI.getAll();
      setAllUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddMember = async (member) => {
    try {
      await projectAPI.addMember(parseInt(id), member.id);
      // Refresh project data
      await fetchProjectData();
      console.log('Member added:', member);
      console.log('Email sent to:', member.email);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the project?')) {
      try {
        await projectAPI.removeMember(parseInt(id), memberId);
        await fetchProjectData();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title: newTask.title,
      description: newTask.description,
      assignedTo: parseInt(newTask.assignedTo),
      priority: newTask.priority,
      deadline: newTask.deadline,
    };
    
    try {
      const response = await projectAPI.addTask(parseInt(id), taskData);
      setTasks(prevTasks => [response.data, ...prevTasks]);
      setIsCreateTaskModalOpen(false);
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'MEDIUM', deadline: '' });
      console.log('Task created for project:', project.name);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Helper to get user name by ID
  const getUserName = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <button onClick={() => navigate('/manager/dashboard')} className="btn-primary mt-4">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
  };

  // Get project members with full details
  const projectMembers = project.membersDetails || [];

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => navigate('/manager/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Add Member</span>
          </button>
          <button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-red-600">{taskStats.pending}</p>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Member
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {projectMembers.length === 0 ? (
            <p className="text-gray-500 text-sm">No members yet</p>
          ) : (
            projectMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                  <span className="text-xs text-blue-600">{member.role}</span>
                </div>
                {member.role !== 'MANAGER' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Project Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">Manage tasks for this project</p>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks yet</p>
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.assignedToName || getUserName(task.assignedTo)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusUpdate(task.id, e.target.value)}
                        className="text-sm border-none bg-transparent focus:ring-0"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.deadline}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => console.log('Edit task:', task.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
        currentMembers={projectMembers}
      />

      {/* Create Task Modal - Simplified for Project */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 backdrop-blur-md bg-white/30" onClick={() => setIsCreateTaskModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create Task for {project.name}</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Assign to...</option>
                {projectMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsCreateTaskModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;