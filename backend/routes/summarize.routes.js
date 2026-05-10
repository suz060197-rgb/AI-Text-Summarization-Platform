import express from 'express';
import multer from 'multer';
import { summarizeDocumentController, summarizeTextController } from '../services/summarization.service.js';

const router = express.Router();
const SUPPORTED_DOCUMENT_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

function hasSupportedExtension(fileName = '') {
  const lowerName = fileName.toLowerCase();
  return lowerName.endsWith('.pdf') || lowerName.endsWith('.docx');
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!SUPPORTED_DOCUMENT_TYPES.has(file.mimetype) && !hasSupportedExtension(file.originalname)) {
      const error = new Error('Only PDF and Word .docx files are supported.');
      error.status = 400;
      cb(error);
      return;
    }
    cb(null, true);
  }
});

router.post('/text', summarizeTextController);
router.post('/document', upload.single('file'), summarizeDocumentController);
router.post('/pdf', upload.single('file'), summarizeDocumentController);

export default router;
