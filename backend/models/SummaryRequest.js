import { createHttpError } from '../utils/errorHandler.js';

const SUPPORTED_FORMATS = new Set(['paragraph', 'bullets']);
const SUPPORTED_LANGUAGES = new Set(['English', 'Spanish', 'Hindi', 'Marathi']);

export class SummaryRequest {
  constructor(payload = {}) {
    this.text = payload.text || '';
    this.format = payload.format || 'paragraph';
    this.language = payload.language || 'English';
    this.maxWords = Number(payload.maxWords || 500);

    this.validate();
  }

  validate() {
    if (!this.text || typeof this.text !== 'string') {
      throw createHttpError(400, 'Text content is required.');
    }

    if (!SUPPORTED_FORMATS.has(this.format)) {
      throw createHttpError(400, 'Format must be either "paragraph" or "bullets".');
    }

    if (!SUPPORTED_LANGUAGES.has(this.language)) {
      throw createHttpError(400, 'Language must be English, Spanish, Hindi, or Marathi.');
    }

    if (Number.isNaN(this.maxWords) || this.maxWords < 40 || this.maxWords > 500) {
      throw createHttpError(400, 'maxWords must be between 40 and 500.');
    }
  }
}
