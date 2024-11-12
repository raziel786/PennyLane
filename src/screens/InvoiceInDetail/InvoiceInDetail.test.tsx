import React from 'react'
import { render } from '@testing-library/react-native'
import InvoiceInDetail from './'
import { formatAmount } from '../../utils'
const mockInvoice = {
  id: 1,
  paid: true,
  finalized: false,
  date: '2024-11-05',
  deadline: '2024-11-10',
  invoice_lines: [
    {
      id: 44643,
      invoice_id: 21469,
      label: 'Audi S5',
      price: '24450.0',
      product: {
        id: 1,
        label: 'Audi S5',
        unit: 'piece',
        unit_price: '24450.0',
        unit_price_without_tax: '20375.0',
        unit_tax: '4075.0',
        vat_rate: '20',
      },
      product_id: 1,
      quantity: 1,
      tax: '4075.0',
      unit: 'piece',
      vat_rate: '20',
    },
  ],
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    address: '123 Main St',
    zip_code: '12345',
    city: 'Sample City',
    country: 'Sample Country',
  },
}

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  }
})

const route = {
  params: {
    invoice: mockInvoice,
  },
}
describe('InvoiceInDetail', () => {
  test('renders correctly with provided invoice details', () => {
    const { getByText } = render(<InvoiceInDetail route={route} />)

    expect(getByText('Issued: 2024-11-05')).toBeTruthy()
    expect(getByText('Due: 2024-11-10')).toBeTruthy()
    expect(getByText('Not Finalised')).toBeTruthy()
    expect(getByText('Paid')).toBeTruthy()

    expect(getByText('Invoice 1')).toBeTruthy()
    expect(getByText('Audi S5')).toBeTruthy()
    expect(getByText('Quantity: 1 piece')).toBeTruthy()
    expect(getByText(`Price: ${formatAmount('20375.0')}`)).toBeTruthy()
    expect(getByText(`VAT (20%): ${formatAmount('4075.0')}`)).toBeTruthy()
    expect(getByText(`Total: ${formatAmount('24450.0')}`)).toBeTruthy()
  })
})
