import { render, fireEvent } from '@testing-library/react-native'
import { leftSwipeActions, rightSwipeActions } from './SwipeActions'

describe('Swipe Actions', () => {
  describe('leftSwipeActions', () => {
    it('renders PAID button when invoice is finalized', () => {
      const mockInvoice = { id: 1, finalized: true }
      const mockOnUpdate = jest.fn()
      const mockSetEditInvoice = jest.fn()

      const { getByText, queryByText } = render(
        leftSwipeActions(mockInvoice, mockOnUpdate, mockSetEditInvoice),
      )

      const paidButton = getByText('PAID')

      expect(paidButton).toBeTruthy()
      expect(queryByText('EDIT')).toBeNull()
      expect(queryByText('FINALISE')).toBeNull()

      fireEvent.press(paidButton)
      expect(mockOnUpdate).toHaveBeenCalledWith(mockInvoice.id)
    })
  })

  describe('rightSwipeActions', () => {
    it('renders Delete button and calls onDelete with correct id on press', () => {
      const mockId = 1
      const mockOnDelete = jest.fn()

      const { getByText } = render(rightSwipeActions(mockId, mockOnDelete))

      const deleteButton = getByText('Delete')
      expect(deleteButton).toBeTruthy()

      fireEvent.press(deleteButton)
      expect(mockOnDelete).toHaveBeenCalledWith(mockId)
    })
  })
})
