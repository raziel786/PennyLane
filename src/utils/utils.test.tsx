import { calculateGrandTotal, formatDate, formatAmount, isOverdue } from './'

describe('formatAmount', () => {
  test('formats a small number with two decimal places and adds currency symbol', () => {
    expect(formatAmount(45.5)).toBe('€45.50')
  })

  test('formats a large number with commas and two decimal places', () => {
    expect(formatAmount(1234567.89)).toBe('€1,234,567.89')
  })

  test('handles zero as input', () => {
    expect(formatAmount(0)).toBe('€0.00')
  })

  test('rounds to two decimal places if necessary', () => {
    expect(formatAmount(45.678)).toBe('€45.68')
  })
})

describe('isOverdue', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('returns "due today" for today’s date', () => {
    jest.setSystemTime(new Date('2024-11-05T00:00:00Z'))
    expect(isOverdue('2024-11-05')).toEqual({
      text: 'due today',
      color: '#814d00',
    })
  })

  test('returns "due in X days" for a future date', () => {
    jest.setSystemTime(new Date('2024-11-05T00:00:00Z'))
    expect(isOverdue('2024-11-10')).toEqual({
      text: 'due in 5 days',
      color: '#0b6927',
    })
  })

  test('returns "X days overdue" for a past date', () => {
    jest.setSystemTime(new Date('2024-11-05T00:00:00Z'))
    expect(isOverdue('2024-11-02')).toEqual({
      text: '3 days overdue',
      color: '#9f1443',
    })
  })

  test('handles leap year dates correctly', () => {
    jest.setSystemTime(new Date('2024-11-05T00:00:00Z'))
    expect(isOverdue('2024-02-29')).toEqual({
      text: '250 days overdue',
      color: '#9f1443',
    })
  })
})

describe('formatDate', () => {
  it('formats a date correctly in YYYY-MM-DD format', () => {
    const date = new Date(2023, 10, 15)
    expect(formatDate(date)).toBe('2023-11-15')
  })

  it('adds leading zeros for single-digit months', () => {
    const date = new Date(2023, 0, 15)
    expect(formatDate(date)).toBe('2023-01-15')
  })

  it('adds leading zeros for single-digit days', () => {
    const date = new Date(2023, 10, 5)
    expect(formatDate(date)).toBe('2023-11-05')
  })

  it('handles single-digit months and days', () => {
    const date = new Date(2023, 0, 4)
    expect(formatDate(date)).toBe('2023-01-04')
  })
})

describe('calculateGrandTotal', () => {
  it('calculates the total for multiple items correctly', () => {
    const invoices = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
      { price: 8, quantity: 1 },
    ]
    expect(calculateGrandTotal(invoices)).toBe(43)
  })

  it('returns 0 for an empty array', () => {
    const invoices: { price: number; quantity: number }[] = []
    expect(calculateGrandTotal(invoices)).toBe(0)
  })

  it('calculates correctly for a single item', () => {
    const invoices = [{ price: 12, quantity: 4 }]
    expect(calculateGrandTotal(invoices)).toBe(48)
  })

  it('handles items with zero quantity correctly', () => {
    const invoices = [
      { price: 15, quantity: 0 },
      { price: 20, quantity: 1 },
    ]
    expect(calculateGrandTotal(invoices)).toBe(20)
  })

  it('handles items with zero price correctly', () => {
    const invoices = [
      { price: 0, quantity: 3 },
      { price: 5, quantity: 4 },
    ]
    expect(calculateGrandTotal(invoices)).toBe(20)
  })
})
