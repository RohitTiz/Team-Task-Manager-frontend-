export const USER_ROLES = {
  MANAGER: 'MANAGER',
  USER: 'USER',
};

export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: TASK_STATUS.COMPLETED, label: 'Completed', color: 'bg-green-100 text-green-800' },
];

export const TASK_PRIORITY_OPTIONS = [
  { value: TASK_PRIORITY.LOW, label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: TASK_PRIORITY.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: TASK_PRIORITY.HIGH, label: 'High', color: 'bg-red-100 text-red-800' },
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    GET_ALL: '/users',
    CREATE: '/users',
    UPDATE: '/users/{id}',
    DELETE: '/users/{id}',
  },
  TASKS: {
    BASE: '/tasks',
    GET_ALL: '/tasks',
    CREATE: '/tasks',
    UPDATE: '/tasks/{id}',
    DELETE: '/tasks/{id}',
    UPDATE_STATUS: '/tasks/{id}/status',
    ADD_COMMENT: '/tasks/{id}/comments',
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'taskflow_token',
  USER: 'taskflow_user',
  REMEMBER_ME: 'taskflow_remember_me',
};

export const SIDEBAR_MENU = {
  MANAGER: [
    { path: '/manager/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/manager/users', label: 'Users', icon: 'Users' },
    { path: '/manager/tasks', label: 'Tasks', icon: 'CheckSquare' },
  ],
  USER: [
    { path: '/user/dashboard', label: 'My Tasks', icon: 'ClipboardList' },
  ],
};