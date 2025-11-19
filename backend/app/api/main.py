from fastapi import FastAPI
from app.api.routes import login

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World!"}


app.include_router(login.router)