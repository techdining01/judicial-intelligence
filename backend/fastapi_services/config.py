from decouple import config
from dotenv import load_dotenv

load_dotenv(".env")

# Must match Django's DJANGO_SECRET_KEY for JWT validation
SECRET_KEY = config("DJANGO_SECRET_KEY", default=config("SECRET_KEY", default="change-me-in-production"))
ALGORITHM = "HS256"
