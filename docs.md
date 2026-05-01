src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx          (role-based menu items)
│   │   ├── Topbar.jsx           (with notifications dropdown)
│   │   └── ProtectedRoute.jsx   (role-aware routing)
│   ├── Dashboard/
│   │   ├── ManagerDashboard.jsx (stats + filters + task table)
│   │   ├── UserDashboard.jsx    (my tasks with tabs)
│   │   └── StatsCard.jsx
│   ├── Users/
│   │   ├── UserManagement.jsx
│   │   ├── AddUserModal.jsx
│   │   ├── EditUserModal.jsx
│   │   └── UserTable.jsx
│   ├── Tasks/
│   │   ├── CreateTask.jsx
│   │   ├── TaskDetail.jsx       (with status update + comments + activity)
│   │   ├── UserTasks.jsx
│   │   ├── TaskTable.jsx
│   │   ├── TaskFilters.jsx      (extracted for reusability)
│   │   └── CommentsSection.jsx  (new - from wireframe)
│   ├── Common/
│   │   ├── SearchBar.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Pagination.jsx
│   │   ├── StatusBadge.jsx      (reusable priority/status badges)
│   │   └── PriorityBadge.jsx
│   └── Notifications/
│       └── NotificationDropdown.jsx (new)
├── context/
│   ├── AuthContext.jsx
│   └── TaskContext.jsx          (optional: for global task state)
├── services/
│   ├── api.js                   (axios instance with interceptors)
│   ├── authService.js
│   ├── taskService.js
│   └── userService.js
├── hooks/
│   ├── useAuth.js
│   ├── useTasks.js
│   └── useOutsideClick.js       (for modals/dropdowns)
├── utils/
│   ├── constants.js
│   ├── dateUtils.js             (date formatting)
│   └── validation.js            (form validation schemas)
├── styles/
│   ├── globals.css              (Tailwind imports + base styles)
│   └── components/              (if needed for complex components)
├── App.jsx
├── main.jsx
└── routes.jsx                   (separate route config)


Routing Plan
/auth/login     → Login page (public)
/manager/*      → Protected + Role="MANAGER"
  ├── dashboard → ManagerDashboard
  ├── users     → UserManagement
  ├── tasks     → Task management (CRUD)
  └── create    → CreateTask

/user/*         → Protected + Role="USER"
  ├── dashboard → UserDashboard
  └── task/:id  → TaskDetail

/*              → redirect based on role after login

📄 ✅ FINAL docs.md
# 🚀 TaskFlow Frontend - Complete Documentation

---

## 📋 Table of Contents
- Project Overview
- Architecture Flow
- Folder Structure & File Details
- Data Flow Diagrams
- API Integration Guide
- Deployment Checklist

---

## 🎯 Project Overview

TaskFlow is a **role-based task management system** with:

- 🔐 Authentication: JWT-based secure login  
- 🛡️ Authorization: Role-based access (MANAGER / USER)  
- 📊 Features: Task creation, assignment, tracking, comments, notifications  

---

## 🏗️ Architecture Flow


User Request → React Router → Auth Check → Layout → Component → API Call → Backend
↓
Role-based Access
↓
Manager / User Views


---

## 📁 Folder Structure


src/
├── components/
│ ├── Layout/
│ ├── Dashboard/
│ ├── Users/
│ ├── Tasks/
│ ├── Common/
│ └── Notifications/
├── context/
├── services/
├── hooks/
├── utils/
├── styles/
├── App.jsx
├── main.jsx
└── routes.jsx


---

## 📂 Root Files

### `main.jsx`
- Entry point of application
- Renders React app
- Wraps with Router

---

### `App.jsx`
- Main routing logic
- Protected routes setup
- Lazy loading
- AuthProvider wrapping

---

## 📂 utils/

### `constants.js`
- USER_ROLES (MANAGER, USER)
- TASK_STATUS
- TASK_PRIORITY

---

### `validation.js`
- validateEmail()
- validatePassword()
- validateTask()

---

### `dateUtils.js`
- formatDate()
- isOverdue()
- getDaysRemaining()

---

## 📂 services/

### `api.js`
- Axios instance
- Adds JWT token
- Handles 401 globally

---

### `authService.js`
- login()
- register()
- logout()

---

### `taskService.js`
- getTasks()
- createTask()
- updateTask()

---

### `userService.js`
- getUsers()
- createUser()
- updateUser()

---

## 📂 context/

### `AuthContext.jsx`
- Global auth state
- login(), logout()
- isAuthenticated

---

### `TaskContext.jsx`
- Global task state (optional)

---

## 📂 components/Layout/

### `ProtectedRoute.jsx`
- Checks:
  - token
  - role
- Redirects if unauthorized

---

### `Sidebar.jsx`
- Role-based menu
- Logout button

---

### `Topbar.jsx`
- Search
- Notifications
- Profile menu

---

## 📂 components/Dashboard/

### `ManagerDashboard.jsx`
- Stats
- Task table
- Filters

---

### `UserDashboard.jsx`
- My tasks
- Tabs (Pending, Completed)

---

### `StatsCard.jsx`
Reusable card:
- title
- value
- icon

---

## 📂 components/Tasks/

### `CreateTask.jsx`
- Form → Validate → API → Redirect

---

### `TaskDetail.jsx`
- View task
- Update status
- Comments

---

### `CommentsSection.jsx`
- Add comments
- View history

---

### `TaskTable.jsx`
Reusable table for tasks

---

## 📂 components/Users/

### `UserManagement.jsx`
- CRUD users

---

### `AddUserModal.jsx`
- Add user form

---

### `EditUserModal.jsx`
- Edit user

---

## 📂 components/Common/

Reusable UI:

- SearchBar  
- FilterBar  
- Pagination  
- StatusBadge  
- PriorityBadge  

---

## 📂 hooks/

- useAuth()
- useTasks()
- useOutsideClick()

---

## 📂 styles/

### `globals.css`
- Tailwind imports
- global styles

---

## 🔄 Data Flow

### 🔐 Authentication Flow


Login → AuthContext → API → token
↓
localStorage
↓
Redirect


---

### 📌 Task Flow


Create Task → API → Backend → Save → Notify → UI Update


---

### 🔄 Status Update


Change Status → API → Update → Refresh UI


---

## 🔌 API Endpoints

### Auth

POST /api/auth/login
GET /api/auth/me


---

### Users

GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id


---

### Tasks

GET /api/tasks
POST /api/tasks
PATCH /api/tasks/:id/status


---

## 🚀 Deployment

### Environment

VITE_API_BASE_URL=your-api-url


---

### Build

npm run build


---

## 📊 Component Tree


App
├── AuthProvider
│ ├── Layout
│ │ ├── Sidebar
│ │ ├── Topbar
│ │ └── Content
│ └── Pages


---

## 🎯 Key Features

- JWT Authentication  
- Role-based Routing  
- Task Management  
- Comments System  
- Notifications  
- Search & Filters  
- Responsive UI  
- Lazy Loading  

---

## ✅ Status

✔ Production-ready frontend architecture  
✔ Scalable folder structure  
✔ Clean separation of concerns  

---

🔥 Built with React + Vite + Tailwind