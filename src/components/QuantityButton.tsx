import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface QuantityButtonProps {
  quantity: number
  onChange: (newQuantity: number) => void
}

const QuantityButton: React.FC<QuantityButtonProps> = ({
  quantity,
  onChange,
}) => {
  const increaseQuantity = () => onChange(quantity + 1)
  const decreaseQuantity = () => onChange(quantity > 1 ? quantity - 1 : 1)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decreaseQuantity} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity onPress={increaseQuantity} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default QuantityButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  quantityText: {
    fontSize: 18,
    minWidth: 30,
    textAlign: 'center',
  },
})
