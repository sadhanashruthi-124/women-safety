from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=True)
    phone = Column(String, index=True, unique=True)
    password = Column(String)
    otp = Column(String, nullable=True)
    # For MVP, we'll store preferences as a simple JSON-compatible string or skip if complexity is high without migrations.
    # But to support the schema, let's just add it if we can drop/create DB.
    # preferences = Column(JSON, nullable=True)
