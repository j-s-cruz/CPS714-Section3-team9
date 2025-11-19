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

class CancelRequest(BaseModel): #Pydantic model for the cancel request
    user_id: str
    booking_id: int

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
        .select('*, class(*)')\
        .gte('scheduled_date', datetime.now().date().isoformat())

    #if filters are provided in the query, add them to the query
    if date:
        db_query = db_query.eq('scheduled_date', date)
    if time_from:
        db_query = db_query.gte('time_from', time_from)
    if time_to:
        db_query = db_query.lte('time_to', time_to)

    #Sort the results of the query by start_time
    db_query = db_query.order('scheduled_date').order('time_from')

    final_result = db_query.execute() #execute the query and get the results

    return final_result.data #get JSON data from the query returned

#integration with team 1 and team 6 to help with this with membership tier validation and notification system
@app.post("/classes/book")
async def book_class(request: BookingRequest):
    try:

        #supabase query to get the schedule and class details for the provided schedule_id
        #schedule is feteched to verify and check avaliabity and check existance
        schedule_query = supabase.table('class_schedules')\
            .select('*, class(*)')\
            .eq('id', request.schedule_id)\
            .execute()
        
        if not schedule_query.data: #if the schedule is not found, return an error
            return {
                "success": False,
                "message": "ClassSchedule not found"
            }
        
        schedule = schedule_query.data[0] #get the schedule data from the first result

        #check if the call if full or not by comparing taken and total spots
        if schedule['taken_spots'] >= schedule['total_spots']:
            return{
                "success": False,
                "message": "Class is full, No more spots available"
            }
        
        #check if the user has already book the class schedule previously
        #Query the class_bookings table to check if the user has already booked the class schedule
        #Look at not null constraint on the schedule_id and user_id columns
        existing_booking_query = supabase.table('class_bookings')\
            .select('*')\
            .eq('schedule_id', request.schedule_id)\
            .eq('user_id', request.user_id)\
            .is_('cancelled_at', 'null')\
            .execute()
        
        if existing_booking_query.data: #if the user has already booked the class schedule, return an error
            return {
                "success": False,
                "message": "You have already booked this class schedule"
            }

        #past the checks, we are created the booking record for the user
        #automatic time stamp set by the database
        booking_result = supabase.table('class_bookings')\
            .insert({
                'schedule_id': int(request.schedule_id),
                'user_id': request.user_id,

            }).execute()
        
        if not booking_result.data: #if the booking is not created, return an error
            return {
                "success": False,
                "message": "Error creating booking record"
            }
        
        #increment the taken spots in the schedule and update the table
        new_taken_spots = schedule['taken_spots'] + 1
        supabase.table('class_schedules')\
            .update({'taken_spots': new_taken_spots})\
            .eq('id', request.schedule_id)\
            .execute()
        
        #return success booking response with details
        return {
            "success": True,
            "message": "ClassBooking created successfully",
            "booking": booking_result.data[0],
            "class_name": schedule['class']['class_name'],  # Include class name for UI
            "scheduled_date": schedule['scheduled_date'],
            "time_from": schedule['time_from']
        }
        
    except Exception as e: 
        #if an error occurs in booking the class, return an error response
        #log the error for debugging purposes
        print(f"Error booking class: {str(e)}")
        return {
            "success": False,
            "message": f"Error booking class: {str(e)}"
        }

@app.post("/classes/cancel")
async def cancel_class(request: CancelRequest):
    try:
        #supabase query to class_bookings table to cancel the booking
        #verify that the user owns the booking 
        booking_query = supabase.table('class_bookings')\
            .select('*, class_schedules(taken_spots, total_spots)')\
            .eq('id', request.booking_id)\
            .eq('user_id', request.user_id)\
            .execute()

        if not booking_query.data: #if the booking is not found, return an error
            return {
                "success": False,
                "message": "Booking not found or does not belong to this user"
            }
        
        booking = booking_query.data[0] #otherwise, get the booking data

        #verify that the boojing is not already cancelled
        if booking['cancelled_at'] is not None:
            return {
                "success": False,
                "message": "Booking already cancelled"
            }
        
        schedule_id = booking['schedule_id']


        #Update booking status to cancelled with current timestamp
        supabase.table('class_bookings')\
            .update({'cancelled_at': datetime.now().isoformat()})\
            .eq('id', request.booking_id)\
            .execute()

        #decrement the taken spots in the schedule and update the table
        current_taken = booking['class_schedules']['taken_spots']
        supabase.table('class_schedules')\
            .update({'taken_spots': current_taken - 1})\
            .eq('id', schedule_id)\
            .execute()
        
        #return success cancellation response
        return {
            "success": True,
            "message": "Booking cancelled successfully",
            "booking_id": request.booking_id
        }
    
    except Exception as e: #if an error occurs in cancelling the booking, return an error response
        return {
            "success": False,
            "message": f"Error cancelling booking: {str(e)}"
        }



@app.get("/classes/my-bookings") 
async def get_my_bookings(user_id: str):
    try:
        #supabase query to get bookings for the user with class and schedule details
        #fetching from class_bookings table where user_id matches the provided user_id
        db_query = supabase.table('class_bookings')\
            .select('*, class_schedules(*, class(*))')\
            .eq('user_id', user_id)\
            .order('booked_at', desc=True)
        
        final_result = db_query.execute()

        if not final_result.data: #if no bookings found for the user, return an empty list
            return {
                "success": True,
                "message": "No bookings found for this user",
                "bookings": []
            }
        return { #return the bookings found for the user
            "success": True,
            "message": "Bookings retrieved successfully",
            "bookings": final_result.data
        }
    except Exception as e:
        return { #return an error response if an exception occurs
            "success": False,
            "message": f"Error retrieving bookings: {str(e)}",
            "bookings": []
        }

app.include_router(data_router.data_router)