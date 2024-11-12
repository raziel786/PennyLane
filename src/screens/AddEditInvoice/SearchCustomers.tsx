import React, { useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native'
import Header from '../../components/Header'
import { searchCustomer } from '../../api/calls'
import { useApi } from '../../api'
import { useNavigation } from '@react-navigation/native'
import { formatDate } from '../../utils'
import { CustomerData } from '../../types'

interface ListItemProps {
  navigation: any
  customer: CustomerData
}

const ListItem: React.FC<ListItemProps> = ({ navigation, customer }) => {
  const { first_name, last_name } = customer
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push('SearchProducts', {
          customer: {
            customer_id: customer.id,
            finalized: false,
            paid: false,
            date: formatDate(new Date()),
            ...customer,
          },
        })
      }
      style={styles.listItem}
    >
      <Text style={styles.listItemText}>
        {first_name} {last_name}
      </Text>
    </TouchableOpacity>
  )
}

const SearchCustomers: React.FC = () => {
  const apiClient = useApi()
  const navigation = useNavigation()

  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [noResults, setNoResults] = useState(false)

  const searchCustomers = async (text: string) => {
    const {
      data: { customers },
    } = await searchCustomer(apiClient, text.toLowerCase())
    setNoResults(customers.length === 0)
    setCustomerList(customers)
  }

  return (
    <View style={styles.container}>
      <Header title="Search Customers" />
      <View style={styles.innerContainer}>
        <TextInput
          onSubmitEditing={(e) => searchCustomers(e.nativeEvent.text)}
          style={styles.searchInput}
          placeholder="Search Customer"
        />
        {noResults && (
          <Text style={styles.noResultsText}>No Results Found</Text>
        )}
        <FlatList
          data={customerList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem customer={item} navigation={navigation} />
          )}
          style={styles.listContainer}
        />
      </View>
    </View>
  )
}

export default SearchCustomers

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    height: '100%',
  },
  searchInput: {
    borderColor: 'grey',
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  listContainer: {
    maxHeight: '80%',
  },
  listItem: {
    paddingVertical: 6,
  },
  listItemText: {
    fontSize: 16,
  },
  noResultsText: {
    color: 'grey',
    textAlign: 'center',
    marginVertical: 8,
  },
})
