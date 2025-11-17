from supabase import create_client, Client
from collections import Counter

url ="https://zgughkuatbflarqipgyj.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndWdoa3VhdGJmbGFycWlwZ3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Nzk5NDAsImV4cCI6MjA3ODQ1NTk0MH0.fFCkPXPtYPrUPujp-7M1XuZRbfbUaV5juwNYOR1kTs0"

#tables:

# class <- class_name, total_bookings, time (retrieved as string?)
# memberships   <- current_period_start, current_period_end timestamps (string format "2025-11-16T20:09:46.539436+00:00")
# profiles <- probably not useful

supabase: Client = create_client(url, key)

# response = (
#     supabase.table("memberships")
#     .select("*")
#     .execute()
# )

# print(response)

def getNumberActiveMembersFromRepo():
    supabase: Client = create_client(url, key)

    response = (
        supabase.table("memberships")
        .select("*", count = "exact")
        .eq("status", "active")
        .execute()
    )
    data = response.data
    return data

def getMemberTypesDataFromRepo():
    supabase: Client = create_client(url, key)

    response = (
        supabase.table("memberships")
        .select("tier")
        .eq("status", "active")
        .execute()
    )
    data = response.data
    return data

