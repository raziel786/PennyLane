import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import QuantityButton from './QuantityButton'

describe('QuantityButton', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly with initial quantity', () => {
    const { getByText } = render(
      <QuantityButton quantity={3} onChange={mockOnChange} />,
    )
    expect(getByText('3')).toBeTruthy()
  })

  test('increases quantity when "+" button is pressed', () => {
    const { getByText } = render(
      <QuantityButton quantity={3} onChange={mockOnChange} />,
    )
    fireEvent.press(getByText('+'))
    expect(mockOnChange).toHaveBeenCalledWith(4)
  })

  test('decreases quantity when "-" button is pressed', () => {
    const { getByText } = render(
      <QuantityButton quantity={3} onChange={mockOnChange} />,
    )
    fireEvent.press(getByText('-'))
    expect(mockOnChange).toHaveBeenCalledWith(2)
  })

  test('does not decrease quantity below 1', () => {
    const { getByText } = render(
      <QuantityButton quantity={1} onChange={mockOnChange} />,
    )
    fireEvent.press(getByText('-'))
    expect(mockOnChange).toHaveBeenCalledWith(1)
  })
})
