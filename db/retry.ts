const TRANSIENT_ERROR_PATTERN =
  /fetch failed|connect timeout|UND_ERR_CONNECT_TIMEOUT|ECONNRESET|ETIMEDOUT|socket hang up|network|other side closed/i;

export function isTransientDatabaseError(error: unknown): boolean {
  let current: unknown = error;

  while (current instanceof Error) {
    if (TRANSIENT_ERROR_PATTERN.test(current.message)) {
      return true;
    }
    current = current.cause;
  }

  return false;
}

export async function withDbRetry<T>(
  query: () => Promise<T>,
  { retries = 3, delayMs = 150 }: { retries?: number; delayMs?: number } = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await query();
    } catch (error) {
      lastError = error;

      if (!isTransientDatabaseError(error) || attempt === retries) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * (attempt + 1)),
      );
    }
  }

  throw lastError;
}
