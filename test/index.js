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
})
