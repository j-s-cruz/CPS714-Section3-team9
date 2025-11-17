from supabase import create_client, Client

url ="https://zgughkuatbflarqipgyj.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndWdoa3VhdGJmbGFycWlwZ3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Nzk5NDAsImV4cCI6MjA3ODQ1NTk0MH0.fFCkPXPtYPrUPujp-7M1XuZRbfbUaV5juwNYOR1kTs0"

#tables:

# class <- class_name, total_bookings, time (retrieved as string?)
# memberships   <- current_period_start, current_period_end timestamps (string format "2025-11-16T20:09:46.539436+00:00")
# profiles <- probably not useful

supabase: Client = create_client(url, key)

response = (
    supabase.table("memberships")
    .select("*")
    .execute()
)

print(response)

# {
#   "data": [
#     {
#       "id": 1,
#       "name": "Mercury"
#     },
#     {
#       "id": 2,
#       "name": "Earth"
#     },
#     {
#       "id": 3,
#       "name": "Mars"
#     }
#   ],
#   "count": null
# }