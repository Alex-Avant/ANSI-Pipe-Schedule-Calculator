export function sanitizeQuantityInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  return digits.replace(/^0+(?=\d)/, '')
}

export function parseQuantity(raw: string): number | null {
  const sanitized = sanitizeQuantityInput(raw)
  if (sanitized === '') return null
  const parsed = parseInt(sanitized, 10)
  if (Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}
