from pydantic import BaseModel

class UserBase(BaseModel):
    phone: str

class UserCreate(UserBase):
    password: str
    name: str | None = None
    preferences: dict | None = None

class UserLogin(UserBase):
    password: str

class OTPVerify(UserBase):
    otp: str

class UserResponse(UserBase):
    id: int
    name: str | None = None
    preferences: dict | None = None

    class Config:
        orm_mode = True

class PanicResponse(BaseModel):
    message: str
    panic_probability: float
    is_panic: bool

class Contact(BaseModel):
    name: str
    phone: str
    id: str | None = None

class ContactList(BaseModel):
    contacts: list[Contact]

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    speed: float | None = None
    timestamp: float | None = None
