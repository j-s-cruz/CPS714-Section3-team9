from fastapi import APIRouter

data_router = APIRouter()

@data_router.get("/data/", tags=["data"])
async def data_get():
    return [{"This": "Is"}, {"Some": "Data"}]

@data_router.get("/data/test", tags=["data"])
async def data_get():
    return [{"test": "test"}]


class MembershipData:
    def __init__(self, date: str, member_count: int):
        self.date = date
        self.member_count = member_count

@data_router.get("/data/membership_data", tags=["data"])
async def membership_data_get():
    membership_data = [
        ["2024-01-01", 50],
        ["2024-02-01", 75],
        ["2024-03-01", 100],
        ["2024-04-01", 80],
        ["2024-05-01", 120],
        ["2024-06-01", 90],
        ["2024-07-01", 110],
    ]

    return membership_data