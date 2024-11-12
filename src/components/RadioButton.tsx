import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'

interface RadioButtonProps {
  checked: boolean
  children?: ReactNode
}

const RadioButton: React.FC<RadioButtonProps> = ({ checked, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.optionContainer}>
        <View style={styles.radioButtonOuter}>
          {checked && (
            <View testID="radio-button-inner" style={styles.radioButtonInner} />
          )}
        </View>
        {children}
      </View>
    </View>
  )
}

export default RadioButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonOuter: {
    height: 16,
    width: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    height: 8,
    width: 8,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  optionText: {
    fontSize: 16,
  },
})
