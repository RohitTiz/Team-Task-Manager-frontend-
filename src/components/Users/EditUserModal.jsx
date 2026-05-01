import React, { useState } from 'react'

const EditUserModal = ({ user, onClose, onEdit }) => {
  const [formData, setFormData] = useState({ name: user.name, email: user.email, role: user.role })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onEdit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input-field" />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field" />
          <select name="role" value={formData.role} onChange={handleChange} className="input-field">
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
          </select>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal