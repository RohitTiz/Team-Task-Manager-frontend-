import React, { useState, useEffect } from 'react'
import taskAPI from '../../services/taskService'
import userAPI from '../../services/userService'
import TaskTable from './TaskTable'
import SearchBar from '../Common/SearchBar'
import FilterBar from '../Common/FilterBar'

const TasksList = () => {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        taskAPI.getAll(),
        userAPI.getAll()
      ])
      setTasks(tasksRes)
      setUsers(usersRes)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await taskAPI.delete(id)
      fetchData()
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>

      <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <SearchBar value={filters.search} onChange={(val) => handleFilterChange('search', val)} />
        <FilterBar filters={filters} onChange={handleFilterChange} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <TaskTable tasks={filteredTasks} users={users} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default TasksList