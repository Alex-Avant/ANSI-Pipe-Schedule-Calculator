import { describe, it, expect } from 'vitest'
import { sanitizeQuantityInput, parseQuantity } from '@/lib/validation'

describe('sanitizeQuantityInput', () => {
  it('strips non-digit characters', () => {
    expect(sanitizeQuantityInput('abc')).toBe('')
    expect(sanitizeQuantityInput('12a3')).toBe('123')
    expect(sanitizeQuantityInput('-1')).toBe('1')
    expect(sanitizeQuantityInput('1.5')).toBe('15')
  })

  it('removes leading zeros', () => {
    expect(sanitizeQuantityInput('007')).toBe('7')
    expect(sanitizeQuantityInput('010')).toBe('10')
  })

  it('keeps a single zero while typing', () => {
    expect(sanitizeQuantityInput('0')).toBe('0')
  })

  it('accepts valid integers unchanged', () => {
    expect(sanitizeQuantityInput('100')).toBe('100')
    expect(sanitizeQuantityInput('25')).toBe('25')
  })
})

describe('parseQuantity', () => {
  it.each(['1', '2', '5', '10', '25', '100'])('parses valid value %s', (raw) => {
    expect(parseQuantity(raw)).toBe(Number(raw))
  })

  it.each(['0', 'abc', '', '.'])(
    'rejects invalid value %s',
    (raw) => {
      expect(parseQuantity(raw)).toBeNull()
    }
  )

  it('strips negative signs so negatives can never be entered', () => {
    expect(parseQuantity('-1')).toBe(1)
  })

  it('rejects values below 1 after sanitizing', () => {
    expect(parseQuantity('00')).toBeNull()
  })

  it('enforces whole numbers only', () => {
    expect(parseQuantity('1.5')).not.toBe(1.5)
    expect(parseQuantity('1.5')).toBe(15)
  })
})
