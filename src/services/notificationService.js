// src/services/notificationService.js

const NOTIFICATIONS_KEY = 'taskflow_notifications';

// Notification types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
  TASK_COMMENT_ADDED: 'TASK_COMMENT_ADDED',
  PROJECT_MEMBER_ADDED: 'PROJECT_MEMBER_ADDED',
  TASK_DELETED: 'TASK_DELETED',
};

// Initialize notifications in localStorage
const initializeNotifications = () => {
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  }
};

initializeNotifications();

// Get all notifications for a user
export const getUserNotifications = (userId) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  return allNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Get unread count for a user
export const getUnreadCount = (userId) => {
  const notifications = getUserNotifications(userId);
  return notifications.filter(n => !n.read).length;
};

// Add a notification
export const addNotification = (notification) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  const newNotification = {
    id: Date.now(),
    ...notification,
    read: false,
    createdAt: new Date().toISOString(),
  };
  allNotifications.unshift(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
  return newNotification;
};

// Mark notification as read
export const markAsRead = (notificationId, userId) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  const updated = allNotifications.map(n => 
    n.id === notificationId && n.userId === userId ? { ...n, read: true } : n
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

// Mark all as read for a user
export const markAllAsRead = (userId) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  const updated = allNotifications.map(n => 
    n.userId === userId ? { ...n, read: true } : n
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

// Delete notification
export const deleteNotification = (notificationId, userId) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  const updated = allNotifications.filter(n => !(n.id === notificationId && n.userId === userId));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

// Helper: Send notification when task is assigned
export const notifyTaskAssigned = (task, assignedToUserId, assignedByName) => {
  addNotification({
    userId: assignedToUserId,
    type: NOTIFICATION_TYPES.TASK_ASSIGNED,
    title: 'New Task Assigned',
    message: `${assignedByName} assigned you a new task: "${task.title}"`,
    link: `/user/task/${task.id}`,
    metadata: { taskId: task.id, taskTitle: task.title },
  });
};

// Helper: Send notification when task status changes
export const notifyTaskStatusChanged = (task, newStatus, oldStatus, changedByUserId, changedByName) => {
  // Notify the task assignee (if not the one who changed it)
  if (task.assignedTo !== changedByUserId) {
    addNotification({
      userId: task.assignedTo,
      type: NOTIFICATION_TYPES.TASK_STATUS_CHANGED,
      title: 'Task Status Updated',
      message: `${changedByName} changed task "${task.title}" from ${oldStatus} to ${newStatus}`,
      link: `/user/task/${task.id}`,
      metadata: { taskId: task.id, oldStatus, newStatus },
    });
  }
  
  // Also notify the manager (user with role MANAGER who created the project)
  // This will be handled separately
};

// Helper: Send notification when comment is added
export const notifyCommentAdded = (task, comment, commentByUserId, commentByName, assigneeUserId) => {
  // Notify the task assignee (if not the commenter)
  if (assigneeUserId !== commentByUserId) {
    addNotification({
      userId: assigneeUserId,
      type: NOTIFICATION_TYPES.TASK_COMMENT_ADDED,
      title: 'New Comment',
      message: `${commentByName} commented on "${task.title}": "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
      link: `/user/task/${task.id}`,
      metadata: { taskId: task.id, comment },
    });
  }
};

// Helper: Send notification when user is added to project
export const notifyProjectMemberAdded = (project, addedUserId, addedByName) => {
  addNotification({
    userId: addedUserId,
    type: NOTIFICATION_TYPES.PROJECT_MEMBER_ADDED,
    title: 'Added to Project',
    message: `${addedByName} added you to project: "${project.name}"`,
    link: `/manager/project/${project.id}`,
    metadata: { projectId: project.id, projectName: project.name },
  });
};

// Helper: Send notification to manager when task status changes
export const notifyManagerTaskStatusChanged = (task, newStatus, oldStatus, changedByName, managers) => {
  managers.forEach(manager => {
    addNotification({
      userId: manager.id,
      type: NOTIFICATION_TYPES.TASK_STATUS_CHANGED,
      title: 'Task Status Updated',
      message: `${changedByName} changed task "${task.title}" from ${oldStatus} to ${newStatus}`,
      link: `/manager/task/${task.id}`,
      metadata: { taskId: task.id, oldStatus, newStatus },
    });
  });
};

export default {
  getUserNotifications,
  getUnreadCount,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyTaskAssigned,
  notifyTaskStatusChanged,
  notifyCommentAdded,
  notifyProjectMemberAdded,
  notifyManagerTaskStatusChanged,
};