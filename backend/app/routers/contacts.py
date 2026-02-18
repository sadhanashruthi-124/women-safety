from fastapi import APIRouter
from app import schemas

router = APIRouter(tags=["Contacts"])

@router.post("/emergency-contacts")
def save_contacts(data: schemas.ContactList):
    # In a real app, save to DB linked to current user
    print(f"Saving {len(data.contacts)} contacts")
    for c in data.contacts:
        print(f" - {c.name}: {c.phone}")
    return {"message": "Contacts saved"}
