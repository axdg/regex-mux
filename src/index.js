export default function cache() {
  // QUESTION: Should we support a default ttl?
  const _cache = new Map()
  const {
    clear,
    entries,
    forEach,
    get,
    has,
    keys,
    values,
  } = _cache

  const timeouts = {}
  function set(k, v, ttl) {
    _cache.set(k, v)
    if (ttl) {
      clearTimeout(timeouts[k])
      const cancel = setTimeout(() => {
        _cache.delete(k)
      }, ttl)
      timeouts[k] = cancel
    }
  }

  return {
    clear,
    delete: _cache.delete,
    entries,
    forEach,
    get,
    has,
    keys,
    set,
    values,
  }
}
