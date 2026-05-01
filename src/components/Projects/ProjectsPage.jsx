// src/components/Projects/ProjectsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    {
      id: 2,
      name: 'E-Commerce Platform',
      description: 'Building a modern e-commerce platform with React and Spring Boot',
      status: 'ACTIVE',
      createdAt: '2024-02-15',
      members: [
        { id: 1, name: 'John Manager', email: 'manager@taskflow.com', role: 'MANAGER' },
        { id: 2, name: 'Jane User', email: 'user@taskflow.com', role: 'USER' },
        { id: 3, name: 'Mike Johnson', email: 'mike@taskflow.com', role: 'USER' },
      ],
      taskCount: 8,
    },
    {
      id: 3,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile app for task management',
      status: 'ACTIVE',
      createdAt: '2024-03-01',
      members: [
        { id: 1, name: 'John Manager', email: 'manager@taskflow.com', role: 'MANAGER' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@taskflow.com', role: 'USER' },
      ],
      taskCount: 3,
    },
  ]);

  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED, ON_HOLD

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'ALL') return true;
    return project.status === filter;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track all your projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">Total Projects</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">On Hold</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.onHold}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {['ALL', 'ACTIVE', 'COMPLETED', 'ON_HOLD'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                filter === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'ALL' ? 'All Projects' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-gray-500">No projects found</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-3 text-blue-600 hover:text-blue-700"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default ProjectsPage;