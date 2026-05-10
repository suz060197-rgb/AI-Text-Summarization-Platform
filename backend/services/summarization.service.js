import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { summarizeWithOpenAI } from '../../ai_engine/openai_client.js';
import { SummaryRequest } from '../models/SummaryRequest.js';
import { createHttpError } from '../utils/errorHandler.js';
import { extractKeywords, preprocessText } from './textProcessing.service.js';

export async function summarizeTextController(req, res, next) {
  try {
    const request = new SummaryRequest(req.body);
    const result = await buildSummaryResponse(request);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function summarizeDocumentController(req, res, next) {
  try {
    if (!req.file) {
      throw createHttpError(400, 'Please upload a PDF or Word .docx file using the "file" field.');
    }

    const parsedDocument = await extractDocumentText(req.file);
    const extractedText = preprocessText(parsedDocument.text);

    if (extractedText.length < 40) {
      throw createHttpError(
        400,
        `This ${parsedDocument.label} does not contain enough readable text to summarize. If it is scanned or image-only, use OCR first or paste the text manually.`
      );
    }

    const request = new SummaryRequest({
      ...req.body,
      text: extractedText
    });

    const result = await buildSummaryResponse(request);
    res.json({ ...result, source: parsedDocument.source });
  } catch (error) {
    next(error);
  }
}

async function extractDocumentText(file) {
  const fileName = file.originalname?.toLowerCase() || '';

  if (file.mimetype === 'application/pdf' || fileName.endsWith('.pdf')) {
    const parsed = await pdf(file.buffer);
    return {
      text: parsed.text,
      label: 'PDF',
      source: { type: 'pdf', pages: parsed.numpages, fileName: file.originalname }
    };
  }

  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return {
      text: parsed.value,
      label: 'Word document',
      source: { type: 'word', fileName: file.originalname }
    };
  }

  throw createHttpError(400, 'Unsupported document type. Upload a PDF or Word .docx file.');
}

export async function buildSummaryResponse(request) {
  const cleanedText = preprocessText(request.text);

  if (cleanedText.length < 40) {
    throw createHttpError(400, 'Please provide at least 40 characters of readable text.');
  }

  const summary = await summarizeWithOpenAI({
    text: cleanedText,
    format: request.format,
    language: request.language,
    maxWords: request.maxWords
  });

  return {
    summary,
    format: request.format,
    language: request.language,
    keywords: extractKeywords(cleanedText),
    stats: {
      originalCharacters: request.text.length,
      processedCharacters: cleanedText.length,
      estimatedReadingMinutes: Math.max(1, Math.ceil(cleanedText.split(/\s+/).length / 220))
    },
    source: { type: 'text' }
  };
}
