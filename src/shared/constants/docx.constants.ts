/** Jobs stuck in QUEUED/PROCESSING longer than this are marked FAILED. */
export const DOCX_JOB_STALE_MS = 5 * 60 * 1000;

export const DOCX_JOB_STALE_MESSAGE =
  'Docx generation timed out. Ensure Redis and MinIO are running (docker compose up -d redis minio) and the worker is active.';
