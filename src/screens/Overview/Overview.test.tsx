import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import InvoicesOverview from './'
import { getInvoices } from '../../api/calls'

jest.mock('../../api/calls')
jest.mock('../../api')

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ push: jest.fn() }),
}))

jest.mock('react-native-gesture-handler', () => {
  return {
    Swipeable: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

const mockInvoices = [
  {
    id: 1,
    customer: { first_name: 'John', last_name: 'Doe' },
    finalized: false,
    paid: false,
    deadline: '2023-12-01',
    invoice_lines: [{ price: 100, quantity: 2 }],
  },
  {
    id: 2,
    customer: { first_name: 'Jane', last_name: 'Smith' },
    finalized: true,
    paid: true,
    deadline: '2023-11-01',
    invoice_lines: [{ price: 200, quantity: 1 }],
  },
  {
    id: 3,
    customer: { first_name: 'Jack', last_name: 'Man' },
    finalized: true,
    paid: true,
    deadline: '2023-11-01',
    invoice_lines: [{ price: 200, quantity: 1 }],
  },
]
describe('InvoicesOverview', () => {
  const mockPush = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        push: mockPush,
      })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getInvoices as jest.Mock).mockResolvedValue(mockInvoices)
  })

  it('renders the `Activity Indicator` initially', () => {
    const { queryByText, getByTestId } = render(<InvoicesOverview />)
    expect(getByTestId('loading-indicator')).toBeTruthy()
    expect(queryByText('PAID')).toBeNull()
    expect(queryByText('UNPAID')).toBeNull()
  })

  it('fetches and displays invoices correctly', async () => {
    const { getByText } = render(<InvoicesOverview />)
    await waitFor(() => expect(getByText('PAID')).toBeTruthy())
    expect(getByText('1 Invoices')).toBeTruthy()
    expect(getByText('UNPAID')).toBeTruthy()
    expect(getByText('1 Invoices')).toBeTruthy()
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('Jack Man')).toBeTruthy()
  })

  it('navigates to add invoice screen on "Add Invoice" button click', async () => {
    const { getByTestId } = render(<InvoicesOverview />)
    await waitFor(() => getByTestId('add-invoice'))
    fireEvent.press(getByTestId('add-invoice'))
    expect(mockPush).toHaveBeenCalledWith('SearchCustomers')
  })
})
