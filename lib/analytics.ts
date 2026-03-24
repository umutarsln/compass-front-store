/**
 * Store analytics: event queue and batch send to backend.
 * Non-blocking; errors logged silently.
 * Detaylı log: development'ta [Analytics] prefix ile console'a yazılır.
 */

const SESSION_ID_KEY = 'compass_analytics_session_id';
const QUEUE_KEY = 'compass_analytics_queue';
const MAX_QUEUE = 20;
const BATCH_SIZE = 10;

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

function log(...args: unknown[]) {
  if (isDev) {
    console.log('[Analytics]', ...args);
  }
}

export type AnalyticsEventType =
  | 'PRODUCT_VIEW'
  | 'PRODUCT_TIME'
  | 'CART_ADD'
  | 'PAGE_VIEW'
  | 'ORDER_START'
  | 'ORDER_COMPLETE';

export interface AnalyticsEventItem {
  type: AnalyticsEventType;
  productId?: string;
  variantId?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  durationSeconds?: number;
  page?: string;
  quantity?: number;
  orderId?: string;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(SESSION_ID_KEY, id);
    log('session created:', id);
  }
  return id;
}

function getQueue(): AnalyticsEventItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setQueue(queue: AnalyticsEventItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
  } catch {
    // ignore
  }
}

function sendBatch(events: AnalyticsEventItem[]): void {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    log('sendBatch: NEXT_PUBLIC_API_URL yok, gönderim atlanıyor');
    return;
  }
  if (events.length === 0) {
    log('sendBatch: event yok, atlanıyor');
    return;
  }
  const sessionId = getSessionId();
  const url = `${apiUrl}/store/analytics/events`;
  const body = {
    events: events.map((e) => ({
      type: e.type,
      productId: e.productId ?? undefined,
      variantId: e.variantId ?? undefined,
      sessionId: e.sessionId ?? sessionId,
      userId: e.userId ?? undefined,
      durationSeconds: e.durationSeconds,
      page: e.page,
      quantity: e.quantity,
      orderId: e.orderId,
    })),
  };
  const types = events.map((e) => e.type).join(', ');
  log('sendBatch: POST', url, 'events=', events.length, 'types=[', types, ']');
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  })
    .then((res) => {
      if (res.ok) {
        log('sendBatch: success status=', res.status);
      } else {
        log('sendBatch: HTTP error status=', res.status, res.statusText);
      }
    })
    .catch((err) => {
      log('sendBatch: failed', err?.message ?? err);
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] send failed:', err?.message);
      }
    });
}

/**
 * Enqueue an event and optionally flush (send) if batch size reached.
 */
export function trackEvent(event: AnalyticsEventItem): void {
  if (typeof window === 'undefined') {
    log('trackEvent: SSR, atlanıyor', event.type);
    return;
  }
  log('trackEvent: enqueue', event.type, event.productId ? `productId=${event.productId}` : '', event.page ? `page=${event.page}` : '', event.durationSeconds != null ? `duration=${event.durationSeconds}s` : '');
  const queue = getQueue();
  queue.push(event);
  setQueue(queue);
  if (queue.length >= BATCH_SIZE) {
    log('trackEvent: batch dolu, gönderiliyor queue.length=', queue.length);
    setQueue([]);
    sendBatch(queue.slice(0, BATCH_SIZE));
  }
}

/**
 * Flush all queued events (e.g. on page unload).
 */
export function flushAnalytics(): void {
  if (typeof window === 'undefined') return;
  const queue = getQueue();
  setQueue([]);
  log('flushAnalytics: queue length=', queue.length);
  if (queue.length > 0) {
    sendBatch(queue);
  }
}

/**
 * Get current session ID (for optional use in events).
 */
export function getAnalyticsSessionId(): string {
  return getSessionId();
}
