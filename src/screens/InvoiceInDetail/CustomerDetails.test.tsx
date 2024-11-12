import React from 'react'
import { render } from '@testing-library/react-native'
import CustomerDetails from './CustomerDetails'

describe('CustomerDetails', () => {
  test('renders correctly with all props provided', () => {
    const { getByText, queryAllByText } = render(
      <CustomerDetails
        first_name="John"
        last_name="Doe"
        address="123 Main St"
        zip_code="12345"
        city="New York"
        country="USA"
      />,
    )

    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('123 Main St')).toBeTruthy()
    expect(getByText('12345')).toBeTruthy()
    expect(getByText('New York')).toBeTruthy()
    expect(getByText('USA')).toBeTruthy()
    expect(queryAllByText('-').length).toBe(0)
  })

  test('renders correctly with missing props, showing default values', () => {
    const { getByText, queryAllByText } = render(
      <CustomerDetails first_name="Jane" last_name="Smith" city="London" />,
    )

    expect(getByText('Jane Smith')).toBeTruthy()
    expect(getByText('London')).toBeTruthy()

    expect(queryAllByText('-').length).toBeGreaterThan(0)
  })
})
