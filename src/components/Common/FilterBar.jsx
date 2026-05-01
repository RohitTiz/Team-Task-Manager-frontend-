import React from 'react'
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../../utils/constants'

const FilterBar = ({ filters, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        name="status"
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">All Status</option>
        {TASK_STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        name="priority"
        value={filters.priority}
        onChange={(e) => onChange('priority', e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">All Priority</option>
        {TASK_PRIORITY_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button
        onClick={() => {
          onChange('status', '')
          onChange('priority', '')
          onChange('search', '')
        }}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FilterBar