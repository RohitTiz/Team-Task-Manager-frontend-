import React from 'react';
import { TASK_STATUS_OPTIONS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const statusConfig = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
  
  if (!statusConfig) {
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  );
};

export default StatusBadge;