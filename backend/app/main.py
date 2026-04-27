from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, user, immersive

app = FastAPI()

# ✅ CORS FIX (this is what solves your error)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React (localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTES
app.include_router(auth.router, prefix="/auth")
app.include_router(user.router, prefix="/user")
app.include_router(immersive.router, prefix="/api/immersive")

# ✅ ROOT TEST
@app.get("/")
def root():
    return {"status": "API running"}