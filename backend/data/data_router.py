from fastapi import APIRouter

from data.data_service import *

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

    membership_data = getMembershipData()
    
    return membership_data

@data_router.get("/data/signups_data", tags=["data"])
async def signups_data_get():

    signups_data = getSignupsData()
    return signups_data

@data_router.get("/data/cancellations_data", tags=["data"])
async def cancellations_data_get():

    cancellations_data = getCancellationsData()

    return cancellations_data