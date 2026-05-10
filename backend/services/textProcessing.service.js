const STOP_WORDS = new Set([
  'about',
  'after',
  'again',
  'also',
  'because',
  'between',
  'could',
  'from',
  'have',
  'into',
  'more',
  'some',
  'such',
  'than',
  'that',
  'their',
  'there',
  'these',
  'this',
  'through',
  'were',
  'when',
  'where',
  'which',
  'with',
  'would'
]);

export function preprocessText(text = '') {
  return String(text)
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\S ]+/g, ' ')
    .trim();
}

export function extractKeywords(text, limit = 8) {
  const counts = new Map();
  const words = preprocessText(text).toLowerCase().match(/[a-z][a-z-]{3,}/g) || [];

  for (const word of words) {
    if (!STOP_WORDS.has(word)) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

export function fallbackSummarize(text, format = 'paragraph', maxWords = 120) {
  const sentences = preprocessText(text).match(/[^.!?]+[.!?]+/g) || [text];
  const selected = sentences.slice(0, 4).join(' ');
  const words = selected.split(/\s+/).slice(0, maxWords);

  if (format === 'bullets') {
    return words
      .join(' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 4)
      .map((sentence) => `- ${sentence.trim()}`)
      .join('\n');
  }

  return words.join(' ');
}
