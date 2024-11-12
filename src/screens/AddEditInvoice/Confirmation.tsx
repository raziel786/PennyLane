import React, { useState } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import DatePicker from 'react-native-date-picker'
import Header from '../../components/Header'
import { calculateGrandTotal, formatAmount, formatDate } from '../../utils'
import QuantityButton from '../../components/QuantityButton'
import { updateInvoice, createInvoice } from '../../api/calls'
import { useApi } from '../../api'
import { useNavigation } from '@react-navigation/native'
import { CustomerData, ProductData, InvoiceLinesData } from '../../types'
interface ConfirmationProps {
  route: {
    params: {
      customer: CustomerData
      invoiceLines: InvoiceLinesData[]
      invoice?: {
        id: number
        invoice_lines: ProductData[]
      } | null
    }
  }
}

const Confirmation: React.FC<ConfirmationProps> = ({
  route: {
    params: { customer, invoiceLines, invoice = null },
  },
}) => {
  const apiClient = useApi()
  const navigation = useNavigation()

  const [selectedProducts, setSelectedProducts] = useState(
    invoice ? invoice.invoice_lines : invoiceLines,
  )
  const [date, setDate] = useState(new Date())

  const onSubmit = async () => {
    const formulateNewInvoice = {
      invoice: {
        deadline: formatDate(date),
        ...customer,
        invoice_lines_attributes: selectedProducts,
      },
    }
    const res = invoice
      ? await updateInvoice(apiClient, invoice.id, formulateNewInvoice)
      : await createInvoice(apiClient, formulateNewInvoice)
    if (res.status === 200) {
      navigation.push('Overview')
    }
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId
          ? { ...product, quantity: newQuantity }
          : product,
      ),
    )
  }

  const grandTotal = calculateGrandTotal(selectedProducts)

  return (
    <View style={styles.fullHeight}>
      <Header title="Confirmation" />
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.customerName}>Set Deadline</Text>
        <DatePicker
          minimumDate={new Date()}
          mode="date"
          date={date}
          onDateChange={setDate}
          style={styles.datePicker}
        />
        <Text style={styles.customerName}>Set Quantity</Text>
        {selectedProducts.map(
          ({ product_id, label, quantity, unit, price, tax, vat_rate }) => (
            <View key={product_id} style={styles.productContainer}>
              <View style={styles.productHeader}>
                <Text style={styles.productLabel}>{label}</Text>
                <View>
                  <Text
                    style={styles.quantityLabel}
                  >{`Quantity (${unit})`}</Text>
                  <QuantityButton
                    quantity={quantity}
                    onChange={(newQuantity) =>
                      handleQuantityChange(product_id, newQuantity)
                    }
                  />
                </View>
              </View>
              <Text>Subtotal: {formatAmount((price - tax) * quantity)}</Text>
              <Text>{`VAT (${vat_rate}%): ${formatAmount(tax * quantity)}`}</Text>
              <Text>Total: {formatAmount(price * quantity)}</Text>
            </View>
          ),
        )}
        <Text style={styles.grandTotalText}>
          Total: {formatAmount(grandTotal)}
        </Text>
        <TouchableOpacity
          onPress={() => onSubmit()}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>FINISH</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Confirmation

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%',
  },
  scrollContainer: {
    padding: 8,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  datePicker: {
    display: 'flex',
    alignSelf: 'center',
  },
  productContainer: {
    backgroundColor: 'lightblue',
    borderRadius: 8,
    marginVertical: 8,
    padding: 8,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityLabel: {
    textAlign: 'center',
    paddingBottom: 8,
  },
  grandTotalText: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
