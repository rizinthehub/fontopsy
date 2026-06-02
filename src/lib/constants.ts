export const APP_NAME = 'Fontopsy';

// ─── Upload ───────────────────────────────────────────────────────────────────
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

// ─── Vision ───────────────────────────────────────────────────────────────────
export const VISION_MONTHLY_CAP = 900;
export const VISION_REQUEST_TIMEOUT_MS = 9_000;

// ─── Matching ─────────────────────────────────────────────────────────────────
export const MIN_HIGH_CONFIDENCE = 0.75;
export const MIN_MEDIUM_CONFIDENCE = 0.50;
export const ALTERNATIVES_COUNT_DEFAULT = 3;
export const ALTERNATIVES_COUNT_LOW_CONF = 4;

// ─── Storage ──────────────────────────────────────────────────────────────────
export const MAX_RECENT = 5;
export const RECENT_STORAGE_KEY = 'fontopsy.recent';
export const RESULTS_STORAGE_KEY = 'fontopsy.results';

// ─── TypeTester ───────────────────────────────────────────────────────────────
export const TYPE_TESTER_DEFAULT_SIZE = 72;
export const TYPE_TESTER_MIN_SIZE = 16;
export const TYPE_TESTER_MAX_SIZE = 160;
export const TYPE_TESTER_STEP = 4;
export const TYPE_TESTER_DEBOUNCE_MS = 80;

// ─── Share card ───────────────────────────────────────────────────────────────
export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 630;

// ─── Rate limiting ────────────────────────────────────────────────────────────
export const IP_RATE_LIMIT_PER_MINUTE = 10;

// ─── Toast ────────────────────────────────────────────────────────────────────
export const TOAST_DURATION_DEFAULT_MS = 3_000;
export const TOAST_DURATION_ERROR_MS = 5_000;

// ─── Font loading ─────────────────────────────────────────────────────────────
export const FONT_LOAD_TIMEOUT_MS = 5_000;