import os
from dotenv import load_dotenv

load_dotenv()

APP_ENV = os.getenv("APP_ENV", "local")
DATABASE_URL = os.getenv("DATABASE_URL")

BASE_URL = (
    "http://localhost:8000"
    if APP_ENV == "local"
    else os.getenv("BASE_URL", "https://your-default-url.com")
)
