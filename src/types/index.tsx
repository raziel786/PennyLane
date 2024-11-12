export interface CustomerData {
  id: number
  first_name: string
  last_name: string
  address: string
  zip_code: string
  city: string
  country: string
  country_code: string
}

export interface InvoiceData {
  id: number
  customer_id?: number | null
  finalized: boolean
  paid: boolean
  date?: string | null
  deadline?: string | null
  total?: string | null
  tax?: string | null
  invoice_lines: InvoiceLineData[]
}

export interface InvoiceLineData {
  id: number
  invoice_id: number
  product_id: number
  quantity: number
  label: string
  unit: 'hour' | 'day' | 'piece'
  vat_rate: '0' | '5.5' | '10' | '20'
  price: string
  tax: string
  product?: ProductData
}

export interface ProductData {
  id: number
  label: string
  vat_rate: '0' | '5.5' | '10' | '20'
  unit: 'hour' | 'day' | 'piece'
  unit_price: string
  unit_price_without_tax?: string
  unit_tax?: string
}
