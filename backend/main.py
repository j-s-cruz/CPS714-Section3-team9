from fastapi import FastAPI, APIRouter
from data import data_router

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(data_router.data_router)