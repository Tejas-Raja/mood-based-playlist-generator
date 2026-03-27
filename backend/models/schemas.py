from typing import List, Optional

from pydantic import BaseModel


class TextInput(BaseModel):
    text: str


class MoodResponse(BaseModel):
    mood: str
    valence: float
    energy: float
    reason: str
    keywords_detected: List[str]


class Song(BaseModel):
    title: str
    artist: str
    album: str
    image: Optional[str] = None
    spotify_url: str


class PlaylistResponse(BaseModel):
    songs: List[Song]
    mood_hint: str
