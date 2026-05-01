export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateTask = (task) => {
  const errors = {}
  if (!task.title?.trim()) errors.title = 'Title is required'
  if (!task.description?.trim()) errors.description = 'Description is required'
  if (!task.assignedTo) errors.assignedTo = 'Please assign to a user'
  if (!task.deadline) errors.deadline = 'Deadline is required'
  return errors
}

export const validateUser = (user) => {
  const errors = {}
  if (!user.name?.trim()) errors.name = 'Name is required'
  if (!user.email?.trim()) errors.email = 'Email is required'
  if (!validateEmail(user.email)) errors.email = 'Invalid email format'
  if (user.password && user.password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}