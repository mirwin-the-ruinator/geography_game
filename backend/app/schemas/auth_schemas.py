from pydantic import BaseModel

class SignupRequest(BaseModel):
    username: str
    contact: str
    notification: str  # 'email' or 'sms'

class LoginRequest(BaseModel):
    username: str
    contact: str
    notification: str
