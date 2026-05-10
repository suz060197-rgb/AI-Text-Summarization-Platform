"""Text preprocessing helpers for optional Python AI workflows."""

import re


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "")
    text = re.sub(r"[^\w\s.,;:!?()/-]", "", text)
    return text.strip()


def chunk_text(text: str, max_words: int = 700) -> list[str]:
    words = clean_text(text).split()
    return [" ".join(words[index : index + max_words]) for index in range(0, len(words), max_words)]
