from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import login
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Healty Food Plan",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CORS middleware - allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Docker frontend
        "http://localhost:5173",      # Dev frontend
        "http://localhost:5174",      # Alternate dev port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World!"}


app.include_router(login.router)