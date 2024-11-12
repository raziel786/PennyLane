import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Header from './Header'
import { useNavigation } from '@react-navigation/native'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

describe('Header component', () => {
  const navigationMock = { goBack: jest.fn() }
  beforeEach(() => {
    useNavigation.mockReturnValue(navigationMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the title correctly', () => {
    const { getByText } = render(<Header title="Test Title" />)
    expect(getByText('Test Title')).toBeTruthy()
  })

  it('shows the back button when disableBackButton is false', () => {
    const { getByText } = render(
      <Header title="Test Title" disableBackButton={false} />,
    )
    expect(getByText('‹ Back')).toBeTruthy()
  })

  it('hides the back button when disableBackButton is true', () => {
    const { queryByText } = render(
      <Header title="Test Title" disableBackButton={true} />,
    )
    expect(queryByText('‹ Back')).toBeNull()
  })

  it('calls navigation.goBack when back button is pressed', () => {
    const { getByText } = render(
      <Header title="Test Title" disableBackButton={false} />,
    )
    fireEvent.press(getByText('‹ Back'))
    expect(navigationMock.goBack).toHaveBeenCalledTimes(1)
  })
})
