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

    it('match should throw if `path` is not a string')

    it('match should match routes in the order they were appended')

    it('match should return the correct handler function')

    it('match should return the correct params hash')
  })
})
