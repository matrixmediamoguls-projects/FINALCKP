from fastapi import APIRouter, HTTPException
from db_client import get_db

router = APIRouter()


@router.get("/tracks")
async def get_immersive_tracks():
    """
    Returns all active tracks from the reclamation_tracks table (or tracks table
    with immersive columns), ordered by sort_order.
    """
    try:
        db = await get_db()
        result = (
            await db.table("tracks")
            .select("*")
            .eq("is_active", True)
            .order("sort_order", desc=False)
            .execute()
        )
        tracks = result.data or []
        return {"tracks": tracks, "count": len(tracks)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/tracks/{track_id}")
async def get_immersive_track(track_id: str):
    """Returns a single active track by ID."""
    try:
        db = await get_db()
        result = (
            await db.table("tracks")
            .select("*")
            .eq("id", track_id)
            .eq("is_active", True)
            .single()
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Track not found")
        return result.data
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
