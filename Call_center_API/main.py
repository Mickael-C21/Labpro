from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import JWTError
import json
import model, schema, auth
import seed_products
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

# Create tables
model.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def product_to_dict(product: model.Product):
    try:
        features = json.loads(product.features) if isinstance(product.features, str) else product.features
    except Exception:
        features = [item.strip() for item in (product.features or "").split(",") if item.strip()]

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "category": product.category,
        "price": product.price,
        "image": product.image,
        "longDescription": product.long_description or "",
        "inStock": product.in_stock if product.in_stock is not None else True,
        "features": features,
        "specifications": {
            "brand": product.brand,
            "model": product.model,
            "year": product.year,
            "condition": product.condition,
        },
    }


def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> model.User:
    """Extract user from JWT token in Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    token = authorization.replace("Bearer ", "").strip()
    payload = auth.decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("user_id")
    user = db.query(model.User).filter(model.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


# ---- AUTH ----

@app.post("/register", response_model=schema.UserOut)
def register(user: schema.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(model.User).filter(model.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = auth.hash_password(user.password)

    new_user = model.User(
        name=user.name,
        email=user.email,
        password=hashed,
        phone=user.phone
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login")
def login(credentials: schema.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(model.User).filter(model.User.email == credentials.email).first()

    if not db_user or not auth.verify_password(credentials.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = auth.create_token({
        "user_id": db_user.id,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": schema.UserOut.model_validate(db_user)
    }


@app.get("/me", response_model=schema.UserOut)
def get_profile(current_user: model.User = Depends(get_current_user)):
    return current_user


@app.put("/me", response_model=schema.UserOut)
def update_profile(update: schema.UserUpdate, db: Session = Depends(get_db), current_user: model.User = Depends(get_current_user)):
    if update.name:
        current_user.name = update.name
    if update.phone:
        current_user.phone = update.phone
    
    db.commit()
    db.refresh(current_user)
    return current_user


# ---- AGENTS ----

def ensure_default_agents(db: Session):
    """Create default agents if none exist"""
    if db.query(model.Agent).count() == 0:
        db.add_all([
            model.Agent(name="Agent Thomas", email="thomas@labconnect.fr"),
            model.Agent(name="Agent Sophie", email="sophie@labconnect.fr"),
        ])
        db.commit()


def ensure_default_products(db: Session):
    """Peuple la table produits avec les données de démo si elle est vide"""
    if db.query(model.Product).count() == 0:
        seed_products.run()


def ensure_default_admin(db: Session):
    """Crée un administrateur de démonstration si aucun admin n'existe."""
    if db.query(model.User).filter(model.User.role == "admin").count() == 0:
        admin_email = "admin@test.fr"
        admin_password = "admin123"
        if not db.query(model.User).filter(model.User.email == admin_email).first():
            db.add(model.User(
                name="Admin LabConnect",
                email=admin_email,
                password=auth.hash_password(admin_password),
                phone="0000000000",
                role="admin"
            ))
            db.commit()


@app.on_event("startup")
def startup():
    db = SessionLocal()
    ensure_default_agents(db)
    ensure_default_admin(db)
    ensure_default_products(db)
    db.close()


@app.get("/agents", response_model=List[schema.AgentOut])
def get_agents(db: Session = Depends(get_db)):
    ensure_default_agents(db)
    return db.query(model.Agent).all()





# ---- PRODUCTS ----

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(model.Product).all()
    return [product_to_dict(product) for product in products]


@app.get("/products/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(model.Product).filter(model.Product.id == id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product_to_dict(product)


@app.post("/products")
def create_product(product: schema.ProductCreate, db: Session = Depends(get_db)):
    product_data = product.dict()
    product_data["features"] = json.dumps(product_data["features"])

    new_product = model.Product(**product_data)

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# ---- CALLS ----

@app.post("/calls", response_model=schema.CallOut)
def create_call(call: schema.CallCreate, current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Auto-assign agent (round-robin or random from 2 default agents)
    agents = db.query(model.Agent).all()
    if not agents:
        ensure_default_agents(db)
        agents = db.query(model.Agent).all()
    
    agent = agents[0] if agents else None  # Simple assignment: first agent
    
    new_call = model.Call(
        user_id=current_user.id,
        product_id=call.product_id,
        agent_id=agent.id if agent else None,
        call_type=call.call_type,
        name=call.name,
        phone=call.phone,
        email=call.email,
        subject=call.subject,
        scheduled_at=call.scheduled_at,
        status="pending"
    )

    db.add(new_call)
    db.commit()
    db.refresh(new_call)

    return new_call


@app.get("/calls", response_model=List[schema.CallOut])
def get_calls(current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "admin":
        # Admin sees all calls
        return db.query(model.Call).order_by(model.Call.created_at.desc()).all()
    else:
        # Regular users see only their calls
        return db.query(model.Call).filter(model.Call.user_id == current_user.id).order_by(model.Call.created_at.desc()).all()


@app.get("/calls/{id}", response_model=schema.CallOut)
def get_call(id: int, current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    call = db.query(model.Call).filter(model.Call.id == id).first()

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    if current_user.role != "admin" and call.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this call")

    return call


@app.put("/calls/{id}/feedback")
def add_feedback(id: int, data: schema.Feedback, current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    call = db.query(model.Call).filter(model.Call.id == id).first()

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    if current_user.role != "admin" and call.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this call")

    call.feedback = data.feedback
    call.result = data.result
    call.status = "done"

    db.commit()
    db.refresh(call)

    return call


@app.patch("/calls/{id}", response_model=schema.CallOut)
def update_call(id: int, update: schema.CallCreate, current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Mise à jour partielle d'un appel : statut et/ou notes de l'agent.
    Réservé aux admins (les clients ne modifient pas leurs propres rendez-vous)."""
    call = db.query(model.Call).filter(model.Call.id == id).first()

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    if update.status is not None:
        call.status = update.status
    if update.feedback is not None:
        call.feedback = update.feedback
    if update.result is not None:
        call.result = update.result

    db.commit()
    db.refresh(call)

    return call


# ---- USERS ----

@app.get("/users")
def get_users(current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    return db.query(model.User).all()


@app.get("/users/{id}")
def get_user(id: int, current_user: model.User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if current_user.role != "admin" and current_user.id != id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return user