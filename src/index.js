export default function ncache(d) {
  const map = new Map()
  const timeouts = new Map()

  function set(k, v, t = d) {
    clearTimeout(timeouts.get(k))
    timeouts.delete(k)
    map.set(k, v)

    if (t) {
      timeouts.set(k, setTimeout(() => {
        map.delete(k)
        timeouts.delete(k)
      }, t))
    }
  }

  return {
    clear: map.clear,
    delete: map.delete,
    entries: map.entries,
    forEach: map.forEach,
    get: map.get,
    has: map.has,
    keys: map.keys,
    set,
    values: map.values,
    get size() { return map.size },
  }
}
