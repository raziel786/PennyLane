import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native'

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void
  title: string
  testId?: string
}

const Button: React.FC<ButtonProps> = ({ onPress, title, testId }) => {
  return (
    <TouchableOpacity testID={testId} onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'purple',
    padding: 16,
    borderRadius: 6,
    margin: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
})
