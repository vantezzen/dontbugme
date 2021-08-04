/**
 * Very simple Cache system for DontBugMe
 */

/**
 * Write a value to cache.
 * By default, values will be valid for 30 minutes and will automatically expire after that.
 */
export const writeCache = (key : string, value : any, validFor = (1000 * 60 * 30)) => {
  const expires = new Date().getTime() + validFor;

  window.localStorage[key] = JSON.stringify({
    value,
    expires
  });
}

/**
 * Read a value from cache.
 * If no value can be found or the value is expired, null will be returned.
 */
export const readCache = (key : string) => {
  const cache = window.localStorage[key];

  if (cache) {
    const data = JSON.parse(cache);

    if (data.expires > new Date().getTime()) {
      return data.value;
    }
  }

  return null;
}

/**
 * Check if the cache contains a value for a given key.
 */
export const hasCache = (key : string) => {
  return !!readCache(key);
}