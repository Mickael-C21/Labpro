import os
import sys

# Ensure Call_center_API is on path so local modules can be imported
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CALL_CENTER_PATH = os.path.join(ROOT, 'Call_center_API')
if CALL_CENTER_PATH not in sys.path:
    sys.path.insert(0, CALL_CENTER_PATH)

from database import SessionLocal
import model, auth

# Configure here or via env
EMAIL = os.getenv('NEW_ADMIN_EMAIL', 'admin2@test.fr')
PASSWORD = os.getenv('NEW_ADMIN_PASSWORD', 'Admin456!')
PHONE = os.getenv('NEW_ADMIN_PHONE', '0000000001')

# bcrypt has a 72-byte limit; truncate to avoid backend errors from long env values
if isinstance(PASSWORD, str):
    PASSWORD = PASSWORD[:72]

with SessionLocal() as db:
    existing = db.query(model.User).filter(model.User.email == EMAIL).first()
    if existing:
        print(f"Admin with email {EMAIL} already exists (id={existing.id})")
    else:
        try:
            hashed = auth.hash_password(PASSWORD)
        except Exception:
            # fallback to bcrypt directly if passlib backend misbehaves in this env
            import bcrypt as _bcrypt
            hashed = _bcrypt.hashpw(PASSWORD.encode('utf-8'), _bcrypt.gensalt()).decode('utf-8')
        new = model.User(name='Admin 2', email=EMAIL, password=hashed, phone=PHONE, role='admin')
        db.add(new)
        db.commit()
        db.refresh(new)
        print(f"Created admin {EMAIL} id={new.id}")
