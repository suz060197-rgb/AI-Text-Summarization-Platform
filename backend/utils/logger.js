export function logger(req, _res, next) {
  const startedAt = new Date().toISOString();
  console.log(`[${startedAt}] ${req.method} ${req.originalUrl}`);
  next();
}
