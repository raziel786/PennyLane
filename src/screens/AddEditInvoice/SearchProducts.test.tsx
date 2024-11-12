import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SearchProducts from './SearchProducts'
import { searchProducts } from '../../api/calls'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../../api'

jest.mock('../../api/calls', () => ({
  searchProducts: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../../api', () => ({
  useApi: jest.fn(),
}))

describe('SearchProducts', () => {
  const mockNavigation = { push: jest.fn() }
  const mockApiClient = {}

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useNavigation as jest.Mock).mockReturnValue(mockNavigation)
    ;(useApi as jest.Mock).mockReturnValue(mockApiClient)
  })

  const mockProducts = [
    { id: 1, label: 'Product A', unit_price: 100 },
    { id: 2, label: 'Product B', unit_price: 200 },
  ]

  const mockCustomer = {
    params: {
      customer: {
        customer_id: 1,
        first_name: 'test',
        last_name: 'joe',
        finalized: false,
        paid: false,
        date: '2023-01-01',
      },
      invoice: null,
    },
  }

  test('renders correctly with initial elements', () => {
    const { getByPlaceholderText, getByText } = render(
      <SearchProducts route={{ params: mockCustomer.params }} />,
    )

    expect(getByPlaceholderText('Search Products')).toBeTruthy()
    expect(getByText('Search Products')).toBeTruthy()
    expect(getByText('Next')).toBeTruthy()
  })

  test('fetches and displays products on search', async () => {
    ;(searchProducts as jest.Mock).mockResolvedValueOnce({
      data: { products: mockProducts },
    })

    const { getByPlaceholderText, getByText, queryByText } = render(
      <SearchProducts route={{ params: mockCustomer.params }} />,
    )

    const searchInput = getByPlaceholderText('Search Products')
    fireEvent.changeText(searchInput, 'Product')
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: { text: 'Product' },
    })

    await waitFor(() =>
      expect(searchProducts).toHaveBeenCalledWith(mockApiClient, 'product'),
    )

    await waitFor(() => {
      expect(getByText('Product A')).toBeTruthy()
      expect(getByText('Product B')).toBeTruthy()
    })
    expect(queryByText('No results found')).toBeNull()
  })

  test('displays "No results found" when no products are returned', async () => {
    ;(searchProducts as jest.Mock).mockResolvedValueOnce({
      data: { products: [] },
    })

    const { getByPlaceholderText, getByText } = render(
      <SearchProducts route={{ params: mockCustomer.params }} />,
    )

    const searchInput = getByPlaceholderText('Search Products')
    fireEvent.changeText(searchInput, 'NonExistentProduct')
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: { text: 'NonExistentProduct' },
    })

    await waitFor(() =>
      expect(searchProducts).toHaveBeenCalledWith(
        mockApiClient,
        'nonexistentproduct',
      ),
    )

    await waitFor(() => {
      expect(getByText('No results found')).toBeTruthy()
    })
  })

  test('selects and deselects products correctly', async () => {
    ;(searchProducts as jest.Mock).mockResolvedValueOnce({
      data: { products: mockProducts },
    })

    const { getByPlaceholderText, getByText, getAllByText } = render(
      <SearchProducts route={{ params: mockCustomer.params }} />,
    )

    const searchInput = getByPlaceholderText('Search Products')
    fireEvent.changeText(searchInput, 'Product')
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: { text: 'Product' },
    })

    await waitFor(() => expect(getByText('Product A')).toBeTruthy())

    fireEvent.press(getByText('Product A'))
    expect(getByText('Selected Products')).toBeTruthy()
    expect(getAllByText('Product A').length).toBe(2)
    fireEvent.press(getAllByText('Product A')[0])
    expect(getAllByText('Product A').length).toBe(1)
  })

  test('navigates to Confirmation screen on Next button press', async () => {
    ;(searchProducts as jest.Mock).mockResolvedValueOnce({
      data: { products: mockProducts },
    })

    const { getByPlaceholderText, getByText } = render(
      <SearchProducts route={{ params: mockCustomer.params }} />,
    )

    const searchInput = getByPlaceholderText('Search Products')
    fireEvent.changeText(searchInput, 'Product')
    fireEvent(searchInput, 'submitEditing', {
      nativeEvent: { text: 'Product' },
    })

    await waitFor(() => expect(getByText('Product A')).toBeTruthy())

    fireEvent.press(getByText('Product A'))
    fireEvent.press(getByText('Next'))

    await waitFor(() => {
      expect(mockNavigation.push).toHaveBeenCalledWith('Confirmation', {
        invoiceLines: [
          expect.objectContaining({
            product_id: 1,
            label: 'Product A',
            quantity: 1,
            unit: undefined,
            vat_rate: undefined,
            price: 100,
          }),
        ],
        customer: expect.anything(),
        invoice: null,
      })
    })
  })
})
