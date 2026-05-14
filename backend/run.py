import os
import uvicorn

port = int(os.environ.get("PORT", 5000))
reload_enabled = os.environ.get("UVICORN_RELOAD", "").lower() in {"1", "true", "yes"}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=port, reload=reload_enabled)
