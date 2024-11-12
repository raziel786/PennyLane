import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CustomerData } from '../../types'

interface CustomerDetailsProps {
  customer: CustomerData
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  first_name = '-',
  last_name = '-',
  address = '-',
  zip_code = '-',
  city = '-',
  country = '-',
}) => {
  return (
    <View>
      <Text style={styles.name}>
        {first_name} {last_name}
      </Text>
      <Text>{address}</Text>
      <Text>{zip_code}</Text>
      <Text>{city}</Text>
      <Text>{country}</Text>
    </View>
  )
}

export default CustomerDetails

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    fontSize: 20,
  },
})
