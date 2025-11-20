# 🏗️ Project Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                    http://localhost:3000                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   FRONTEND (React + Nginx)                       │
│                                                                  │
│  ┌────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Login/   │  │  Dashboard  │  │  Food Logs  │             │
│  │  Register  │  │             │  │             │             │
│  └────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Inventory │  │  Resources  │  │   Upload    │             │
│  │            │  │             │  │   Images    │             │
│  └────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│                    AuthContext (JWT Management)                 │
│                    API Service Layer (Axios)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ REST API
                           │ JWT Bearer Token
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   BACKEND (FastAPI)                              │
│                  http://localhost:8000                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API Routes                                 │    │
│  │                                                         │    │
│  │  /auth/register  → User Registration                   │    │
│  │  /auth/login     → User Login (JWT)                    │    │
│  │  /auth/refresh   → Token Refresh                       │    │
│  │  /auth/logout    → User Logout                         │    │
│  │  /auth/users/me  → Current User Info                   │    │
│  │                                                         │    │
│  │  [Future APIs - Ready to Implement]                    │    │
│  │  /logs           → Food Logs CRUD                      │    │
│  │  /inventory      → Inventory CRUD                      │    │
│  │  /profile        → Profile Updates                     │    │
│  │  /images         → Image Upload/Retrieval              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│                    SQLModel (ORM)                                │
│                    JWT Authentication                            │
│                    CORS Middleware                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ SQL Queries
                           │ Alembic Migrations
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  DATABASE (PostgreSQL 16)                        │
│                   localhost:5432                                 │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   users     │  │  token_      │  │  [Future     │          │
│  │             │  │  blacklist   │  │   Tables]    │          │
│  │  - id       │  │             │  │              │          │
│  │  - username │  │  - token    │  │  - logs      │          │
│  │  - email    │  │  - id       │  │  - inventory │          │
│  │  - password │  │             │  │  - images    │          │
│  └─────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User → Frontend Login Form
         ↓
    POST /auth/login
         ↓
    Backend validates credentials
         ↓
    Returns JWT tokens (access + refresh)
         ↓
    Frontend stores in localStorage
         ↓
    Auto-refresh when token expires
         ↓
    All requests include Bearer token
```

### 2. Protected Route Flow

```
User visits /dashboard
         ↓
    ProtectedRoute checks auth
         ↓
    Is user authenticated? (check token)
         ↓
    YES → Render Dashboard
         ↓
    NO → Redirect to /login
```

### 3. Data Operations Flow (Example: Food Logs)

```
User clicks "Add Log"
         ↓
    Fills form and submits
         ↓
    Frontend validates input
         ↓
    [Current: Saves to localStorage]
    [Future: POST /logs with token]
         ↓
    Backend processes request
         ↓
    Saves to database
         ↓
    Returns success response
         ↓
    Frontend updates UI
```

## Container Architecture (Docker)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Docker Network                           │
│                        (app-network)                             │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │   Frontend       │  │    Backend       │  │   Database   │ │
│  │   Container      │  │    Container     │  │   Container  │ │
│  │                  │  │                  │  │              │ │
│  │   Nginx:Alpine   │  │   Python:3.10    │  │  Postgres:16 │ │
│  │   Port: 3000     │  │   Port: 8000     │  │  Port: 5432  │ │
│  │                  │  │                  │  │              │ │
│  │   - Serves       │  │   - FastAPI      │  │  - Stores    │ │
│  │     React build  │  │   - Uvicorn      │  │    user data │ │
│  │   - Routes       │  │   - SQLModel     │  │  - JWT       │ │
│  │     SPA          │  │   - Alembic      │  │    tokens    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│          ↑                      ↑                     ↑         │
│          └──────────────────────┴─────────────────────┘         │
│                     Inter-container communication               │
└─────────────────────────────────────────────────────────────────┘
         ↓                        ↓                      ↓
    localhost:3000           localhost:8000        localhost:5432
```

## Component Hierarchy (Frontend)

```
App.jsx (Router + AuthProvider)
  ├── Navbar (always visible when authenticated)
  │
  ├── Public Routes
  │   ├── Login
  │   └── Register
  │
  └── Protected Routes (require authentication)
      ├── Dashboard
      │   ├── Stats Cards
      │   ├── Recent Logs
      │   ├── Inventory Summary
      │   └── Recommended Resources
      │
      ├── Profile
      │   ├── User Info Display
      │   └── Profile Edit Form
      │
      ├── FoodLogs
      │   ├── Log Form
      │   └── Logs List
      │
      ├── Inventory
      │   ├── Item Form
      │   ├── Category Filter
      │   ├── Items Grid
      │   └── Seeded Items Reference
      │
      ├── Resources
      │   ├── Filter Controls
      │   └── Resources Grid
      │
      └── ImageUpload
          ├── Upload Form
          ├── Preview
          └── Images Gallery
```

## State Management

```
┌─────────────────────────────────────────────┐
│            AuthContext (Global)             │
│                                             │
│  - user: { id, username, email }           │
│  - isAuthenticated: boolean                │
│  - loading: boolean                        │
│  - login(username, password)               │
│  - register(username, email, password)     │
│  - logout()                                │
└─────────────────────────────────────────────┘
                    ↓
        Consumed by all components
                    ↓
┌─────────────────────────────────────────────┐
│          Component Local State              │
│                                             │
│  Dashboard     → logs, inventory stats     │
│  Profile       → profile form data         │
│  FoodLogs      → logs list, form state     │
│  Inventory     → items list, filters       │
│  Resources     → resources, filters        │
│  ImageUpload   → images, upload state      │
└─────────────────────────────────────────────┘
```

## API Service Layer

```
src/services/api.js
  │
  ├── Axios Instance (with interceptors)
  │   ├── Request: Add JWT token to headers
  │   └── Response: Handle 401, refresh token
  │
  ├── authAPI
  │   ├── register()  ✅ Connected
  │   ├── login()     ✅ Connected
  │   ├── refresh()   ✅ Connected
  │   ├── logout()    ✅ Connected
  │   └── getCurrentUser() ✅ Connected
  │
  ├── profileAPI
  │   └── updateProfile() 🔄 Mock (ready)
  │
  ├── foodLogAPI
  │   ├── getLogs()    🔄 Mock (ready)
  │   ├── createLog()  🔄 Mock (ready)
  │   └── deleteLog()  🔄 Mock (ready)
  │
  ├── inventoryAPI
  │   ├── getItems()   🔄 Mock (ready)
  │   ├── createItem() 🔄 Mock (ready)
  │   ├── updateItem() 🔄 Mock (ready)
  │   └── deleteItem() 🔄 Mock (ready)
  │
  └── imageAPI
      ├── uploadImage() 🔄 Mock (ready)
      ├── getImages()   🔄 Mock (ready)
      └── deleteImage() 🔄 Mock (ready)
```

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                               │
├─────────────────────────────────────────────────────────────┤
│  React 18.3.1          │  Modern UI library                 │
│  Vite 7.2.2            │  Fast build tool                   │
│  Tailwind CSS 3.4.17   │  Utility-first styling            │
│  React Router 7.1.1    │  Client-side routing              │
│  Axios 1.7.9           │  HTTP client                       │
│  Context API           │  State management                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                                │
├─────────────────────────────────────────────────────────────┤
│  FastAPI               │  Modern Python web framework       │
│  SQLModel              │  SQL ORM with Pydantic            │
│  PostgreSQL 16         │  Relational database              │
│  Alembic               │  Database migrations              │
│  PyJWT                 │  JWT authentication               │
│  Uvicorn               │  ASGI server                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      DEVOPS                                  │
├─────────────────────────────────────────────────────────────┤
│  Docker                │  Containerization                  │
│  Docker Compose        │  Multi-container orchestration    │
│  Nginx                 │  Web server (production)          │
│  Alpine Linux          │  Lightweight base images          │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Scenarios

### Scenario 1: Full Stack Development
```bash
docker-compose up
→ All services run together
→ Frontend talks to backend via Docker network
```

### Scenario 2: Separate Development
```bash
# Terminal 1: Backend
cd backend && docker-compose up

# Terminal 2: Frontend (dev mode)
cd frontend && npm run dev
→ Frontend hot-reload for faster development
```

### Scenario 3: Production Deployment
```bash
docker-compose -f docker-compose.yml up -d
→ All services run in detached mode
→ Nginx serves optimized React build
→ Ready for cloud deployment (AWS, Azure, GCP)
```

---

**This architecture supports:**
- ✅ Independent scaling (frontend/backend)
- ✅ Easy development workflow
- ✅ Production-ready deployment
- ✅ Clear separation of concerns
- ✅ Extensible for Part 2 features
