from fastapi import FastAPI, APIRouter
from data import data_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://localhost:5173/",
]

any_port_localhost_regex = r"^http:\/\/localhost:\d+$" 

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origin_regex=any_port_localhost_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(data_router.data_router)