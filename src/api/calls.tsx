export const getInvoices = async (apiClient) => {
  try {
    const res = await apiClient.getInvoices()
    return res.data.invoices
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw error
  }
}

export const updateInvoice = async (apiClient, id, updatedInvoice) => {
  try {
    const res = await apiClient.putInvoice(id, updatedInvoice)
    return res
  } catch (error) {
    console.error('Error updating invoice:', error)
    throw error
  }
}

export const deleteInvoice = async (apiClient, id) => {
  try {
    const res = await apiClient.deleteInvoice({ id })
    return res
  } catch (error) {
    console.error('Error deleting invoice:', error)
    throw error
  }
}

export const searchCustomer = async (apiClient, text) => {
  try {
    const res = await apiClient.getSearchCustomers({ query: text })
    console.log(res)
    return res
  } catch (error) {
    console.error('Error searching customer:', error)
    throw error
  }
}

export const searchProducts = async (apiClient, text) => {
  try {
    const res = await apiClient.getSearchProducts({ query: text })
    console.log(res)
    return res
  } catch (error) {
    console.error('Error searching customer:', error)
    throw error
  }
}

export const createInvoice = async (apiClient, invoice) => {
  try {
    const res = await apiClient.postInvoices({}, invoice)
    console.log(res)
    return res
  } catch (error) {
    console.error('Error searching customer:', error)
    throw error
  }
}
