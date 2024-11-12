import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SearchCustomers from './SearchCustomers'
import { searchCustomer } from '../../api/calls'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../../api'
jest.mock('../../api/calls', () => ({
  searchCustomer: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../../api', () => ({
  useApi: jest.fn(),
}))

describe('SearchCustomers', () => {
  const mockNavigation = { push: jest.fn() }
  const mockApiClient = {}

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useNavigation as jest.Mock).mockReturnValue(mockNavigation)
    ;(useApi as jest.Mock).mockReturnValue(mockApiClient)
  })

  const mockCustomers = [
    { id: '1', first_name: 'John', last_name: 'Doe' },
    { id: '2', first_name: 'Jane', last_name: 'Smith' },
  ]

  test('renders correctly with initial elements', () => {
    const { getByPlaceholderText, getByText } = render(<SearchCustomers />)

    expect(getByPlaceholderText('Search Customer')).toBeTruthy()
    expect(getByText('Search Customers')).toBeTruthy()
  })

  test('fetches and displays customers on search', async () => {
    ;(searchCustomer as jest.Mock).mockResolvedValueOnce({
      data: { customers: mockCustomers },
    })

    const { getByPlaceholderText, getByText, queryByText } = render(
      <SearchCustomers />,
    )

    const searchInput = getByPlaceholderText('Search Customer')
    fireEvent.changeText(searchInput, 'John')
    fireEvent(searchInput, 'submitEditing', { nativeEvent: { text: 'John' } })

    await waitFor(() =>
      expect(searchCustomer).toHaveBeenCalledWith(mockApiClient, 'john'),
    )

    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy()
      expect(getByText('Jane Smith')).toBeTruthy()
    })
    expect(queryByText('No Results Found')).toBeNull()
  })

  test('displays "No Results Found" when no customers are returned', async () => {
    ;(searchCustomer as jest.Mock).mockResolvedValueOnce({
      data: { customers: [] },
    })

    const { getByPlaceholderText, getByText } = render(<SearchCustomers />)

    const searchInput = getByPlaceholderText('Search Customer')
    fireEvent.changeText(searchInput, 'Unknown')
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: { text: 'Unknown' },
    })

    await waitFor(() =>
      expect(searchCustomer).toHaveBeenCalledWith(mockApiClient, 'unknown'),
    )

    await waitFor(() => {
      expect(getByText('No Results Found')).toBeTruthy()
    })
  })

  test('navigates to SearchProducts screen on customer selection', async () => {
    ;(searchCustomer as jest.Mock).mockResolvedValueOnce({
      data: { customers: mockCustomers },
    })

    const { getByPlaceholderText, getByText } = render(<SearchCustomers />)

    const searchInput = getByPlaceholderText('Search Customer')
    fireEvent.changeText(searchInput, 'John')
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: { text: 'John' },
    })

    await waitFor(() => expect(getByText('John Doe')).toBeTruthy())

    fireEvent.press(getByText('John Doe'))

    await waitFor(() => {
      expect(mockNavigation.push).toHaveBeenCalledWith('SearchProducts', {
        customer: expect.objectContaining({
          customer_id: '1',
          finalized: false,
          paid: false,
          date: expect.any(String),
          first_name: 'John',
          last_name: 'Doe',
        }),
      })
    })
  })
})
