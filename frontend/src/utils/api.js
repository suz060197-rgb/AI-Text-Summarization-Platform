import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export async function summarizeText(payload) {
  const { data } = await api.post('/api/summarize/text', {
    text: payload.text,
    format: payload.format,
    language: payload.language,
    maxWords: payload.maxWords
  });
  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
}

export async function getProfile(token) {
  const { data } = await api.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function summarizeDocument(payload) {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('format', payload.format);
  formData.append('language', payload.language);
  formData.append('maxWords', payload.maxWords);

  const { data } = await api.post('/api/summarize/document', formData);
  return data;
}

export const summarizePdf = summarizeDocument;
