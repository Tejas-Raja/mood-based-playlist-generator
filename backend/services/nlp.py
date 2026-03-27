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

KEYWORD_REASONS: dict[str, str] = {
    "tired": "low energy detected from 'tired'",
    "exhausted": "low energy detected from 'exhausted'",
    "drained": "low energy from 'drained'",
    "sleepy": "low energy from 'sleepy'",
    "excited": "high energy boost from 'excited'",
    "pumped": "high energy from 'pumped'",
    "energetic": "high energy from 'energetic'",
    "hyped": "high energy from 'hyped'",
    "peaceful": "calm positive tone from 'peaceful'",
    "serene": "calm tone from 'serene'",
    "relaxed": "calm tone from 'relaxed'",
    "chill": "relaxed feeling from 'chill'",
    "anxious": "tension detected from 'anxious'",
    "stressed": "stress detected from 'stressed'",
    "nervous": "unease from 'nervous'",
    "overwhelmed": "high tension from 'overwhelmed'",
    "heartbroken": "deep sadness from 'heartbroken'",
    "devastated": "strong sadness from 'devastated'",
    "crying": "sadness from 'crying'",
    "grief": "grief tone detected",
}


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


def _sentiment_description(compound: float) -> str:
    if compound >= 0.5:
        return "strongly positive sentiment"
    if compound >= 0.2:
        return "mildly positive sentiment"
    if compound <= -0.5:
        return "strongly negative sentiment"
    if compound <= -0.2:
        return "mildly negative sentiment"
    return "neutral sentiment"


def analyze_mood(text: str) -> dict:
    """
    Score mood from ``text`` using VADER compound sentiment plus keyword tweaks.

    Steps: read VADER ``compound``; label mood as happy / sad / calm from
    thresholds; set ``valence = (compound + 1) / 2`` and ``energy = valence``;
    for each keyword group present in the text, apply its energy/valence deltas;
    clamp both to [0, 1] and round to two decimal places.

    Returns a dict with ``mood`` (str), ``valence`` (float), ``energy`` (float),
    ``reason`` (str), and ``keywords_detected`` (list[str]).
    """
    analyzer = _get_analyzer()
    try:
        compound = analyzer.polarity_scores(text)["compound"]
    except LookupError:
        # NLTK sometimes needs an on-demand lexicon download (e.g. fresh
        # environment before first run). Auto-download and retry once.
        nltk.download("vader_lexicon", quiet=True)
        global _analyzer
        _analyzer = None
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

    lowered_text = text.lower()
    keywords_detected = [kw for kw in KEYWORD_REASONS if kw in lowered_text]
    if keywords_detected:
        sentiment_desc = _sentiment_description(compound)
        keyword_reason_text = ", ".join(KEYWORD_REASONS[kw] for kw in keywords_detected)
        reason = (
            f"Detected {mood} tone due to {sentiment_desc}. "
            f"Also noted: {keyword_reason_text}."
        )
    else:
        reason = (
            f"Detected {mood} tone based on overall sentiment "
            f"(score: {compound:.2f})."
        )

    return {
        "mood": mood,
        "valence": valence,
        "energy": energy,
        "reason": reason,
        "keywords_detected": keywords_detected,
    }
