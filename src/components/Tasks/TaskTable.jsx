import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../Common/StatusBadge'
import PriorityBadge from '../Common/PriorityBadge'

const TaskTable = ({ tasks, users, onDelete }) => {
  const navigate = useNavigate()

  const getUserName = (userId) => {
    const user = users?.find(u => u.id === userId)
    return user?.name || 'Unassigned'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Assigned To</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Priority</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Deadline</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map(task => (
            <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/manager/task/${task.id}`)}>
              <td className="px-4 py-3 text-sm text-gray-900">{task.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{getUserName(task.assignedTo)}</td>
              <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
              <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(task.deadline).toLocaleDateString()}</td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable