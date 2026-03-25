"""
Spotify recommendations via Spotipy. Auth is isolated so swapping
``SpotifyClientCredentials`` for ``SpotifyOAuth`` (or another auth manager)
only requires changing how ``get_spotify_client`` obtains its ``auth_manager``.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import config
from fastapi import HTTPException
from spotipy import Spotify
from spotipy.exceptions import SpotifyException, SpotifyOauthError
from spotipy.oauth2 import SpotifyClientCredentials

logger = logging.getLogger(__name__)


def build_auth_manager() -> SpotifyClientCredentials:
    """
    Client-credentials auth for server-to-server calls.
    Replace this with ``SpotifyOAuth`` (or similar) when user login is required.
    """
    return SpotifyClientCredentials(
        client_id=config.SPOTIFY_CLIENT_ID,
        client_secret=config.SPOTIFY_CLIENT_SECRET,
    )


def get_spotify_client() -> Spotify:
    """Return a configured ``Spotify`` API client (swap auth here for OAuth)."""
    # Some environments configure HTTP proxies that can break Spotify calls in
    # unexpected ways (e.g. returning 404s). If proxies are configured via env,
    # force "no proxy" for this client.
    proxy_env_set = any(
        os.getenv(k)
        for k in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy")
    )
    return Spotify(
        auth_manager=build_auth_manager(),
        requests_timeout=10,
        proxies={} if proxy_env_set else None,
    )


def _seed_genres_for_mood(valence: float, energy: float) -> list[str]:
    if energy > 0.6 and valence > 0.5:
        return ["pop", "dance-pop"]
    if energy > 0.6 and valence <= 0.5:
        return ["rock", "hard-rock"]
    if energy <= 0.4 and valence > 0.5:
        return ["acoustic", "chill"]
    if energy <= 0.4 and valence <= 0.5:
        return ["blues", "acoustic"]
    return ["pop", "rock"]


def _track_to_entry(track: dict[str, Any]) -> dict[str, Any]:
    album = track.get("album") or {}
    artists = track.get("artists") or []
    first_artist = artists[0].get("name") if artists else None
    images = album.get("images") or []
    image_url = images[0].get("url") if images else None
    external = track.get("external_urls") or {}
    return {
        "title": track.get("name"),
        "artist": first_artist,
        "album": album.get("name"),
        "image": image_url,
        "spotify_url": external.get("spotify"),
    }


def _fallback_tracks_via_search(
    sp: Spotify,
    seed_genres: list[str],
    limit: int,
    valence: float,
    energy: float,
) -> list[dict[str, Any]]:
    """
    Fallback when `/v1/recommendations` is blocked (often returns HTTP 404).

    Uses `search` with genre seeds and returns up to `limit` tracks.
    """
    energy_word = "energetic" if energy > 0.6 else "chill"
    valence_word = "happy" if valence > 0.5 else "sad"
    queries = [g for g in seed_genres if g][:2] or ["pop"]
    queries = [f"{q} {energy_word} {valence_word}" for q in queries]
    tracks: list[dict[str, Any]] = []

    for q in queries:
        remaining = limit - len(tracks)
        if remaining <= 0:
            break
        try:
            res = sp.search(q=q, type="track", limit=min(remaining, 10))
            items = (res.get("tracks") or {}).get("items") or []
            tracks.extend(items)
        except SpotifyException:
            continue

    return tracks[:limit]


def _fetch_recommendations(
    sp: Spotify, valence: float, energy: float
) -> list[dict[str, Any]]:
    valence = max(0.0, min(1.0, float(valence)))
    energy = max(0.0, min(1.0, float(energy)))
    seed_genres = _seed_genres_for_mood(valence, energy)
    try:
        result = sp.recommendations(
            seed_genres=seed_genres,
            target_valence=valence,
            target_energy=energy,
            limit=10,
        )
    except SpotifyException as e:
        # If the request fails with a "not found" style response, retry
        # without target constraints, and if still blocked, fall back to
        # a search-based approach.
        if e.http_status == 404:
            try:
                result = sp.recommendations(
                    seed_genres=seed_genres,
                    limit=10,
                )
                tracks = result.get("tracks") or []
                return [_track_to_entry(t) for t in tracks]
            except SpotifyException:
                tracks = _fallback_tracks_via_search(
                    sp, seed_genres, limit=10, valence=valence, energy=energy
                )
                return [_track_to_entry(t) for t in tracks]
        raise
    tracks = result.get("tracks") or []
    return [_track_to_entry(t) for t in tracks]


def _ensure_credentials() -> None:
    if not (config.SPOTIFY_CLIENT_ID and config.SPOTIFY_CLIENT_SECRET):
        raise HTTPException(
            status_code=500,
            detail=(
                "Spotify is not configured: set SPOTIFY_CLIENT_ID and "
                "SPOTIFY_CLIENT_SECRET in the backend .env file."
            ),
        )


def get_recommendations(valence: float, energy: float) -> list[dict]:
    """
    Return up to 10 recommended tracks tuned to ``valence`` and ``energy``,
    using genre seeds derived from those signals.
    """
    _ensure_credentials()
    try:
        sp = get_spotify_client()
        return _fetch_recommendations(sp, valence, energy)
    except SpotifyException as e:
        logger.exception("Spotify API error")

        if e.http_status == 429:
            retry_after = None
            try:
                retry_after = (e.headers or {}).get("Retry-After")
            except Exception:
                retry_after = None
            if retry_after:
                detail = f"Spotify rate limit exceeded. Retry in {retry_after} seconds."
            else:
                detail = "Spotify rate limit exceeded. Please retry in a moment."
            raise HTTPException(status_code=429, detail=detail) from e

        if e.http_status in (400, 401, 403):
            raise HTTPException(
                status_code=500,
                detail="Spotify authentication failed. Check your API keys.",
            ) from e

        raise HTTPException(status_code=500, detail=f"Spotify API request failed: {e}") from e
    except SpotifyOauthError as e:
        logger.exception("Spotify OAuth error")
        raise HTTPException(
            status_code=500,
            detail="Spotify authentication failed. Check your API keys.",
        ) from e
    except Exception as e:
        logger.exception("Unexpected error calling Spotify")
        raise HTTPException(
            status_code=500,
            detail=f"Could not load recommendations from Spotify: {e}",
        ) from e
