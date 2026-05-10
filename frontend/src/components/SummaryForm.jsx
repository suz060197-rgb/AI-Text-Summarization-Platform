import { useRef, useState } from 'react';
import { FileUp, Loader2, UploadCloud, Wand2, X } from 'lucide-react';

export default function SummaryForm({ onSubmit, loading, onNotify }) {
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('paragraph');
  const [language, setLanguage] = useState('English');
  const [maxWords, setMaxWords] = useState(500);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function submit(event) {
    event.preventDefault();
    onSubmit({ text, file, format, language, maxWords });
  }

  function acceptFile(selectedFile) {
    if (!selectedFile) {
      return;
    }

    const lowerName = selectedFile.name.toLowerCase();
    const isSupported =
      selectedFile.type === 'application/pdf' ||
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.docx');

    if (!isSupported) {
      onNotify('Please upload a valid PDF or Word .docx file.', 'error');
      return;
    }

    setFile(selectedFile);
    setUploadProgress(100);
    onNotify('Document ready for summarization.', 'success');
  }

  function removeFile() {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <label className="block">
        <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span>Text input</span>
          <span className="font-medium text-slate-400">{text.length.toLocaleString()} characters</span>
        </span>
        <textarea
          aria-label="Text to summarize"
          className="h-64 w-full resize-none rounded-md border border-slate-300 bg-white p-4 leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Paste article, research notes, meeting transcript, or study material..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>

      <div
        className={`rounded-lg border border-dashed p-4 transition ${
          dragging
            ? 'border-teal bg-teal/10'
            : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white p-3 text-teal shadow-sm dark:bg-slate-900">
              <UploadCloud size={24} aria-hidden="true" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Drag and drop document
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {file ? file.name : 'or browse to upload a PDF or Word .docx file'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Browse and upload PDF or Word document"
          >
            <FileUp size={16} aria-hidden="true" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            aria-label="Upload PDF or Word document"
            onChange={(event) => acceptFile(event.target.files?.[0])}
          />
        </div>

        {file && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{Math.round(file.size / 1024).toLocaleString()} KB</span>
              <button
                type="button"
                onClick={removeFile}
                className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
                aria-label="Remove uploaded document"
              >
                <X size={13} aria-hidden="true" />
                Remove
              </button>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="sr-only">Summary options</legend>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Format</span>
          <select
            aria-label="Summary format"
            className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullets</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Language</span>
          <select
            aria-label="Summary language"
            className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Max words</span>
          <input
            aria-label="Maximum summary words"
            type="number"
            min="40"
            max="500"
            className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            value={maxWords}
            onChange={(event) => setMaxWords(event.target.value)}
          />
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={loading || (!text.trim() && !file)}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-teal px-4 py-3 font-semibold text-white transition hover:bg-teal/90 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
      >
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Wand2 size={18} aria-hidden="true" />}
        {loading ? 'Generating...' : file ? 'Generate from Document' : 'Generate Summary'}
      </button>
    </form>
  );
}
