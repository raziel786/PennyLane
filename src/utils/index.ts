export const calculateGrandTotal = (invoices) =>
  invoices.reduce((total, { price, quantity }) => total + price * quantity, 0)

export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const formatAmount = (amount) => {
  return `€${Number(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export const isOverdue = (date) => {
  const today = new Date()
  const targetDate = new Date(date)

  const diffTime = targetDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  switch (true) {
    case diffDays < 0:
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        color: '#9f1443',
      }
    case diffDays > 0:
      return {
        text: `due in ${diffDays} days`,
        color: '#0b6927',
      }
    default:
      return {
        text: 'due today',
        color: '#814d00',
      }
  }
}
