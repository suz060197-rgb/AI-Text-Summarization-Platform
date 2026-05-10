import OpenAI from 'openai';
import { fallbackSummarize } from '../backend/services/textProcessing.service.js';

export async function summarizeWithOpenAI({ text, format = 'paragraph', language = 'English', maxWords = 500 }) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackSummarize(text, format, maxWords);
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const formatInstruction =
      format === 'bullets'
        ? 'Return the summary as 3 to 6 concise bullet points.'
        : 'Return the summary as one cohesive professional paragraph.';

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You summarize documents accurately, preserve key facts, avoid unsupported claims, and write the final answer only in the requested target language. Use native script for Hindi and Marathi.'
        },
        {
          role: 'user',
          content: `Target language: ${language}. Keep the summary under ${maxWords} words. ${formatInstruction} Return only the summary, translated into the target language when needed.\n\n${text}`
        }
      ],
      temperature: 0.2
    });

    return response.choices[0]?.message?.content?.trim() || fallbackSummarize(text, format, maxWords);
  } catch (error) {
    console.warn(`OpenAI summarization failed, using local fallback: ${error.message}`);
    return fallbackSummarize(text, format, maxWords);
  }
}
