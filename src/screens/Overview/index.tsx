import React, { useEffect, useState, useCallback } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { useApi } from '../../api'
import { calculateGrandTotal, formatAmount, isOverdue } from '../../utils'
import { getInvoices, updateInvoice, deleteInvoice } from '../../api/calls'
import { leftSwipeActions, rightSwipeActions } from './SwipeActions'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'
import Button from '../../components/Button'
import { InvoiceData } from '../../types'

interface ListInvoiceProps {
  invoice: InvoiceData
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
}

const ListInvoice: React.FC<ListInvoiceProps> = ({
  invoice,
  onUpdate,
  onDelete,
}) => {
  const { id, customer, finalized, paid, deadline, invoice_lines } = invoice
  const grandTotal = calculateGrandTotal(invoice_lines)
  const navigation = useNavigation()

  return (
    <Swipeable
      renderLeftActions={
        paid
          ? null
          : () =>
              leftSwipeActions(invoice, onUpdate, () =>
                navigation.push('Confirmation', { customer, invoice }),
              )
      }
      renderRightActions={
        finalized || paid ? null : () => rightSwipeActions(id, onDelete)
      }
    >
      <TouchableOpacity
        onPress={() => navigation.push('InDetail', { invoice })}
      >
        <View style={styles.listItemContainer}>
          <Text style={styles.listItemText}>
            {customer.first_name} {customer.last_name}
          </Text>
          <Text style={styles.listItemText}>{formatAmount(grandTotal)}</Text>
        </View>
        <View style={styles.listItemRow}>
          <Text style={styles.invoiceIdText}>{id}</Text>
          {!paid && (
            <Text
              style={[
                styles.invoiceStatusContainer,
                { backgroundColor: isOverdue(deadline).color },
              ]}
            >
              {isOverdue(deadline).text}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  )
}

const InvoicesOverview: React.FC = () => {
  const apiClient = useApi()
  const navigation = useNavigation()
  const [invoices, setInvoices] = useState<InvoiceData[] | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchInvoices = useCallback(async () => {
    try {
      const fetchedInvoices = await getInvoices(apiClient)
      setInvoices(fetchedInvoices)
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  const onUpdate = async (id: number) => {
    const [updateInvoiceData] = invoices!.filter((invoice) => invoice.id === id)
    if (!updateInvoiceData.finalized) {
      updateInvoiceData.finalized = true
    } else if (!updateInvoiceData.paid) {
      updateInvoiceData.paid = true
    }
    const res = await updateInvoice(apiClient, id, updateInvoiceData)
    if (res.status === 200) {
      await fetchInvoices()
    }
  }

  const onDelete = async (id: number) => {
    const res = await deleteInvoice(apiClient, id)
    if (res.status === 204) {
      await fetchInvoices()
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  if (loading) {
    return null
  }

  const paidInvoices = invoices!.filter(({ paid }) => paid)
  const unpaidInvoices = invoices!.filter(({ paid }) => !paid)

  return (
    <View style={styles.container}>
      <Header disableBackButton title="Invoices Overview" />
      <ScrollView>
        <View style={styles.rowHeader}>
          <Text style={styles.subHeadingText}>PAID</Text>
          <Text style={styles.caption}>{paidInvoices.length} Invoices</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={paidInvoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListInvoice
              invoice={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          ItemSeparatorComponent={<View style={styles.itemSeparator} />}
        />
        <View style={styles.rowHeader}>
          <Text style={styles.subHeadingText}>UNPAID</Text>
          <Text style={styles.caption}>{unpaidInvoices.length} Invoices</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={unpaidInvoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListInvoice
              invoice={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
          ItemSeparatorComponent={<View style={styles.itemSeparator} />}
        />
        <Button
          title="Add Invoice"
          onPress={() => navigation.push('SearchCustomers')}
          testId="add-invoice"
        />
      </ScrollView>
    </View>
  )
}

export default InvoicesOverview

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  listItemContainer: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceIdText: {
    paddingHorizontal: 8,
    color: 'grey',
  },
  invoiceStatusContainer: {
    fontSize: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  headingText: {
    fontWeight: 'bold',
    padding: 6,
    marginVertical: 3,
    fontSize: 36,
  },
  subHeadingText: {
    color: 'grey',
    fontWeight: 'bold',
    padding: 6,
    fontSize: 20,
  },
  caption: {
    paddingRight: 6,
    color: 'grey',
    fontStyle: 'italic',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
