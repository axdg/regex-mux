import create from '../src'
import expect from 'expect'

describe('create()', () => {
  it('should accept a default handler and return the append and match function', () => {
    const { append, match } = create(() => {})
    expect(append).toBeA('function')
    expect(match).toBeA('function')
  })

  it('should error when no default handler is provided', () => {
    expect(function () {
      create()
    }).toThrow('`def` must be a function')

    // Wrong type
    expect(function () {
      create('notafunction')
    }).toThrow('`def` must be a function')
  })

  it('the default handler should be returned when no match is made', () => {
    const { match } = create(() => 'default handler')
    const { fn } = match('')
    expect(fn).toBeA('function')
    expect(fn()).toBe('default handler')
  })

  describe('append and match', () => {
    const handler = str => () => str
    const noop = handler()

    it('append should throw if `path` is not a string', () => {
      const { append } = create(noop)
      expect(function () {
        append(undefined, noop)
      }).toThrow('`path` must be a string')
    })

    it('append should throw if `fn` is not a function', () => {
      const { append } = create(noop)
      expect(function () {
        append('foo/:bar', undefined)
      }).toThrow('`fn` must be a function')
    })

    it('append should throw if unnamed parameters are present', () => {
      const { append } = create(noop)
      expect(function () {
        append('/foo/(\\d{0,6})', noop)
      }).toThrow('unnamed')
    })

    it('match should throw if `path` is not a string', () => {
      const { match } = create(noop)
      expect(function () {
        match({})
      }).toThrow('`path` must be a string')
    })

    it('match should match routes in the order they were appended', () => {
      const { append, match } = create(noop)

      // Both are able to match the same string.
      append('/:foo/:bar/baz', handler('one'))
      append('/:foo/:bar*', handler('two'))

      expect(match('/foo/bar/baz').fn()).toBe('one')
      expect(match('/foo/bar').fn()).toBe('two')
    })

    it('match should return the correct handler function', () => {
      const { append, match } = create(handler('not found'))
      append('/p/:foo/bar/:baz(\\d+)', handler('baz is uid'))
      append('/p/:foo/bar/:baz', handler('single baz param'))
      append('/p/:foo+', handler('any length foo'))

      expect(match('/p/some/really/long/path').fn()).toBe('any length foo')
      expect(match('/p/foo/bar/baz').fn()).toBe('single baz param')
      expect(match('/p/foo/bar/1234').fn()).toBe('baz is uid')
      expect(match('q').fn()).toBe('not found')
    })

    it('match should return the correct params hash', () => {
      const { append, match } = create(noop)
      append('/:foo/bar/:baz(\\d+)', noop)
      append('/:foo/bar/:baz', noop)
      append('/:foo+', noop)

      expect(match('/some/really/long/path').params).toEqual({
        foo: 'some/really/long/path',
      })

      expect(match('/foo/bar/baz').params).toEqual({
        foo: 'foo',
        baz: 'baz',
      })

      expect(match('/foo/bar/1234').params).toEqual({
        foo: 'foo',
        baz: '1234',
      })
    })
  })
})
