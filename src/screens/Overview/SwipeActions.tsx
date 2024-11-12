import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { InvoiceData } from '../../types'

type LeftSwipeActionsProps = (
  invoice: InvoiceData,
  onUpdate: (id: number) => void,
  editInvoice: () => void,
) => JSX.Element

type RightSwipeActionsProps = (
  id: number,
  onDelete: (id: number) => void,
) => JSX.Element

export const leftSwipeActions: LeftSwipeActionsProps = (
  invoice,
  onUpdate,
  editInvoice,
) => {
  const { id, finalized } = invoice
  return (
    <View style={styles.leftSwipeContainer}>
      {!finalized && (
        <>
          <TouchableOpacity onPress={editInvoice}>
            <View style={styles.editContainer}>
              <Text style={styles.text}>EDIT</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onUpdate(id)}>
            <View style={styles.finalizeContainer}>
              <Text style={styles.text}>FINALISE</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      {finalized && (
        <TouchableOpacity onPress={() => onUpdate(id)}>
          <View style={styles.paidContainer}>
            <Text style={styles.text}>PAID</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

export const rightSwipeActions: RightSwipeActionsProps = (id, onDelete) => (
  <TouchableOpacity onPress={() => onDelete(id)}>
    <View style={styles.deleteContainer}>
      <Text style={styles.deleteText}>Delete</Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  leftSwipeContainer: {
    flexDirection: 'row',
  },
  deleteContainer: {
    backgroundColor: '#dd2150',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
  },
  deleteText: {
    color: '#fff',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  editContainer: {
    backgroundColor: '#4321dd',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
  },
  finalizeContainer: {
    backgroundColor: '#dd9221',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
  },
  paidContainer: {
    backgroundColor: '#136f0a',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
  },
  text: {
    color: '#fff',
    paddingHorizontal: 10,
    fontWeight: '600',
  },
})
