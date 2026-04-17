import os
from supabase import create_async_client, AsyncClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

_client = None

async def init_db() -> AsyncClient:
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        _client = await create_async_client(url, key)
    return _client

async def get_db() -> AsyncClient:
    if _client is None:
        return await init_db()
    return _client
