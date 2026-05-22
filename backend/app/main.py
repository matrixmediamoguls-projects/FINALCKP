"""Canonical FastAPI entrypoint shim.

This module intentionally re-exports the app from backend/server.py so any
legacy command like `uvicorn app.main:app` uses the same API surface as
`uvicorn server:app`.
"""

from server import app
