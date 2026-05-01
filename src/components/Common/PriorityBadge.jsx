import React from 'react';
import { TASK_PRIORITY_OPTIONS } from '../../utils/constants';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = TASK_PRIORITY_OPTIONS.find(opt => opt.value === priority);
  
  if (!priorityConfig) {
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig.color}`}>
      {priorityConfig.label}
    </span>
  );
};

export default PriorityBadge;