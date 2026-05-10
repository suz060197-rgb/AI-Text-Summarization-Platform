# System Architecture

The AI Text Summarization Platform uses a modular client-server architecture.

## Components

- **Frontend:** React application with Tailwind CSS for text input, PDF upload, configuration controls, summary display, keywords, and PDF export.
- **Backend:** Express API that validates requests, parses uploaded PDFs, preprocesses text, and returns structured summary responses.
- **AI Engine:** Provider abstraction for OpenAI and optional HuggingFace workflows.
- **Tests:** API and service-level tests for reliability.

## Data Flow

1. The user submits pasted text or uploads a PDF.
2. The frontend sends a JSON or multipart request to the backend.
3. The backend validates input and extracts text when needed.
4. Text is cleaned and passed to the AI engine.
5. The AI engine uses OpenAI if configured, otherwise a local fallback summarizer.
6. The backend returns summary, keywords, and statistics.
7. The frontend displays the result and supports exporting it.
