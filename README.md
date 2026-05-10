# AI Text Summarization Platform

A professional full-stack platform for summarizing pasted text and uploaded PDF documents using AI models. The project is designed as a clean academic or portfolio submission with modular frontend, backend, AI integration, testing, and documentation.

## Objective

The objective of this project is to build an end-to-end AI-powered text summarization system that accepts raw text or PDF files, preprocesses the extracted content, sends it to an AI summarization provider, and displays a concise summary with optional keywords and export-ready output.

## Features

- Text input summarization
- PDF and Word .docx upload with text extraction
- Text cleaning and preprocessing
- OpenAI summarization integration with local fallback
- HuggingFace integration scaffold
- Summary formats: paragraph or bullet points
- Multi-language summaries for English, Spanish, Hindi, and Marathi
- Login/register authentication flow with locally stored demo accounts
- Keyword extraction and keyword badges
- Export summary as a local PDF from the browser
- Copy summary to clipboard
- Dark and light theme toggle with persistent preference
- Drag-and-drop PDF/Word upload with progress indicator
- Character counter for pasted text
- Animated loading state during summarization
- Toast notifications for success and error states
- Local browser history dashboard for previous summaries
- Graceful backend error handling
- Unit and integration tests
- Clean responsive React UI with Tailwind CSS

## System Architecture

```text
User Browser
   |
   v
React Frontend
   |
   | HTTP requests
   v
Express Backend
   |
   | text/PDF processing
   v
AI Engine Layer
   |
   | OpenAI API or HuggingFace model
   v
Structured Summary Response
```

## Folder Structure

```text
AI-Text-Summarization-Platform/
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- components/
|       |-- pages/
|       |-- styles/
|       `-- utils/
|-- backend/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   `-- server.js
|-- ai_engine/
|   |-- openai_client.js
|   |-- huggingface_client.py
|   `-- preprocess.py
|-- datasets/
|-- docs/
|-- tests/
|-- package.json
|-- requirements.txt
`-- README.md
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+ for optional HuggingFace scripts
- OpenAI API key for production AI summaries

### Install Node Dependencies

```bash
npm install
```

On Windows PowerShell, use `npm.cmd` if script execution blocks `npm.ps1`:

```powershell
npm.cmd install
```

### Install Python Dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Environment Variables

Create `backend/.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
AUTH_SECRET=replace_with_a_long_random_secret
```

The backend includes a deterministic fallback summarizer so the project can run without an API key during demos.

### Run the Backend

```bash
npm run dev --workspace backend
```

Backend URL: `http://localhost:5000`

### Run the Frontend

```bash
npm run dev --workspace frontend
```

Frontend URL: `http://localhost:5173`

### Run Both Together

```bash
npm run dev
```

Windows PowerShell alternative:

```powershell
npm.cmd run dev
```

## UI Design Notes

The frontend uses Tailwind CSS with a responsive desktop dashboard that stacks cleanly on mobile. The backend/API logic is unchanged; the redesign is isolated to `frontend/src`.

Design improvements include:

- Persistent dark/light theme toggle stored in `localStorage`
- Accessible form controls with ARIA labels and keyboard-friendly buttons
- Drag-and-drop PDF upload zone with file validation and progress feedback
- Styled text input with character counter
- Default summary length set to 500 words, with a supported range from 40 to 500 words
- Animated loading panel during summarization
- Card-based summary output with expandable sections
- Keyword highlights and badges
- Copy-to-clipboard and PDF export buttons
- Toast notifications for upload, summary, copy, export, and error states
- Local summary history dashboard with timestamps, reopen, and delete actions
- Header login/register panel with persistent browser session
- Target language selector for English, Spanish, Hindi, and Marathi

### Screenshot Instructions

To capture screenshots for a report or demo:

1. Run the app with `npm run dev`.
2. Open `http://localhost:5173`.
3. Capture the empty dashboard state.
4. Generate a summary and capture the populated summary cards.
5. Toggle dark mode and capture the responsive dark theme.
6. Resize the browser to mobile width and capture the stacked layout.

## AI Integration Instructions

The backend summary service calls `ai_engine/openai_client.js`. If `OPENAI_API_KEY` is configured, summaries are generated with OpenAI. If no key is present, or if the provider is unavailable, the service uses a local extractive fallback for testing and classroom demos.

For Spanish, Hindi, and Marathi output, configure `OPENAI_API_KEY` so the AI provider can translate and summarize into the selected target language. Without an API key, the fallback summarizer extracts key source-language text for offline demos.

## Authentication Notes

The app includes a demo-friendly authentication system:

- Users can register and login from the frontend header.
- Passwords are hashed with Node.js `crypto.scrypt`.
- Auth tokens are signed with an HMAC secret.
- Local demo users are stored in `backend/data/users.json`, which is ignored by Git.

The optional HuggingFace script is available at `ai_engine/huggingface_client.py`:

```bash
python ai_engine/huggingface_client.py "Long text to summarize..."
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/register` | Create a user account |
| `POST` | `/api/auth/login` | Login and receive an auth token |
| `GET` | `/api/auth/me` | Return the authenticated profile |
| `POST` | `/api/summarize/text` | Summarize pasted text |
| `POST` | `/api/summarize/document` | Upload and summarize a PDF or Word .docx file |
| `POST` | `/api/summarize/pdf` | Backward-compatible PDF/document upload alias |

## Testing Commands

```bash
npm test
```

PowerShell alternative:

```powershell
npm.cmd test
```

Backend tests cover text summarization, validation, health checks, and keyword extraction.

## Evaluation Criteria

- Correctness of summary generation flow
- Clean modular folder structure
- Proper API validation and error handling
- PDF parsing support
- Professional UI and user experience
- Responsive desktop and mobile layout
- Accessibility for form controls and actions
- Quality of documentation
- Test coverage for key backend behavior
- Ability to configure real AI providers through environment variables

## Learning Outcomes

By completing this project, learners practice:

- Building a full-stack AI application
- Designing REST APIs with Express
- Integrating external AI services
- Handling file uploads and PDF parsing
- Creating reusable React components
- Managing environment-based configuration
- Writing integration tests
- Applying modern UI/UX patterns with Tailwind CSS
- Documenting software architecture professionally

## Demo Video Instructions

1. Start the backend and frontend.
2. Show the homepage and explain text/PDF input options.
3. Paste a sample article and generate a paragraph summary.
4. Show the animated loading state and success toast.
5. Open summary cards, copy the result, and export it as PDF.
6. Switch to bullet mode and regenerate.
7. Upload a PDF and demonstrate extracted summarization.
8. Reopen and delete an item from summary history.
9. Toggle dark mode and show the responsive mobile layout.
10. Briefly show the folder structure, README, and tests.

## Documentation

Additional documentation is stored in `docs/`, including architecture notes and report content that can be converted into `project_report.pdf`.

## License

This project is licensed under the MIT License.
