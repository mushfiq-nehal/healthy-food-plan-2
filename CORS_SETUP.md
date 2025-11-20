# Backend CORS Configuration

To enable the frontend to communicate with your backend, add CORS middleware to your FastAPI application.

## Quick Fix

Add this to `backend/app/api/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import login

app = FastAPI()

# Add CORS middleware - IMPORTANT for frontend!
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Docker frontend
        "http://localhost:5173",      # Dev frontend
        "http://localhost:5174",      # Alternate dev port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

app.include_router(login.router)
```

## Why This Is Needed

Without CORS configuration, the frontend (running on port 3000) cannot make requests to the backend (running on port 8000) due to browser security restrictions.

## Testing CORS

After adding the middleware:

1. Restart your backend:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. Check browser console (F12) - you should NOT see CORS errors anymore

3. Try logging in from the frontend - it should work!

## Production CORS

For production deployment, replace the origins list with your actual frontend URL:

```python
allow_origins=[
    "https://your-frontend-domain.com",
    "https://www.your-frontend-domain.com",
]
```

## Already Have CORS?

If you already added CORS middleware, make sure `http://localhost:3000` and `http://localhost:5173` are in the allowed origins list!
