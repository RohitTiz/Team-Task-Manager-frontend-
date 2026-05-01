// src/services/dataService.js
import { USER_ROLES, TASK_STATUS, TASK_PRIORITY } from '../utils/constants';

// ============================================
// STORAGE KEYS
// ============================================
const STORAGE_KEYS = {
  USERS: 'taskflow_users',
  PROJECTS: 'taskflow_projects',
  TASKS: 'taskflow_tasks',
  CURRENT_USER: 'taskflow_current_user',
};

// ============================================
// INITIAL DATA
// ============================================
const getInitialUsers = () => [
  {
    id: 1,
    name: 'John Manager',
    email: 'manager@taskflow.com',
    password: 'password123',
    role: USER_ROLES.MANAGER,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane User',
    email: 'user@taskflow.com',
    password: 'password123',
    role: USER_ROLES.USER,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

const getInitialProjects = () => [
  {
    id: 1,
    name: 'Default Project',
    description: 'Default project containing all existing tasks',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    members: [1, 2], // User IDs
    taskCount: 4,
  },
];

const getInitialTasks = () => [
  {
    id: 1,
    title: 'Fix login authentication bug',
    description: 'API not responding on login endpoint',
    assignedTo: 2, // User ID (Jane User)
    assignedToName: 'Jane User',
    projectId: 1,
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.HIGH,
    deadline: '2024-05-12',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Implement email notification service',
    description: 'Set up Java Mail Sender integration',
    assignedTo: 2,
    assignedToName: 'Jane User',
    projectId: 1,
    status: TASK_STATUS.IN_PROGRESS,
    priority: TASK_PRIORITY.MEDIUM,
    deadline: '2024-05-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Update user documentation',
    description: 'Document all REST endpoints',
    assignedTo: 2,
    assignedToName: 'Jane User',
    projectId: 1,
    status: TASK_STATUS.COMPLETED,
    priority: TASK_PRIORITY.LOW,
    deadline: '2024-05-10',
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// INITIALIZE STORAGE
// ============================================
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getInitialUsers()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(getInitialProjects()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(getInitialTasks()));
  }
};

// Call on app start
initializeStorage();

// ============================================
// USER SERVICES
// ============================================
export const userService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  
  getById: (id) => {
    const users = userService.getAll();
    return users.find(u => u.id === id);
  },
  
  create: (userData) => {
    const users = userService.getAll();
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },
  
  update: (id, userData) => {
    const users = userService.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return users[index];
    }
    return null;
  },
  
  delete: (id) => {
    const users = userService.getAll();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
  },
  
  toggleStatus: (id) => {
    const users = userService.getAll();
    const user = users.find(u => u.id === id);
    if (user) {
      user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },
  
  validateLogin: (email, password) => {
    const users = userService.getAll();
    const user = users.find(u => u.email === email && u.password === password && u.status === 'ACTIVE');
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  },
};

// ============================================
// PROJECT SERVICES
// ============================================
export const projectService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  },
  
  getById: (id) => {
    const projects = projectService.getAll();
    const project = projects.find(p => p.id === id);
    if (project) {
      // Populate member details
      const users = userService.getAll();
      project.membersDetails = project.members.map(memberId => 
        users.find(u => u.id === memberId)
      ).filter(Boolean);
      
      // Get task count
      const tasks = taskService.getAll();
      project.taskCount = tasks.filter(t => t.projectId === id).length;
    }
    return project;
  },
  
  getByMemberId: (userId) => {
    const projects = projectService.getAll();
    return projects.filter(p => p.members.includes(userId));
  },
  
  create: (projectData) => {
    const projects = projectService.getAll();
    const newProject = {
      id: Date.now(),
      name: projectData.name,
      description: projectData.description,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      members: projectData.members || [1], // Add manager by default
      taskCount: 0,
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },
  
  addMember: (projectId, userId) => {
    const projects = projectService.getAll();
    const project = projects.find(p => p.id === projectId);
    if (project && !project.members.includes(userId)) {
      project.members.push(userId);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return true;
    }
    return false;
  },
  
  removeMember: (projectId, userId) => {
    const projects = projectService.getAll();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.members = project.members.filter(m => m !== userId);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return true;
    }
    return false;
  },
};

// ============================================
// TASK SERVICES
// ============================================
export const taskService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
  },
  
  getById: (id) => {
    const tasks = taskService.getAll();
    return tasks.find(t => t.id === id);
  },
  
  getByProjectId: (projectId) => {
    const tasks = taskService.getAll();
    return tasks.filter(t => t.projectId === projectId);
  },
  
  getByUserId: (userId) => {
    const tasks = taskService.getAll();
    return tasks.filter(t => t.assignedTo === userId);
  },
  
  create: (taskData) => {
    const tasks = taskService.getAll();
    const users = userService.getAll();
    const assignedUser = users.find(u => u.id === taskData.assignedTo);
    
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo,
      assignedToName: assignedUser?.name || 'Unknown',
      projectId: taskData.projectId || 1,
      status: TASK_STATUS.PENDING,
      priority: taskData.priority,
      deadline: taskData.deadline,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  },
  
  updateStatus: (taskId, newStatus) => {
    const tasks = taskService.getAll();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return task;
    }
    return null;
  },
  
  update: (taskId, taskData) => {
    const tasks = taskService.getAll();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return tasks[index];
    }
    return null;
  },
  
  delete: (taskId) => {
    const tasks = taskService.getAll();
    const filtered = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  },
  
  getStats: () => {
    const tasks = taskService.getAll();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length,
      pending: tasks.filter(t => t.status === TASK_STATUS.PENDING).length,
      inProgress: tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
    };
  },
};

// ============================================
// SYNC - Update project task counts
// ============================================
export const syncProjectTaskCounts = () => {
  const projects = projectService.getAll();
  const tasks = taskService.getAll();
  
  projects.forEach(project => {
    project.taskCount = tasks.filter(t => t.projectId === project.id).length;
  });
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

// Call this after any task create/delete/status change
export const syncAll = () => {
  syncProjectTaskCounts();
};

export default {
  userService,
  projectService,
  taskService,
  syncAll,
};