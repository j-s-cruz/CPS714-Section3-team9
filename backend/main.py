from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from data import data_router
from datetime import date as date_type, time as time_type, datetime
from typing import Optional
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

app = FastAPI()

class BookingRequest(BaseModel): #Pydantic model for the booking request
    user_id: str
    schedule_id: str

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
    # supabase query to get classes schedules (need to fix for final table)
    db_query = supabase.table('class_schedules')\
        .select('*, ficlasses(*)')\
        .gte('scheduled_date', datetime.now().date().isoformat())

    #if filters are provided in the query, add them to the query
    if date:
        db_query = db_query.eq('scheduled_date', date)
    if time_from:
        db_query = db_query.gte('start_time', time_from)
    if time_to:
        db_query = db_query.lte('end_time', time_to)

    #Sort the results of the query by start_time
    db_query = db_query.order('scheduled_date').order('start_time')

    final_result = db_query.execute() #execute the query and get the results

    return final_result.data #get JSON data from the query returned

#integration with team 1 and team 6 to help with this with membership tier validation and notification system
@app.post("/classes/book")
async def book_class():
    return{"message": "not yet implemented"}

@app.post("/classes/cancel")
async def cancel_class():
    return{"message": "not yet implemented"}

@app.get("/classes/my-bookings")
async def get_my_bookings():
    return{"message": "not yet implemented"}

app.include_router(data_router.data_router)