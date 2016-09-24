import ptore from 'path-to-regexp'

function assert(e, msg) {
  if (!e) throw new Error(msg)
}

export default function create(def) {
  assert(typeof def === 'function', '`def` must be a function')

  const routes = []

  function append(path, fn) {
    assert(typeof path === 'string', '`path` must be a string')
    assert(typeof fn === 'function', '`fn` must be a function')

    let keys = []
    const re = ptore(path, keys)

    keys = keys.map(function (key) {
      const { name } = key
      if (typeof name === 'number') {
        throw new Error('unnamed parameters are not allowed')
      }

      return name
    })

    routes.unshift({
      keys,
      re,
      fn,
    })
  }

  function match(path) {
    assert(typeof path === 'string', '`path` must be a string')

    let len = routes.length
    while (len) {
      const { keys, re, fn } = routes[len - 1]
      const values = re.exec(path)

      if (values) {
        const params = values.shift().reduce(function (previous, value, index) {
          previous[keys[index]] = value
          return previous
        }, {})

        return {
          params,
          fn,
        }
      }

      len--
    }

    return {
      params: null,
      fn: def,
    }
  }

  return { append, match }
}
