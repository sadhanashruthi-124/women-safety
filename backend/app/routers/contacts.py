from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import SessionLocal

router = APIRouter(tags=["Contacts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/emergency-contacts")
def save_contacts(data: schemas.ContactList, db: Session = Depends(get_db)):
    # Find user
    user = db.query(models.User).filter(models.User.phone == data.user_phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    print(f"Saving {len(data.contacts)} contacts for user {user.name}")
    
    # Optional: Clear existing contacts if we want to replace them
    # db.query(models.Contact).filter(models.Contact.user_id == user.id).delete()
    
    for c in data.contacts:
        db_contact = models.Contact(
            name=c.name,
            phone=c.phone,
            user_id=user.id
        )
        db.add(db_contact)
        print(f" - Added {c.name}: {c.phone}")
        
    db.commit()
    return {"message": "Contacts saved successfully"}
