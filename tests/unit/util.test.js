import u from '@/util'

describe('util', () => {
  it('toString - invokes .toString on value and handles null', () => {
    expect(u.toString(5)).toBe('5')
    expect(u.toString(null)).toBe(undefined)
    expect(u.toString(undefined)).toBe(undefined)
  })
})
