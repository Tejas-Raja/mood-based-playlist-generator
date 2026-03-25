from fastapi import APIRouter, Query

from models.schemas import PlaylistResponse, Song
from services.spotify import get_recommendations

router = APIRouter(tags=["playlist"])


def _raw_track_to_song(raw: dict) -> Song:
    return Song(
        title=raw.get("title") or "",
        artist=raw.get("artist") or "",
        album=raw.get("album") or "",
        image=raw.get("image"),
        spotify_url=raw.get("spotify_url") or "",
    )


@router.get("/playlist", response_model=PlaylistResponse)
def get_playlist(
    valence: float = Query(..., ge=0, le=1),
    energy: float = Query(..., ge=0, le=1),
    mood: str = Query("calm"),
) -> PlaylistResponse:
    raw_songs = get_recommendations(valence, energy)
    songs = [_raw_track_to_song(t) for t in raw_songs]
    mood_hint = f"We detected a {mood} mood — here's your playlist 🎵"
    return PlaylistResponse(songs=songs, mood_hint=mood_hint)
