from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from database import Base
from datetime import datetime

# 👤 USERS
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    phone = Column(String)
    role = Column(String, default="client")


# 📦 PRODUCTS
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(Text)
    category = Column(String)
    price = Column(Integer)
    image = Column(String)
    long_description = Column(Text)
    in_stock = Column(Boolean, default=True)

    brand = Column(String)
    model = Column(String)
    condition = Column(String)
    year = Column(Integer)

    features = Column(Text)


# �‍💼 AGENTS
class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)


# 📞 CALLS
class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)

    call_type = Column(String)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    subject = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    status = Column(String, default="pending")

    feedback = Column(Text, nullable=True)
    result = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)