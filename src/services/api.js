// src/services/api.js - No axios dependency
import { STORAGE_KEYS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Simple fetch wrapper
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

// Mock login for testing without backend
export const login = async (email, password) => {
  console.log('Login attempt:', { email, password });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Demo credentials
  if (email === 'manager@taskflow.com' && password === 'password123') {
    return {
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        name: 'John Manager',
        email: 'manager@taskflow.com',
        role: 'MANAGER',
      },
    };
  } else if (email === 'user@taskflow.com' && password === 'password123') {
    return {
      token: 'mock-jwt-token-67890',
      user: {
        id: 2,
        name: 'Jane User',
        email: 'user@taskflow.com',
        role: 'USER',
      },
    };
  } else {
    throw new Error('Invalid email or password. Try: manager@taskflow.com / password123');
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

// API methods for future backend integration
const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

// Project APIs
export const projectAPI = {
  getAll: () => request('/projects', { method: 'GET' }),
  getById: (id) => request(`/projects/${id}`, { method: 'GET' }),
  create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  addMember: (projectId, userId) => request(`/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify({ userId }) }),
  removeMember: (projectId, userId) => request(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' }),
  getMembers: (projectId) => request(`/projects/${projectId}/members`, { method: 'GET' }),
  getTasks: (projectId) => request(`/projects/${projectId}/tasks`, { method: 'GET' }),
  addTask: (projectId, taskData) => request(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(taskData) }),
};

// Mock data for projects (for testing without backend)
export const mockProjects = [
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
];

export default api;