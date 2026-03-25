"""
Mood analysis from free text using NLTK VADER sentiment and lexical heuristics.

VADER produces a compound score in [-1, 1] that drives a coarse mood label and
base valence. Valence is mapped to [0, 1] and used as the initial energy; then
optional keyword groups adjust energy and valence when those words appear as
whole words (case-insensitive). Results are clamped to [0, 1] and rounded to
two decimals. This module has no web-framework dependencies.
"""

from __future__ import annotations

import re

import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

_vader_downloaded = False
_analyzer: SentimentIntensityAnalyzer | None = None

_KEYWORD_GROUPS: tuple[tuple[tuple[str, ...], tuple[float, float]], ...] = (
    # (keywords, (delta_energy, delta_valence))
    (("tired", "exhausted", "drained", "sleepy"), (-0.2, 0.0)),
    (("excited", "pumped", "energetic", "hyped"), (0.2, 0.0)),
    (("peaceful", "serene", "relaxed", "chill"), (-0.15, 0.05)),
    (("anxious", "stressed", "nervous", "overwhelmed"), (0.15, -0.1)),
    (("heartbroken", "devastated", "crying", "grief"), (-0.1, -0.2)),
)


def _ensure_vader_lexicon() -> None:
    global _vader_downloaded
    if not _vader_downloaded:
        nltk.download("vader_lexicon", quiet=True)
        _vader_downloaded = True


def _get_analyzer() -> SentimentIntensityAnalyzer:
    global _analyzer
    _ensure_vader_lexicon()
    if _analyzer is None:
        _analyzer = SentimentIntensityAnalyzer()
    return _analyzer


def _has_keyword(text: str, keyword: str) -> bool:
    return bool(re.search(rf"\b{re.escape(keyword)}\b", text, flags=re.IGNORECASE))


def _group_matches(text: str, keywords: tuple[str, ...]) -> bool:
    return any(_has_keyword(text, kw) for kw in keywords)


def _clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def analyze_mood(text: str) -> dict:
    """
    Score mood from ``text`` using VADER compound sentiment plus keyword tweaks.

    Steps: read VADER ``compound``; label mood as happy / sad / calm from
    thresholds; set ``valence = (compound + 1) / 2`` and ``energy = valence``;
    for each keyword group present in the text, apply its energy/valence deltas;
    clamp both to [0, 1] and round to two decimal places.

    Returns a dict: ``mood`` (str), ``valence`` (float), ``energy`` (float).
    """
    analyzer = _get_analyzer()
    compound = analyzer.polarity_scores(text)["compound"]

    if compound >= 0.2:
        mood = "happy"
    elif compound <= -0.2:
        mood = "sad"
    else:
        mood = "calm"

    valence = (compound + 1) / 2
    energy = valence

    for keywords, (de, dv) in _KEYWORD_GROUPS:
        if _group_matches(text, keywords):
            energy += de
            valence += dv

    valence = round(_clamp01(valence), 2)
    energy = round(_clamp01(energy), 2)

    return {"mood": mood, "valence": valence, "energy": energy}
