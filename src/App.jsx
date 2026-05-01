// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { USER_ROLES } from './utils/constants';

// Lazy load components for optimal performance
const Login = lazy(() => import('./pages/Login'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const ManagerLayout = lazy(() => import('./components/Layout/ManagerLayout'));
const UserLayout = lazy(() => import('./components/Layout/UserLayout'));
const ManagerDashboard = lazy(() => import('./components/Dashboard/ManagerDashboard'));
const UserDashboard = lazy(() => import('./components/Dashboard/UserDashboard'));
const UserManagement = lazy(() => import('./components/Users/UserManagement'));
const TasksList = lazy(() => import('./components/Tasks/TasksList'));
const TaskDetail = lazy(() => import('./components/Tasks/TaskDetail'));
const ProjectDetails = lazy(() => import('./components/Projects/ProjectDetails'));
const ProjectsPage = lazy(() => import('./components/Projects/ProjectsPage'));

// Loading fallback component with skeleton UI
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading TaskFlow...</p>
    </div>
  </div>
);

// Error boundary component for route errors
class RouteErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <RouteErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes - No authentication required */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Manager Routes - Role: MANAGER only */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.MANAGER]}>
                  <ManagerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="project/:id" element={<ProjectDetails />} />
              <Route path="tasks" element={<TasksList />} />
              <Route path="task/:id" element={<TaskDetail />} />
            </Route>
            
            {/* User Routes - Role: USER only */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.USER]}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="task/:id" element={<TaskDetail />} />
            </Route>
            
            {/* Catch-all redirects */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </RouteErrorBoundary>
  );
}

export default App;