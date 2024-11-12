import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Button from './Button'

describe('Button component', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<Button title="Press Me" onPress={() => {}} />)
    const buttonText = getByText('Press Me')
    expect(buttonText).toBeTruthy()
  })

  it('triggers onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <Button title="Press Me" onPress={onPressMock} />,
    )

    fireEvent.press(getByText('Press Me'))
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })
})
