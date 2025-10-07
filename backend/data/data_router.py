from fastapi import APIRouter

data_router = APIRouter()

@data_router.get("/data/", tags=["data"])
async def data_get():
    return [{"This": "Is"}, {"Some": "Data"}]

@data_router.get("/data/test", tags=["data"])
async def data_get():
    return [{"test": "test"}]