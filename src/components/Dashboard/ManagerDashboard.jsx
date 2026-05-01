import React, { useState } from 'react';
import StatsCard from './StatsCard';
import StatusBadge from '../Common/StatusBadge';
import PriorityBadge from '../Common/PriorityBadge';
import CreateTaskModal from '../Tasks/CreateTaskModal';
import CreateProjectModal from '../Projects/CreateProjectModal';
import ProjectCard from '../Projects/ProjectCard';

const ManagerDashboard = () => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Projects State
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Default Project',
      description: 'Default project containing all existing tasks',
      status: 'ACTIVE',
      createdAt: '2024-01-01',
      members: [
        { id: 1, name: 'John Manager', email: 'manager@taskflow.com', role: 'MANAGER' },
        { id: 2, name: 'Jane User', email: 'user@taskflow.com', role: 'USER' },
      ],
      taskCount: 4,
    },
  ]);
  
  // Tasks State
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Fix login authentication bug',
      assignedTo: 'John Doe',
      status: 'PENDING',
      priority: 'HIGH',
      deadline: '2024-05-12',
      projectId: 1,
    },
    {
      id: 2,
      title: 'Implement email notification service',
      assignedTo: 'Jane Smith',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      deadline: '2024-05-15',
      projectId: 1,
    },
    {
      id: 3,
      title: 'Update user documentation',
      assignedTo: 'Mike Johnson',
      status: 'COMPLETED',
      priority: 'LOW',
      deadline: '2024-05-10',
      projectId: 1,
    },
    {
      id: 4,
      title: 'Deploy to production environment',
      assignedTo: 'Sarah Wilson',
      status: 'PENDING',
      priority: 'HIGH',
      deadline: '2024-05-08',
      projectId: 1,
    },
  ]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    overdue: tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'COMPLETED').length,
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
    console.log('Project created:', newProject);
  };

  const handleTaskCreated = (newTask) => {
    // Assign new task to Default Project (id: 1)
    const taskWithProject = { ...newTask, projectId: 1 };
    setTasks(prevTasks => [taskWithProject, ...prevTasks]);
    // Update project task count
    setProjects(prevProjects => prevProjects.map(p => 
      p.id === 1 ? { ...p, taskCount: p.taskCount + 1 } : p
    ));
    console.log('Task created successfully:', taskWithProject);
  };

  const handleEdit = (taskId) => {
    console.log('Edit task:', taskId);
  };

  const handleDelete = (taskId) => {
    console.log('Delete task:', taskId);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>Create Project</span>
          </button>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Task</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Tasks" value={stats.total} icon="tasks" color="blue" change={12} />
        <StatsCard title="Completed" value={stats.completed} icon="completed" color="green" change={8} />
        <StatsCard title="Pending" value={stats.pending} icon="pending" color="yellow" change={-5} />
        <StatsCard title="Overdue" value={stats.overdue} icon="overdue" color="red" change={3} />
      </div>

      {/* Projects Section - NEW */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and track your team's projects</p>
          </div>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project</span>
          </button>
        </div>
        
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-gray-500">No projects yet</p>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          
          <button 
            onClick={() => setFilters({ status: '', priority: '', search: '' })}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredTasks.length} of {tasks.length} total tasks
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.assignedTo}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.deadline}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(task.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing {filteredTasks.length} of {tasks.length} results</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
      
      <CreateTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default ManagerDashboard;