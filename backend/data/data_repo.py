from supabase import create_client, Client

url ="https://bruanohdbhguyejpieyd.supabase.co/"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJydWFub2hkYmhndXllanBpZXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNjgwMzYsImV4cCI6MjA3NDk0NDAzNn0.C1M7V0T8HHcwCJmkgHkpMqhbMpjTwI-1o8ebTETgu2w"

supabase: Client = create_client(url, key)

response = (
    supabase.table("test")
    .select("*")
    .execute()
)

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