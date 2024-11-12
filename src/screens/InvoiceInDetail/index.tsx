import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import CustomerDetails from './CustomerDetails'
import Header from '../../components/Header'
import { calculateGrandTotal, formatAmount } from '../../utils'
import { InvoiceData } from '../../types'

interface InvoiceInDetailProps {
  route: {
    params: {
      invoice: InvoiceData
    }
  }
}

const InvoiceInDetail: React.FC<InvoiceInDetailProps> = ({
  route: {
    params: {
      invoice: { id, paid, finalized, date, deadline, invoice_lines, customer },
    },
  },
}) => {
  const grandTotal = calculateGrandTotal(invoice_lines)

  return (
    <View style={styles.fullHeight}>
      <Header title={`Invoice ${id}`} />
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <CustomerDetails {...customer} />
          <View>
            <Text style={styles.text}>Issued: {date}</Text>
            <Text style={styles.text}>Due: {deadline}</Text>
            <Text style={styles.text}>
              {finalized ? 'Finalised' : 'Not Finalised'}
            </Text>
            <Text style={styles.text}>{paid ? 'Paid' : 'Not Paid'}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.header}>Invoice Lines</Text>
          {invoice_lines.map(
            ({ price, tax, label, vat_rate, unit, quantity }) => (
              <View key={label} style={styles.lineItemContainer}>
                <View style={styles.itemContainer}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemLabel}>{label}</Text>
                    <Text>
                      Quantity: {quantity} {unit}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.text}>
                      Price: {formatAmount(price - tax)}
                    </Text>
                    <Text style={styles.text}>
                      VAT ({vat_rate}%): {formatAmount(tax)}
                    </Text>
                    <Text style={styles.itemTotal}>
                      Total: {formatAmount(price * quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            ),
          )}
          <Text style={[styles.header, styles.grandTotalText]}>
            Grand Total: {formatAmount(grandTotal)}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default InvoiceInDetail

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%',
  },
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    alignSelf: 'flex-end',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 8,
  },
  lineItemContainer: {
    paddingVertical: 4,
  },
  itemContainer: {
    backgroundColor: '#ffe7d3',
    borderRadius: 4,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemTotal: {
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    fontSize: 18,
  },
  grandTotalText: {
    textAlign: 'right',
  },
})
