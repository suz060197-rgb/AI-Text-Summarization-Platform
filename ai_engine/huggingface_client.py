"""Optional HuggingFace summarization client.

Usage:
    python ai_engine/huggingface_client.py "Long text to summarize..."
"""

import sys
from transformers import pipeline


def summarize(text: str) -> str:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    result = summarizer(text, max_length=130, min_length=35, do_sample=False)
    return result[0]["summary_text"]


if __name__ == "__main__":
    input_text = " ".join(sys.argv[1:]).strip()
    if not input_text:
        raise SystemExit("Please provide text to summarize.")
    print(summarize(input_text))
