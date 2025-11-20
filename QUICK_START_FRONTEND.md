# Quick Start Guide for Backend Developer

Hey! Here's your frontend ready to go! 🚀

## What I've Built

A complete React frontend with:
- ✅ Login/Register pages (connected to your `/auth` endpoints)
- ✅ Dashboard with overview
- ✅ Profile management
- ✅ Food logs tracking
- ✅ Inventory management
- ✅ Resources library (20+ items)
- ✅ Image upload interface
- ✅ **Fully Dockerized** - just run and go!

## How to Run

### Option 1: Run Full Stack (Recommended)

From the **root directory** (`healthy-food-plan-2/`):

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start everything (backend + frontend + database)
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Run Only Frontend

From the **frontend directory**:

```bash
cd frontend

# Build and run
docker-compose up --build
```

Frontend will be at http://localhost:3000 and will connect to http://localhost:8000 for your backend.

## What's Connected to Your Backend

### ✅ Working Now
- `POST /auth/register` - Registration page
- `POST /auth/login` - Login page
- `POST /auth/refresh` - Automatic token refresh
- `POST /auth/logout` - Logout button
- `GET /auth/users/me` - Shows username in navbar & profile

### 📦 Ready to Connect (Mock APIs in place)

These features work with **localStorage** but are ready to connect to your backend when you add the endpoints:

**Profile Updates:**
```python
@router.put("/users/me")
def update_profile(profile_data: ProfileUpdate):
    # fullName, householdSize, dietaryPreferences, budgetRange, location
    pass
```

**Food Logs:**
```python
@router.get("/logs")  # Get all logs
@router.post("/logs")  # Create log
@router.delete("/logs/{id}")  # Delete log
```

**Inventory:**
```python
@router.get("/inventory")  # Get all items
@router.post("/inventory")  # Create item
@router.put("/inventory/{id}")  # Update item
@router.delete("/inventory/{id}")  # Delete item
```

**Images:**
```python
@router.post("/images/upload")  # Upload image
@router.get("/images")  # Get all images
@router.delete("/images/{id}")  # Delete image
```

## File Structure

```
frontend/
├── src/
│   ├── pages/              # All main pages
│   │   ├── Login.jsx       # Connected to your backend ✅
│   │   ├── Register.jsx    # Connected to your backend ✅
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── FoodLogs.jsx
│   │   ├── Inventory.jsx
│   │   ├── Resources.jsx
│   │   └── ImageUpload.jsx
│   │
│   ├── services/
│   │   └── api.js          # All API calls here - easy to update!
│   │
│   ├── context/
│   │   └── AuthContext.jsx # Handles login/logout/tokens
│   │
│   └── data/
│       └── seedData.js     # 20 food items + 20 resources
│
├── Dockerfile              # Frontend Docker config
├── docker-compose.yml      # Standalone frontend deployment
├── nginx.conf              # Production web server config
└── README.md               # Detailed documentation
```

## How Frontend Calls Your Backend

Check `src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Example: Login
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  // ... more endpoints
};
```

## Testing the App

1. **Start the backend** (if not using docker-compose):
   ```bash
   cd backend
   docker-compose up
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   docker-compose up --build
   ```

3. **Register a new user**:
   - Go to http://localhost:3000/register
   - Fill in username, email, password
   - Click "Sign Up"

4. **Login**:
   - Go to http://localhost:3000/login
   - Enter credentials
   - See the dashboard!

5. **Try all features**:
   - Dashboard - overview
   - Profile - edit user info
   - Logs - add food consumption
   - Inventory - manage items
   - Resources - browse tips
   - Upload - test image upload

## Environment Variables

Frontend uses `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Change this if your backend runs on a different URL.

## When You Add New Backend Endpoints

1. Open `frontend/src/services/api.js`
2. Find the mock function (e.g., `foodLogAPI.getLogs`)
3. Replace with real API call:

```javascript
// Before (mock)
getLogs: () => {
  const logs = JSON.parse(localStorage.getItem('food_logs') || '[]');
  return Promise.resolve({ data: logs });
},

// After (real API)
getLogs: () => api.get('/logs'),
```

That's it! The frontend will automatically use your backend.

## CORS Setup

Make sure your backend has CORS enabled for `http://localhost:3000`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Need Help?

- Frontend runs at: http://localhost:3000 (Docker) or http://localhost:5173 (dev)
- Check frontend console (F12) for errors
- Check backend logs: `docker-compose logs backend`
- Full documentation in `frontend/README.md`

## What's Already Working

✅ Beautiful, responsive UI  
✅ All pages and navigation  
✅ Login/Register with your backend  
✅ Token refresh automatic  
✅ Protected routes  
✅ Seeded data for demo  
✅ Docker deployment ready  
✅ Mobile-friendly design  

## Ready to Demo

The app is **100% functional** for the hackathon demo:
- Authentication works with your backend
- All other features work with mock data
- Looks professional and polished
- Easy to extend when you add more endpoints

Just run `docker-compose up --build` from root directory and you're good to go! 🎉

---

**Any questions? Check the detailed README in frontend/README.md or root PROJECT_README.md**
