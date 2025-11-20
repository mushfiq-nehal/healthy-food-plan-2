# Healthy Food Plan - AI-Powered Food Management Platform

> Full-stack application for SDG 2 (Zero Hunger) & SDG 12 (Responsible Consumption and Production)

## 🎯 INNOVATEX Hackathon Project

This project addresses food waste, inefficient consumption, and limited access to nutritious meals through a comprehensive food management and sustainability platform.

## 📦 Project Structure

```
healthy-food-plan-2/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models.py    # Database models
│   │   └── db.py        # Database connection
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context
│   │   ├── services/    # API services
│   │   └── data/        # Seeded data
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── docker-compose.yml   # Full stack deployment
└── .env.example         # Environment variables template
```

## ✨ Features Implemented

### 🔐 Authentication & User Management
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Secure token refresh mechanism
- ✅ Protected routes

### 👤 User Profile
- ✅ Edit profile information
- ✅ Dietary preferences configuration
- ✅ Household size management
- ✅ Budget range settings
- ✅ Location tracking

### 📝 Food Consumption Logging
- ✅ Manual food usage logging
- ✅ Category-based organization
- ✅ Consumption history
- ✅ Quantity and unit tracking

### 📦 Inventory Management
- ✅ Add/Edit/Delete food items
- ✅ Category filtering
- ✅ Expiration date tracking
- ✅ Visual expiration alerts
- ✅ 20+ seeded food items database

### 📚 Resources Library
- ✅ 20+ sustainability resources
- ✅ Articles and videos
- ✅ Category-based filtering
- ✅ Personalized recommendations
- ✅ Transparent recommendation logic

### 📸 Image Upload
- ✅ Receipt/label upload (JPG/PNG)
- ✅ Image preview and storage
- ✅ Ready for AI processing (Part 2)

### 📊 Dashboard
- ✅ Overview statistics
- ✅ Recent logs and inventory
- ✅ Recommended resources

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL 16
- **ORM**: SQLModel
- **Auth**: JWT (PyJWT)
- **Migration**: Alembic

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (Frontend)
- **ASGI Server**: Uvicorn (Backend)

## 🚀 Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed
- Git

### Option 1: Run Full Stack with Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/mushfiq-nehal/healthy-food-plan-2.git
cd healthy-food-plan-2
```

2. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your preferred settings (optional)
# Default values work fine for development
```

3. **Start all services**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- PostgreSQL: localhost:5432

### Option 2: Run Backend and Frontend Separately

#### Backend Only
```bash
cd backend
docker-compose up --build
```

#### Frontend Only
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Access at http://localhost:5173

## 📋 Default Accounts

After starting the application, you can:
1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate token
- `GET /auth/users/me` - Get current user info (protected)

### Future Endpoints (Ready for Implementation)
- Profile management
- Food logs CRUD
- Inventory CRUD
- Resources management
- Image processing

## 📊 Seeded Data

### Food Items Database
The application comes with 20 pre-seeded food items:
- Categories: dairy, fruit, vegetable, protein, grain
- Typical expiration periods
- Sample cost per unit

### Resources Library
20 sustainability resources covering:
- Storage best practices
- Budget-friendly tips
- Waste reduction strategies
- Meal planning guides

## 🔧 Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=healthy_food_plan
DB_PORT=5432

# Backend
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend
FRONTEND_PORT=3000
VITE_API_URL=http://localhost:8000
```

## 🎨 Features Overview

### Current Implementation (Part 1)
- ✅ Full authentication system
- ✅ User profile management
- ✅ Food consumption tracking
- ✅ Inventory management with expiration alerts
- ✅ Resources library with 20+ entries
- ✅ Image upload interface
- ✅ Responsive dashboard
- ✅ Seeded data (food items & resources)

### Prepared for Part 2 (AI Features)
- 🔮 AI-powered receipt scanning
- 🔮 OCR for food labels
- 🔮 Automated inventory from receipts
- 🔮 Nutrition analysis
- 🔮 Smart recommendations
- 🔮 Expiration date detection
- 🔮 Price tracking and budget analysis

## 🐛 Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Edit .env and change ports
FRONTEND_PORT=3001
BACKEND_PORT=8001
```

**Services won't start:**
```bash
# Clean Docker cache
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up --build
```

### Frontend Issues

**Cannot connect to backend:**
1. Verify backend is running: http://localhost:8000/docs
2. Check VITE_API_URL in frontend/.env
3. Check browser console for CORS errors

### Backend Issues

**Database connection failed:**
1. Ensure PostgreSQL container is healthy
2. Check DATABASE_URL in backend environment
3. View logs: `docker-compose logs backend`

## 📱 Screenshots & Demo

### Authentication
- Clean, modern login/register interface
- Form validation and error handling

### Dashboard
- Overview of logs, inventory, and resources
- Quick access to all features

### Inventory Management
- Add/edit items with expiration tracking
- Visual alerts for expiring items
- Category filtering

### Resources Library
- 20+ curated resources
- Filter by category and type
- Personalized recommendations

## 🔐 Security Features

- JWT-based authentication
- Secure password hashing
- Token refresh mechanism
- Protected API routes
- CORS configuration
- Environment variable management

## 📚 Documentation

- **Backend API**: http://localhost:8000/docs (Swagger UI)
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

## 🤝 Team Collaboration

### For Backend Developers
- Backend runs on port 8000
- API documentation at /docs
- Database migrations with Alembic

### For Frontend Developers
- Frontend runs on port 3000 (Docker) or 5173 (dev)
- Mock APIs in place for independent development
- Seeded data for testing

## 📦 Deployment

### Production Build

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Run in production mode
docker-compose up -d
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🎯 Hackathon Requirements Checklist

### Part 1 Requirements (✅ Completed)
- ✅ Authentication & User Management
- ✅ User Profile & Consumption Logging
- ✅ Food Items & Inventory Database (20+ entries)
- ✅ Resources for Sustainable Practices (20+ entries)
- ✅ Basic Tracking Logic (non-AI)
- ✅ Image Upload for Food Scanning (UI)
- ✅ User Dashboard & UI
- ✅ Documentation & Code Quality
- ✅ Docker deployment ready

### Ready for Part 2
- 🔮 AI/ML integration points prepared
- 🔮 Data structures designed for extensibility
- 🔮 Clean separation of concerns
- 🔮 Scalable architecture

## 📝 License

This project is part of the INNOVATEX Hackathon.

## 🙏 Acknowledgments

- INNOVATEX Hackathon organizers
- Team members and collaborators
- Open source community

---

**Built for INNOVATEX Hackathon 2025**  
*SDG 2: Zero Hunger | SDG 12: Responsible Consumption and Production*

🌱 Reducing food waste, one meal at a time.
