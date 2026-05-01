// src/services/api.js
import { STORAGE_KEYS } from '../utils/constants';
import { userService, projectService, taskService, syncAll } from './dataService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Simple fetch wrapper (kept for future backend integration)
const request = async (url, options = {}) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// ============================================
// AUTH API - Using localStorage persistence
// ============================================
export const login = async (email, password) => {
  console.log('Login attempt:', { email, password });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Validate against stored users
  const user = userService.validateLogin(email, password);
  
  if (user) {
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    return {
      token: token,
      user: user,
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const logout = async () => {
  console.log('Logout called');
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = async () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
  if (userStr) {
    return JSON.parse(userStr);
  }
  throw new Error('No user found');
};

// ============================================
// USER API - Using dataService
// ============================================
export const userAPI = {
  getAll: () => {
    return Promise.resolve({ data: userService.getAll() });
  },
  getById: (id) => {
    return Promise.resolve({ data: userService.getById(id) });
  },
  create: (userData) => {
    const newUser = userService.create(userData);
    return Promise.resolve({ data: newUser });
  },
  update: (id, userData) => {
    const updated = userService.update(id, userData);
    return Promise.resolve({ data: updated });
  },
  delete: (id) => {
    userService.delete(id);
    return Promise.resolve({ data: { success: true } });
  },
  toggleStatus: (id) => {
    userService.toggleStatus(id);
    return Promise.resolve({ data: { success: true } });
  },
};

// ============================================
// PROJECT API - Using dataService
// ============================================
export const projectAPI = {
  getAll: () => {
    const projects = projectService.getAll();
    // Populate member details and task count
    const projectsWithDetails = projects.map(p => projectService.getById(p.id));
    return Promise.resolve({ data: projectsWithDetails });
  },
  getById: (id) => {
    const project = projectService.getById(id);
    return Promise.resolve({ data: project });
  },
  create: (data) => {
    const newProject = projectService.create(data);
    syncAll();
    return Promise.resolve({ data: newProject });
  },
  update: (id, data) => {
    // Implementation if needed
    return Promise.resolve({ data: { success: true } });
  },
  delete: (id) => {
    // Implementation if needed
    return Promise.resolve({ data: { success: true } });
  },
  addMember: (projectId, userId) => {
    const result = projectService.addMember(projectId, userId);
    return Promise.resolve({ data: { success: result } });
  },
  removeMember: (projectId, userId) => {
    const result = projectService.removeMember(projectId, userId);
    return Promise.resolve({ data: { success: result } });
  },
  getMembers: (projectId) => {
    const project = projectService.getById(projectId);
    return Promise.resolve({ data: project?.membersDetails || [] });
  },
  getTasks: (projectId) => {
    const tasks = taskService.getByProjectId(projectId);
    return Promise.resolve({ data: tasks });
  },
  addTask: (projectId, taskData) => {
    const newTask = taskService.create({ ...taskData, projectId });
    syncAll();
    return Promise.resolve({ data: newTask });
  },
};

// ============================================
// TASK API - Using dataService
// ============================================
export const taskAPI = {
  getAll: (params) => {
    let tasks = taskService.getAll();
    // Apply filters if provided
    if (params?.status && params.status !== '') {
      tasks = tasks.filter(t => t.status === params.status);
    }
    if (params?.priority && params.priority !== '') {
      tasks = tasks.filter(t => t.priority === params.priority);
    }
    if (params?.search && params.search !== '') {
      tasks = tasks.filter(t => t.title.toLowerCase().includes(params.search.toLowerCase()));
    }
    return Promise.resolve({ data: tasks });
  },
  getById: (id) => {
    const task = taskService.getById(id);
    return Promise.resolve({ data: task });
  },
  create: (data) => {
    const newTask = taskService.create(data);
    syncAll();
    return Promise.resolve({ data: newTask });
  },
  update: (id, data) => {
    const updated = taskService.update(id, data);
    return Promise.resolve({ data: updated });
  },
  delete: (id) => {
    taskService.delete(id);
    syncAll();
    return Promise.resolve({ data: { success: true } });
  },
  updateStatus: (id, status) => {
    const updated = taskService.updateStatus(id, status);
    syncAll();
    return Promise.resolve({ data: updated });
  },
  getMyTasks: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
    const currentUser = userStr ? JSON.parse(userStr) : null;
    if (currentUser) {
      const tasks = taskService.getByUserId(currentUser.id);
      return Promise.resolve({ data: tasks });
    }
    return Promise.resolve({ data: [] });
  },
  getStats: () => {
    const stats = taskService.getStats();
    return Promise.resolve({ data: stats });
  },
  addComment: (id, comment) => {
    // Comments implementation if needed
    return Promise.resolve({ data: { success: true } });
  },
  getComments: (id) => {
    return Promise.resolve({ data: [] });
  },
};

// Keep mockProjects for reference
export const mockProjects = projectService.getAll();

const api = {
  get: request,
  post: request,
  put: request,
  delete: request,
};

export default api;