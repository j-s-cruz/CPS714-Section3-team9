from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from data import data_router
from datetime import date as date_type, time as time_type, datetime
from typing import Optional
from supabase import create_client, Client
import os

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "FitHub Class Booking API",
        "version": "1.0.0"
    }

@app.get("/classes/schedules")
async def get_classes_schedules(
    date: Optional[str] = None,
    time_from: Optional[str] = None,
    time_to: Optional[str] = None,
):
    #supabase query to get classes schedules
    query = supabase.table('class_scedules')\
        


app.include_router(data_router.data_router)