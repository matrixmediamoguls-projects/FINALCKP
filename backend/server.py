from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Query, Header
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from db_client import get_db, init_db
import os
import logging
import requests
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import boto3
import redis.asyncio as redis

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

def get_required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} must be set")
    return value

def get_cors_origins() -> list[str]:
    raw_origins = os.environ.get("CORS_ORIGINS", "").strip()
    if not raw_origins or raw_origins == "*":
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    if "*" in origins:
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    return origins

def get_cookie_settings(request: Optional[Request] = None) -> dict:
    secure_cookie = os.environ.get("COOKIE_SECURE", "").lower()
    if secure_cookie in {"true", "1", "yes"}:
        secure = True
    elif secure_cookie in {"false", "0", "no"}:
        secure = False
    else:
        scheme = request.url.scheme if request else "https"
        secure = scheme == "https"

    return {
        "httponly": True,
        "secure": secure,
        "samesite": "none" if secure else "lax",
        "path": "/",
    }

# JWT Configuration
JWT_SECRET = get_required_env("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 168  # 7 days

# Object Storage - Cloudflare R2
R2_ACCOUNT_ID = os.environ.get("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.environ.get("R2_BUCKET_NAME")
APP_NAME = "chroma-key-protocol"
s3_client = None

def init_storage():
    global s3_client
    if s3_client is not None:
        return s3_client
        
    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY]):
        logger.warning("R2 Cloudflare credentials not set. Storage might fail.")
        return None
        
    endpoint_url = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    s3_client = boto3.client(
        "s3",
        endpoint_url=endpoint_url,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto"
    )
    return s3_client

def put_object(path: str, data: bytes, content_type: str) -> dict:
    client = init_storage()
    if not client:
        raise Exception("Storage client not initialized")
        
    client.put_object(
        Bucket=R2_BUCKET_NAME,
        Key=path,
        Body=data,
        ContentType=content_type
    )
    return {"path": path, "size": len(data)}

def get_object(path: str):
    client = init_storage()
    if not client:
        raise Exception("Storage client not initialized")
        
    resp = client.get_object(
        Bucket=R2_BUCKET_NAME,
        Key=path
    )
    data = resp['Body'].read()
    ct = resp.get('ContentType', 'application/octet-stream')
    return data, ct

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    level: int = 0
    current_act: int = 1
    completed_acts: List[int] = []
    act3_unlocked: bool = False
    is_admin: bool = False
    tier: str = "free"
    spins_earned: int = 0
    spins_used: int = 0
    owns_all_albums: bool = False
    created_at: Optional[str] = None

class ProgressUpdate(BaseModel):
    current_act: Optional[int] = None
    completed_acts: Optional[List[int]] = None
    level: Optional[int] = None

class LicenseKeyValidate(BaseModel):
    license_key: str

class CheckoutRequest(BaseModel):
    origin_url: str

class ReflectionItem(BaseModel):
    act: int
    item_id: str
    checked: bool

class ReflectionLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    act: int
    items: dict  # {item_id: bool}
    updated_at: str

class JournalEntryCreate(BaseModel):
    title: str
    content: str
    act: Optional[int] = None

class JournalEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    title: str
    content: str
    act: Optional[int] = None
    created_at: str
    updated_at: str


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "exp": expiration,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def serialize_user(user: dict) -> dict:
    """Serialize user object removing sensitive fields"""
    serialized = {k: v for k, v in user.items() if k != "password"}
    if "created_at" in serialized and hasattr(serialized["created_at"], "isoformat"):
        serialized["created_at"] = serialized["created_at"].isoformat()
    return serialized

async def get_current_user(request: Request) -> Optional[dict]:
    # Check cookie first
    session_token = request.cookies.get("session_token")
    
    # Then check Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
        
    client = await get_db()
    
    # Check if it's a JWT token
    payload = decode_jwt_token(session_token)
    if payload:
        user_res = await client.table("users").select("*").eq("user_id", payload["user_id"]).limit(1).execute()
        return user_res.data[0] if user_res.data else None
    
    return None


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, response: Response, request: Request):
    client = await get_db()
    # Check if user exists
    existing_res = await client.table("users").select("*").eq("email", user_data.email).limit(1).execute()
    if existing_res.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_pw = hash_password(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hashed_pw,
        "picture": None,
        "level": 0,
        "current_act": 1,
        "completed_acts": [],
        "tier": "free",
        "spins_earned": 0,
        "spins_used": 0,
        "owns_all_albums": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await client.table("users").insert(user_doc).execute()
    
    # Create JWT token
    token = create_jwt_token(user_id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        max_age=JWT_EXPIRATION_HOURS * 3600,
        **get_cookie_settings(request)
    )
    
    user_response = serialize_user(user_doc)
    return UserResponse(**user_response)

@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin, response: Response, request: Request):
    client = await get_db()
    user_res = await client.table("users").select("*").eq("email", credentials.email).limit(1).execute()
    if not user_res.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = user_res.data[0]
    
    if "password" not in user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user["user_id"])
    
    response.set_cookie(
        key="session_token",
        value=token,
        max_age=JWT_EXPIRATION_HOURS * 3600,
        **get_cookie_settings(request)
    )
    
    user_response = serialize_user(user)
    return UserResponse(**user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_endpoint(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_response = serialize_user(user)
    return UserResponse(**user_response)

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    response.delete_cookie(key="session_token", **get_cookie_settings(request))
    return {"message": "Logged out successfully"}


class BootstrapAdminPayload(BaseModel):
    email: EmailStr
    secret: str

@api_router.post("/auth/bootstrap-admin")
async def bootstrap_admin(payload: BootstrapAdminPayload):
    bootstrap_secret = os.environ.get("ADMIN_BOOTSTRAP_SECRET")
    if not bootstrap_secret:
        raise HTTPException(status_code=403, detail="Bootstrap is not enabled")
    if payload.secret != bootstrap_secret:
        raise HTTPException(status_code=403, detail="Invalid bootstrap secret")

    db = await get_db()

    # Block if any admin already exists
    existing_admins = await db.table("users").select("user_id").eq("is_admin", True).limit(1).execute()
    if existing_admins.data:
        raise HTTPException(status_code=403, detail="An admin account already exists. Use the admin panel to promote users.")

    user_res = await db.table("users").select("*").eq("email", payload.email).limit(1).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="No account found with that email. Register first, then run bootstrap.")

    user = user_res.data[0]
    await db.table("users").update({"is_admin": True}).eq("user_id", user["user_id"]).execute()
    logger.info(f"Admin bootstrapped for user {user['user_id']} ({payload.email})")
    return {"message": f"{payload.email} is now an admin."}


class SocialAuthPayload(BaseModel):
    provider: str  # "google" or "facebook"
    token: str     # Google access_token or Facebook access_token

@api_router.post("/auth/social", response_model=UserResponse)
async def social_auth(payload: SocialAuthPayload, response: Response, request: Request):
    import httpx

    if payload.provider == "google":
        async with httpx.AsyncClient() as hc:
            resp = await hc.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {payload.token}"}
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")
        data = resp.json()
        email = data.get("email")
        name = data.get("name") or email
        picture = data.get("picture")

    elif payload.provider == "facebook":
        async with httpx.AsyncClient() as hc:
            resp = await hc.get(
                "https://graph.facebook.com/me",
                params={"fields": "id,name,email,picture", "access_token": payload.token}
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Facebook token")
        data = resp.json()
        email = data.get("email")
        name = data.get("name", "Facebook User")
        pic_data = data.get("picture", {})
        picture = pic_data.get("data", {}).get("url") if isinstance(pic_data, dict) else None
        if not email:
            email = f"fb_{data.get('id')}@facebook.placeholder"

    else:
        raise HTTPException(status_code=400, detail="Unsupported provider")

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from provider")

    db = await get_db()
    user_res = await db.table("users").select("*").eq("email", email).limit(1).execute()

    if user_res.data:
        user = user_res.data[0]
        if not user.get("picture") and picture:
            await db.table("users").update({"picture": picture}).eq("user_id", user["user_id"]).execute()
            user["picture"] = picture
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "password": None,
            "picture": picture,
            "level": 0,
            "current_act": 1,
            "completed_acts": [],
            "tier": "free",
            "spins_earned": 0,
            "spins_used": 0,
            "owns_all_albums": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.table("users").insert(user).execute()

    token = create_jwt_token(user["user_id"])
    response.set_cookie(
        key="session_token",
        value=token,
        max_age=JWT_EXPIRATION_HOURS * 3600,
        **get_cookie_settings(request)
    )
    return UserResponse(**serialize_user(user))


# ==================== PROGRESS ENDPOINTS ====================

@api_router.get("/progress", response_model=UserResponse)
async def get_progress(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_response = serialize_user(user)
    return UserResponse(**user_response)

@api_router.put("/progress")
async def update_progress(progress: ProgressUpdate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    update_data = {}
    if progress.current_act is not None:
        update_data["current_act"] = progress.current_act
    if progress.completed_acts is not None:
        update_data["completed_acts"] = progress.completed_acts
    if progress.level is not None:
        update_data["level"] = progress.level
    
    if update_data:
        client = await get_db()
        await client.table("users").update(update_data).eq("user_id", user["user_id"]).execute()
    
    client = await get_db()
    updated_user_res = await client.table("users").select("*").eq("user_id", user["user_id"]).limit(1).execute()
    updated_user = updated_user_res.data[0]
    user_response = serialize_user(updated_user)
    return UserResponse(**user_response)


# ==================== REFLECTION LOG ENDPOINTS ====================

@api_router.get("/reflections/{act}")
async def get_reflections(act: int, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    reflection_res = await client.table("reflections").select("*").eq("user_id", user["user_id"]).eq("act", act).limit(1).execute()
    
    if not reflection_res.data:
        return {"act": act, "items": {}}
    
    return reflection_res.data[0]

@api_router.put("/reflections")
async def update_reflection(item: ReflectionItem, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    
    res = await client.table("reflections").select("*").eq("user_id", user["user_id"]).eq("act", item.act).limit(1).execute()
    if res.data:
        record = res.data[0]
        items = record.get("items", {})
        items[item.item_id] = item.checked
        await client.table("reflections").update({
            "items": items,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", record["id"]).execute()
    else:
        new_id = str(uuid.uuid4())
        await client.table("reflections").insert({
            "id": new_id,
            "user_id": user["user_id"],
            "act": item.act,
            "items": {item.item_id: item.checked},
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).execute()
    
    return {"success": True}


# ==================== JOURNAL ENDPOINTS ====================

@api_router.get("/journal", response_model=List[JournalEntry])
async def get_journal_entries(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    res = await client.table("journal_entries").select("*").eq("user_id", user["user_id"]).order("created_at", desc=True).limit(100).execute()
    
    return res.data

@api_router.post("/journal", response_model=JournalEntry)
async def create_journal_entry(entry: JournalEntryCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    entry_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["user_id"],
        "title": entry.title,
        "content": entry.content,
        "act": entry.act,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    client = await get_db()
    await client.table("journal_entries").insert(entry_doc).execute()
    return JournalEntry(**entry_doc)

@api_router.put("/journal/{entry_id}", response_model=JournalEntry)
async def update_journal_entry(entry_id: str, entry: JournalEntryCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    res = await client.table("journal_entries").update({
        "title": entry.title,
        "content": entry.content,
        "act": entry.act,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", entry_id).eq("user_id", user["user_id"]).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return JournalEntry(**res.data[0])

@api_router.delete("/journal/{entry_id}")
async def delete_journal_entry(entry_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    res = await client.table("journal_entries").delete().eq("id", entry_id).eq("user_id", user["user_id"]).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return {"success": True}


# ==================== PAYMENT & LICENSE ENDPOINTS ====================

RECLAMATION_LICENSE_PRICE = 29.99

@api_router.post("/payments/checkout")
async def create_checkout(checkout_req: CheckoutRequest, request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check if already unlocked
    if user.get("act3_unlocked"):
        raise HTTPException(status_code=400, detail="Act III is already unlocked")
    
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    origin = checkout_req.origin_url.rstrip("/")
    success_url = f"{origin}/dashboard?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/dashboard"
    
    checkout_request = CheckoutSessionRequest(
        amount=RECLAMATION_LICENSE_PRICE,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["user_id"],
            "product": "act3_universal_license",
            "source": "chroma_key_protocol"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Record transaction
    client = await get_db()
    await client.table("payment_transactions").insert({
        "session_id": session.session_id,
        "user_id": user["user_id"],
        "amount": RECLAMATION_LICENSE_PRICE,
        "currency": "usd",
        "payment_status": "initiated",
        "status": "pending",
        "metadata": {
            "user_id": user["user_id"],
            "product": "act3_universal_license"
        },
        "created_at": datetime.now(timezone.utc).isoformat()
    }).execute()
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    # Check if already processed
    tx_res = await client.table("payment_transactions").select("*").eq("session_id", session_id).eq("user_id", user["user_id"]).limit(1).execute()
    
    if not tx_res.data:
        raise HTTPException(status_code=404, detail="Transaction not found")
    tx = tx_res.data[0]
    
    if tx.get("payment_status") == "paid":
        return {"payment_status": "paid", "status": "complete", "already_processed": True}
    
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    checkout_status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction
    await client.table("payment_transactions").update({
        "payment_status": checkout_status.payment_status,
        "status": checkout_status.status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("session_id", session_id).execute()
    
    # If paid, unlock for the user — $29.99 = full tier
    if checkout_status.payment_status == "paid":
        await client.table("users").update(
            {"act3_unlocked": True, "tier": "full", "owns_all_albums": True}
        ).eq("user_id", user["user_id"]).execute()
    
    return {
        "payment_status": checkout_status.payment_status,
        "status": checkout_status.status
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            metadata = webhook_response.metadata or {}
            user_id = metadata.get("user_id")
            
            # Update transaction
            client = await get_db()
            await client.table("payment_transactions").update({
                "payment_status": "paid",
                "status": "complete",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }).eq("session_id", session_id).execute()
            
            # Unlock — full tier
            if user_id:
                await client.table("users").update(
                    {"act3_unlocked": True, "tier": "full", "owns_all_albums": True}
                ).eq("user_id", user_id).execute()
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error"}

@api_router.post("/license/validate")
async def validate_license(data: LicenseKeyValidate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    if user.get("act3_unlocked"):
        return {"success": True, "message": "Act III is already unlocked"}
    
    client = await get_db()
    key_upper = data.license_key.strip().upper()
    # Find valid license key
    license_doc_res = await client.table("license_keys").select("*").eq("key", key_upper).eq("used", False).limit(1).execute()
    
    if not license_doc_res.data:
        raise HTTPException(status_code=400, detail="Invalid or already used license key")
    
    # Mark key as used
    await client.table("license_keys").update({
        "used": True,
        "used_by": user["user_id"],
        "used_at": datetime.now(timezone.utc).isoformat()
    }).eq("key", key_upper).execute()
    
    # Unlock — license tier ($17.99 = protocol + streaming + Act III ownership)
    await client.table("users").update(
        {"act3_unlocked": True, "tier": "license"}
    ).eq("user_id", user["user_id"]).execute()
    
    return {"success": True, "message": "Protocol unlocked successfully"}

@api_router.get("/license/status")
async def license_status(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return {"act3_unlocked": user.get("act3_unlocked", False)}


# ==================== ADMIN HELPER ====================

async def require_admin(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== ADMIN: TRACKS ====================

@api_router.get("/admin/tracks")
async def list_tracks(request: Request):
    await require_admin(request)
    client = await get_db()
    res = await client.table("tracks").select("*").order("act", desc=False).execute()
    return {"tracks": res.data}

@api_router.post("/admin/tracks")
async def create_track(request: Request):
    await require_admin(request)
    body = await request.json()
    track = {
        "track_id": f"track_{uuid.uuid4().hex[:8]}",
        "name": body.get("name", "Untitled"),
        "act": body.get("act", 1),
        "type": body.get("type", "track"),
        "color": body.get("color", "#5ab038"),
        "lyrics": body.get("lyrics", ""),
        "audio_url": None,
        "audio_filename": None,
        "audio_storage_path": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    client = await get_db()
    await client.table("tracks").insert(track).execute()
    track.pop("_id", None)
    return track

@api_router.put("/admin/tracks/{track_id}")
async def update_track(track_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    updates = {"updated_at": datetime.now(timezone.utc).isoformat()}
    for field in ["name", "act", "type", "color", "lyrics", "lore", "lightcodes", "shadowcodes", "system_role", "spotify_uri"]:
        if field in body:
            updates[field] = body[field]
    client = await get_db()
    result = await client.table("tracks").update(updates).eq("track_id", track_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Track not found")
    return result.data[0]

@api_router.delete("/admin/tracks/{track_id}")
async def delete_track(track_id: str, request: Request):
    await require_admin(request)
    client = await get_db()
    result = await client.table("tracks").delete().eq("track_id", track_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Track not found")
    return {"success": True}

# ==================== ADMIN: AUDIO UPLOAD ====================

@api_router.post("/admin/tracks/{track_id}/audio")
async def upload_audio(track_id: str, request: Request, file: UploadFile = File(...)):
    await require_admin(request)
    
    client = await get_db()
    track_res = await client.table("tracks").select("*").eq("track_id", track_id).limit(1).execute()
    if not track_res.data:
        raise HTTPException(status_code=404, detail="Track not found")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "mp3"
    storage_path = f"{APP_NAME}/audio/{track_id}/{uuid.uuid4().hex}.{ext}"
    data = await file.read()
    
    content_type = file.content_type or "audio/mpeg"
    result = put_object(storage_path, data, content_type)
    
    updated_res = await client.table("tracks").update({
        "audio_storage_path": result["path"],
        "audio_filename": file.filename,
        "audio_content_type": content_type,
        "audio_size": result.get("size", len(data)),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("track_id", track_id).execute()
    
    return updated_res.data[0] if updated_res.data else None

@api_router.get("/audio/{track_id}")
async def stream_audio(track_id: str, request: Request):
    """Stream audio for any authenticated user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    track_res = await client.table("tracks").select("*").eq("track_id", track_id).limit(1).execute()
    if not track_res.data or not track_res.data[0].get("audio_storage_path"):
        raise HTTPException(status_code=404, detail="Audio not found")
    track = track_res.data[0]
    
    data, ct = get_object(track["audio_storage_path"])
    return Response(
        content=data,
        media_type=track.get("audio_content_type", ct),
        headers={
            "Content-Disposition": f'inline; filename="{track.get("audio_filename", "audio.mp3")}"'
        }
    )

@api_router.get("/audio/{track_id}/download")
async def download_audio(track_id: str, request: Request):
    """Download audio — requires full tier or owns_all_albums"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Gating: only full tier, owns_all_albums, or admin can download
    can_download = user.get("is_admin") or user.get("tier") == "full" or user.get("owns_all_albums")
    if not can_download:
        # License tier can download Act III tracks only
        client = await get_db()
        track_res = await client.table("tracks").select("*").eq("track_id", track_id).limit(1).execute()
        if not track_res.data:
            raise HTTPException(status_code=404, detail="Audio not found")
        if user.get("tier") == "license" and track_res.data[0].get("act") == 3:
            can_download = True
    if not can_download:
        raise HTTPException(status_code=403, detail="Upgrade to download. Full access ($29.99) includes ownership of all digital files.")
    
    client = await get_db()
    track_res2 = await client.table("tracks").select("*").eq("track_id", track_id).limit(1).execute()
    if not track_res2.data or not track_res2.data[0].get("audio_storage_path"):
        raise HTTPException(status_code=404, detail="Audio not found")
    track = track_res2.data[0]
    
    data, ct = get_object(track["audio_storage_path"])
    return Response(
        content=data,
        media_type=track.get("audio_content_type", ct),
        headers={
            "Content-Disposition": f'attachment; filename="{track.get("audio_filename", "audio.mp3")}"'
        }
    )

# ==================== ADMIN: LICENSE KEYS ====================

@api_router.get("/admin/license-keys")
async def list_license_keys(request: Request):
    await require_admin(request)
    client = await get_db()
    res = await client.table("license_keys").select("*").execute()
    return {"keys": res.data}

@api_router.post("/admin/license-keys")
async def create_license_key(request: Request):
    await require_admin(request)
    body = await request.json()
    key_value = body.get("key", f"CHROMA-{uuid.uuid4().hex[:8].upper()}")
    key_doc = {
        "key": key_value.upper(),
        "used": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    client = await get_db()
    await client.table("license_keys").insert(key_doc).execute()
    key_doc.pop("_id", None)
    return key_doc

@api_router.delete("/admin/license-keys/{key}")
async def delete_license_key(key: str, request: Request):
    await require_admin(request)
    client = await get_db()
    result = await client.table("license_keys").delete().eq("key", key.upper()).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"success": True}

# ==================== ADMIN: USERS ====================

@api_router.get("/admin/users")
async def list_users(request: Request):
    await require_admin(request)
    client = await get_db()
    res = await client.table("users").select("user_id, email, name, picture, level, current_act, completed_acts, tier, spins_earned, spins_used, owns_all_albums, act3_unlocked, is_admin, created_at, updated_at").execute()
    return {"users": res.data}

@api_router.put("/admin/users/{user_id}")
async def update_user(user_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    updates = {}
    for field in ["is_admin", "act3_unlocked", "level", "current_act", "tier", "spins_earned", "spins_used", "owns_all_albums"]:
        if field in body:
            updates[field] = body[field]
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    client = await get_db()
    result = await client.table("users").update(updates).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

# ==================== PUBLIC: TRACKS LIST ====================

@api_router.get("/tracks")
async def public_tracks(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    client = await get_db()
    res = await client.table("tracks").select("*").order("act", desc=False).execute()
    
    tracks = []
    for t in res.data:
        track_data = {
            "track_id": t["track_id"],
            "name": t["name"],
            "act": t["act"],
            "type": t["type"],
            "color": t.get("color", "#5ab038"),
            "has_audio": bool(t.get("audio_storage_path")),
            "audio_filename": t.get("audio_filename"),
            "lyrics": t.get("lyrics", ""),
            "lore": t.get("lore", ""),
            "lightcodes": t.get("lightcodes", ""),
            "shadowcodes": t.get("shadowcodes", ""),
            "system_role": t.get("system_role", ""),
            "spotify_uri": t.get("spotify_uri", "")
        }
        tracks.append(track_data)
    return {"tracks": tracks}


# ==================== PROTOCOL ENGINE (AGENTIC) ====================

PROTOCOL_SYSTEM_PROMPT = """You are The Seeker — a guide within the Chroma Key Protocol system. You are not a therapist. You are a structured reflection engine that helps users move through four elemental phases of self-awareness.

CORE IDENTITY:
- You speak with quiet authority, precision, and warmth
- Your tone is cyber-noir poetic — direct but never cold
- You use the elemental language: Earth (awareness), Water (reflection), Fire (reclamation), Air (integration)
- You reference the Seeker mythology naturally, never forcefully

PRIVACY-FIRST PROTOCOL — THIS IS CRITICAL:
- NEVER ask users to share specific traumatic details, names, or situations
- At the START of every new session, remind users: "You don't need to share anything you're uncomfortable with. Use phrases like 'my situation' or 'my acknowledged pattern' instead of specifics."
- If a user starts sharing specific details, gently redirect: "I hear you. You can hold those details privately. What matters here is the pattern, not the specifics."
- Measure engagement by PROCESS DEPTH, not personal disclosure
- Encourage generalized language: "my situation", "my acknowledged pattern", "the dynamic I recognize", "the system I'm navigating"

FIVE-PHASE PROTOCOL PER ACT:

Phase 0 — RECOGNITION: Help user identify their emotional domain. Ask: "Where are you right now?" Accept generalized answers. Classify: lost, numb, focused, driven, curious, hurt, rebuilding.

Phase 1 — EXCAVATION: Help user convert isolated feelings into recognized patterns. Don't ask "what happened" — ask "what keeps happening?" or "what pattern do you notice?" If they give a one-time event, redirect: "That sounds like an event. Is there a recurring pattern underneath it?"

Phase 2 — SPECIFICITY: Help user identify the SOURCE SYSTEM of their pattern — not specific people/events, but categories: family system, relationship dynamic, work environment, self-perception, societal pressure, inherited belief. Offer options, let them choose.

Phase 3 — CLAIMING: Help user articulate the pattern and its cost in their OWN words using generalized language. If they hedge or minimize, gently note it: "I notice you're softening that. Can you say it more directly, even using general terms?" Score their clarity, not their vulnerability.

Phase 4 — DECLARATION: Help user craft a sovereign statement. This is their takeaway — what they now recognize and what they choose going forward. Lock this statement as their protocol artifact.

SCORING (internal, share gently):
- Depth: How deeply they engage with the process (1-10)
- Clarity: How clearly they can name their pattern in general terms (1-10)  
- Ownership: How much they own the pattern vs externalize blame (1-10)
- Mastery threshold: All three >= 7

RESPONSE STYLE:
- Keep responses under 150 words unless expanding on mythology
- Use line breaks for breathing room
- Reference the current Act's element naturally
- End responses with a clear next prompt or question
- Use "◇" as your signature marker

CURRENT ACT CONTEXT WILL BE PROVIDED IN EACH MESSAGE.
"""

class ProtocolMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    act: Optional[int] = 1

class ProtocolResponse(BaseModel):
    response: str
    session_id: str
    phase: int
    scores: Optional[dict] = None

@api_router.post("/protocol/chat")
async def protocol_chat(data: ProtocolMessage, request: Request):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = user["user_id"]
    session_id = data.session_id or f"protocol_{user_id}_{uuid.uuid4().hex[:8]}"
    act_num = data.act or 1
    
    client = await get_db()
    # Get or create session in DB
    session_res = await client.table("protocol_sessions").select("*").eq("session_id", session_id).eq("user_id", user_id).limit(1).execute()
    
    if not session_res.data:
        session = {
            "session_id": session_id,
            "user_id": user_id,
            "act": act_num,
            "phase": 0,
            "scores": {"depth": 0, "clarity": 0, "ownership": 0},
            "messages": [],
            "declaration": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await client.table("protocol_sessions").insert(session).execute()
    else:
        session = session_res.data[0]
    
    act_elements = {1: "Earth", 2: "Fire", 3: "Water", 4: "Air"}
    act_names = {1: "The Fractured Veil", 2: "Reclamation", 3: "The Reflection Chamber", 4: "The Crucible Code"}
    act_themes = {
        1: "awareness, recognition, naming what was hidden beneath the surface",
        2: "reflection, shadow work, looking clearly into the mirror of self",
        3: "reclamation, fire, burning away what is not essential, sovereignty",
        4: "integration, equilibrium, holding all of it with grace"
    }
    
    act_context = f"""
CURRENT CONTEXT:
- Act: {act_num} ({act_names.get(act_num, 'Unknown')})
- Element: {act_elements.get(act_num, 'Earth')}
- Theme: {act_themes.get(act_num, '')}
- Current Phase: {session['phase']}
- User's current scores: Depth={session['scores']['depth']}, Clarity={session['scores']['clarity']}, Ownership={session['scores']['ownership']}
- This is message #{len(session.get('messages', [])) + 1} in this session

IMPORTANT: After each response, output a JSON block on a NEW LINE at the very end (the user won't see this):
SCORES:{{"phase":{session['phase']},"depth":{session['scores']['depth']},"clarity":{session['scores']['clarity']},"ownership":{session['scores']['ownership']}}}
Update the scores based on the user's response quality. Advance the phase when appropriate.
"""
    
    system_msg = PROTOCOL_SYSTEM_PROMPT + act_context
    
    # Build message history for context
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_msg
    )
    chat.with_model("openai", "gpt-5.2")
    
    # Replay previous messages for context
    prev_messages = session.get("messages", [])
    for msg in prev_messages[-10:]:  # Last 10 messages for context
        if msg["role"] == "user":
            user_msg = UserMessage(text=msg["content"])
            # Add to chat history without sending
            chat.messages.append({"role": "user", "content": msg["content"]})
        elif msg["role"] == "assistant":
            chat.messages.append({"role": "assistant", "content": msg["content"]})
    
    # Send the new message
    user_msg = UserMessage(text=data.message)
    try:
        response_text = await chat.send_message(user_msg)
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Protocol chat error: {error_msg}")
        if "Budget" in error_msg or "budget" in error_msg:
            raise HTTPException(status_code=402, detail="LLM budget exceeded. Please add balance to your Universal Key in Profile > Universal Key > Add Balance.")
        raise HTTPException(status_code=500, detail="The Seeker is temporarily unavailable. Please try again.")
    
    # Parse scores from response
    new_phase = session["phase"]
    new_scores = session["scores"].copy()
    clean_response = response_text
    
    if "SCORES:" in response_text:
        parts = response_text.split("SCORES:")
        clean_response = parts[0].strip()
        try:
            import json
            score_str = parts[1].strip().split("\n")[0]
            score_data = json.loads(score_str)
            new_phase = score_data.get("phase", session["phase"])
            new_scores["depth"] = score_data.get("depth", session["scores"]["depth"])
            new_scores["clarity"] = score_data.get("clarity", session["scores"]["clarity"])
            new_scores["ownership"] = score_data.get("ownership", session["scores"]["ownership"])
        except:
            pass
    
    # Store messages and update session
    new_messages = session.get("messages", [])
    new_messages.append({"role": "user", "content": data.message, "timestamp": datetime.now(timezone.utc).isoformat()})
    new_messages.append({"role": "assistant", "content": clean_response, "timestamp": datetime.now(timezone.utc).isoformat()})
    
    await client.table("protocol_sessions").update({
        "messages": new_messages,
        "phase": new_phase,
        "scores": new_scores,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("session_id", session_id).execute()
    
    return {
        "response": clean_response,
        "session_id": session_id,
        "phase": new_phase,
        "scores": new_scores,
        "message_count": len(new_messages)
    }

@api_router.get("/protocol/sessions")
async def list_protocol_sessions(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    res = await client.table("protocol_sessions").select("session_id, user_id, act, phase, scores, declaration, created_at, updated_at").eq("user_id", user["user_id"]).order("updated_at", desc=True).limit(20).execute()
    return {"sessions": res.data}

@api_router.get("/protocol/sessions/{session_id}")
async def get_protocol_session(session_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    session_res = await client.table("protocol_sessions").select("*").eq("session_id", session_id).eq("user_id", user["user_id"]).limit(1).execute()
    if not session_res.data:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_res.data[0]


# ==================== PROTOCOL STEPS (5-Step Engine) ====================

class StepDataSave(BaseModel):
    data: dict
    completed: bool = False

@api_router.get("/protocol/steps/{act}")
async def get_act_steps(act: int, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    client = await get_db()
    res = await client.table("protocol_steps").select("*").eq("user_id", user["user_id"]).eq("act", act).order("step", desc=False).execute()
    return {"act": act, "steps": res.data}

@api_router.post("/protocol/steps/{act}/{step}")
async def save_step_data(act: int, step: int, body: StepDataSave, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    client = await get_db()
    res = await client.table("protocol_steps").select("*").eq("user_id", user["user_id"]).eq("act", act).eq("step", step).limit(1).execute()
    
    if res.data:
        await client.table("protocol_steps").update({
            "data": body.data,
            "completed": body.completed,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", res.data[0]["id"]).execute()
    else:
        await client.table("protocol_steps").insert({
            "user_id": user["user_id"],
            "act": act,
            "step": step,
            "data": body.data,
            "completed": body.completed,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).execute()
    
    return {"success": True}


# ==================== ACT COMPLETION & SPINS ====================

@api_router.post("/protocol/complete-act/{act}")
async def complete_act(act: int, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check all 5 steps are completed for this act
    client = await get_db()
    steps_res = await client.table("protocol_steps").select("*", count="exact").eq("user_id", user["user_id"]).eq("act", act).eq("completed", True).execute()
    completed_count = steps_res.count if steps_res.count is not None else len(steps_res.data)
    if completed_count < 5:
        raise HTTPException(status_code=400, detail=f"Complete all 5 steps first ({completed_count}/5 done)")
    
    # Check if already completed
    existing_res = await client.table("act_completions").select("*").eq("user_id", user["user_id"]).eq("act", act).limit(1).execute()
    if existing_res.data:
        return {"success": True, "message": "Act already completed", "spin_awarded": False}
    
    # Mark act complete
    await client.table("act_completions").insert({
        "user_id": user["user_id"],
        "act": act,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }).execute()
    
    # Award a spin and update user
    completed_acts = user.get("completed_acts", [])
    if act not in completed_acts:
        completed_acts.append(act)
    
    new_level = len(completed_acts)
    spins_earned = user.get("spins_earned", 0) + 1
    
    await client.table("users").update({
        "completed_acts": completed_acts,
        "level": new_level,
        "spins_earned": spins_earned,
        "current_act": min(act + 1, 4)
    }).eq("user_id", user["user_id"]).execute()
    
    return {"success": True, "spin_awarded": True, "level": new_level, "spins_available": spins_earned - user.get("spins_used", 0)}

@api_router.get("/spins")
async def get_spins(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    earned = user.get("spins_earned", 0)
    used = user.get("spins_used", 0)
    return {"spins_earned": earned, "spins_used": used, "spins_available": earned - used}

@api_router.post("/spins/use")
async def use_spin(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    earned = user.get("spins_earned", 0)
    used = user.get("spins_used", 0)
    if used >= earned:
        raise HTTPException(status_code=400, detail="No spins available. Complete an Act to earn a spin.")
    client = await get_db()
    await client.table("users").update({"spins_used": used + 1}).eq("user_id", user["user_id"]).execute()
    return {"success": True, "spins_available": earned - used - 1}


# ==================== ADMIN: SETTINGS ====================

@api_router.get("/admin/settings")
async def get_admin_settings(request: Request):
    await require_admin(request)
    client = await get_db()
    res = await client.table("app_settings").select("*").execute()
    settings = {s["key"]: s["value"] for s in res.data}
    # Defaults
    if "addon_price" not in settings:
        settings["addon_price"] = 5.00
    return settings

@api_router.put("/admin/settings")
async def update_admin_settings(request: Request):
    await require_admin(request)
    body = await request.json()
    client = await get_db()
    for key, value in body.items():
        await client.table("app_settings").upsert({"key": key, "value": value}).execute()
    return {"success": True}

@api_router.get("/settings/public")
async def get_public_settings(request: Request):
    """Public-facing settings (addon price etc)"""
    client = await get_db()
    res = await client.table("app_settings").select("*").execute()
    settings = {s["key"]: s["value"] for s in res.data if s["key"] == "addon_price"}
    if "addon_price" not in settings:
        settings["addon_price"] = 5.00
    return settings


# ==================== ROOT ENDPOINT ====================

@api_router.get("/")
async def root():
    return {"message": "Chroma Key Protocol API"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=get_cors_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    pass

@app.on_event("startup")
async def startup_event():
    await init_db()
    try:
        init_storage()
        logger.info("Object storage initialized successfully")
    except Exception as e:
        logger.error(f"Storage init failed (non-fatal): {e}")
