// src/components/Projects/ProjectCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      // In ProjectCard.jsx, the navigation is already correct:
      onClick={() => navigate(`/manager/project/${project.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all hover:border-blue-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {project.name}
        </h3>
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(project.status)}`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 3).map((member, idx) => (
              <div
                key={idx}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white"
              >
                {member.name.charAt(0)}
              </div>
            ))}
            {project.members?.length > 3 && (
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {project.members?.length || 0} members
          </span>
        </div>
        <div className="text-sm text-gray-500">
          📋 {project.taskCount || 0} tasks
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
