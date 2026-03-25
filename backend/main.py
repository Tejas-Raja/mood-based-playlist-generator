import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import config
from routes import analyze, playlist

app = FastAPI()

logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="")
app.include_router(playlist.router, prefix="")


@app.get("/")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def validate_spotify_credentials_on_boot() -> None:
    if not (config.SPOTIFY_CLIENT_ID and config.SPOTIFY_CLIENT_SECRET):
        logger.warning(
            "Spotify credentials are missing. Set SPOTIFY_CLIENT_ID and "
            "SPOTIFY_CLIENT_SECRET to enable playlist recommendations."
        )
