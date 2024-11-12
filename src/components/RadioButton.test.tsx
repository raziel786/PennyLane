import React from 'react'
import { render } from '@testing-library/react-native'
import RadioButton from './RadioButton'
import { Text } from 'react-native'

describe('RadioButton component', () => {
  it('displays the inner circle when checked is true', () => {
    const { getByTestId } = render(<RadioButton checked={true} />)
    expect(getByTestId('radio-button-inner')).toBeTruthy()
  })

  it('does not display the inner circle when checked is false', () => {
    const { queryByTestId } = render(<RadioButton checked={false} />)
    expect(queryByTestId('radio-button-inner')).toBeNull()
  })

  it('renders children correctly', () => {
    const { getByText } = render(
      <RadioButton checked={true}>
        <Text>Option 1</Text>
      </RadioButton>,
    )
    expect(getByText('Option 1')).toBeTruthy()
  })
})
