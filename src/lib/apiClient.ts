/**
 * Cliente HTTP central para hablar con el backend.
 *
 * Motivación: el backend corre en Render (free) y se DUERME tras ~15 min de
 * inactividad, tardando 30–60s en despertar (arranque en frío). Sin manejo,
 * los `fetch` quedan colgados o fallan sin explicación. Este cliente añade:
 *   - timeout por intento (AbortController)
 *   - reintentos con backoff ante fallos de red y respuestas de cold-start (502/503/504)
 *   - errores normalizados ({ type: 'offline' | 'timeout' | 'http' })
 *   - un bus de estado para que la UI muestre "el servidor está despertando"
 *
 * Centralizarlo además elimina el fetch copiado/pegado en cada context.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type BackendStatus = "online" | "waking" | "offline";
export type ApiErrorType = "offline" | "timeout" | "http";

export class ApiError extends Error {
  type: ApiErrorType;
  status?: number;
  body?: any;

  constructor(
    type: ApiErrorType,
    message: string,
    status?: number,
    body?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.status = status;
    this.body = body;
  }

  /** true cuando el problema es de conectividad (servidor dormido / red), no de negocio. */
  get isConnectivity() {
    return this.type === "offline" || this.type === "timeout";
  }
}

// --- Bus de estado del backend (para el aviso global) -----------------------

type StatusListener = (status: BackendStatus) => void;
const listeners = new Set<StatusListener>();
let currentStatus: BackendStatus = "online";

export function subscribeBackendStatus(listener: StatusListener): () => void {
  listeners.add(listener);
  listener(currentStatus);
  return () => listeners.delete(listener);
}

export function getBackendStatus(): BackendStatus {
  return currentStatus;
}

function setBackendStatus(status: BackendStatus) {
  if (status === currentStatus) return;
  currentStatus = status;
  listeners.forEach((l) => l(status));
}

// --- Configuración de reintentos --------------------------------------------

const DEFAULT_TIMEOUT_MS = 12_000; // por intento
const MAX_ATTEMPTS = 4; // ~cubre un cold start de Render de hasta ~1 min
const RETRYABLE_STATUS = new Set([502, 503, 504]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export interface ApiFetchOptions extends RequestInit {
  /** ms de timeout por intento (default 12s). */
  timeoutMs?: number;
  /** número máximo de intentos (default 4). */
  maxAttempts?: number;
  /** si es false, no reintenta ni reporta estado (útil para pings). */
  retry?: boolean;
}

/**
 * Hace una petición al backend. `path` es relativo (ej. "/projects/123"),
 * se le antepone NEXT_PUBLIC_BACKEND_URL.
 *
 * Lanza `ApiError` normalizado en caso de fallo. Devuelve el `Response` crudo
 * para que el llamador decida cómo parsear (json/blob/etc.).
 */
export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxAttempts = MAX_ATTEMPTS,
    retry = true,
    ...init
  } = options;

  const url = `${BACKEND_URL}${path}`;
  const attempts = retry ? maxAttempts : 1;
  let lastError: ApiError | null = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetchWithTimeout(url, init, timeoutMs);

      // Cold start de Render: el proxy responde 502/503/504 mientras arranca.
      if (RETRYABLE_STATUS.has(res.status) && retry && attempt < attempts) {
        setBackendStatus("waking");
        await sleep(backoffDelay(attempt));
        continue;
      }

      setBackendStatus("online");
      return res;
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      lastError = aborted
        ? new ApiError("timeout", "La petición tardó demasiado (timeout).")
        : new ApiError("offline", "No se pudo contactar al servidor.");

      if (retry && attempt < attempts) {
        setBackendStatus("waking");
        await sleep(backoffDelay(attempt));
        continue;
      }
    }
  }

  if (retry) setBackendStatus("offline");
  throw lastError ?? new ApiError("offline", "No se pudo contactar al servidor.");
}

function backoffDelay(attempt: number): number {
  // 2s, 4s, 8s… con un pequeño jitter.
  return Math.min(2_000 * 2 ** (attempt - 1), 12_000) + Math.random() * 500;
}

/**
 * Helper: hace la petición y devuelve el JSON ya parseado. Si la respuesta no
 * es OK, lanza un ApiError de tipo 'http' con el mensaje del backend.
 */
export async function apiJson<T = any>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    let body: any = undefined;
    let message = res.statusText;
    try {
      body = await res.json();
      message = body?.message || message;
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    throw new ApiError("http", message, res.status, body);
  }
  // 204 u otras respuestas sin cuerpo
  if (res.status === 204) return undefined as T;
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

/**
 * Ping ligero al endpoint de salud. No reintenta (queremos una señal rápida).
 * Devuelve true si el servidor está despierto.
 */
export async function pingHealth(timeoutMs = 4_000): Promise<boolean> {
  try {
    const res = await apiFetch("/health", {
      retry: false,
      timeoutMs,
      cache: "no-store",
    });
    const ok = res.ok;
    setBackendStatus(ok ? "online" : "waking");
    return ok;
  } catch {
    setBackendStatus("offline");
    return false;
  }
}
