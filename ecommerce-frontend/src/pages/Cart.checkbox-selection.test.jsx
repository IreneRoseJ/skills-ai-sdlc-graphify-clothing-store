/* @vitest-environment jsdom */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor, cleanup } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import authReducer from '../store/authSlice'
import cartReducer from '../store/cartSlice'
import Cart from './Cart'
import api from '../services/axios'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../components/Navbar', () => ({
  default: () => <div data-testid="navbar" />,
}))

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer" />,
}))

vi.mock('../services/axios', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const baseItems = [
  {
    product: 'prod-1',
    name: 'Alpha Shirt',
    price: 30,
    image: 'alpha.jpg',
    size: 'M',
    qty: 2,
  },
  {
    product: 'prod-2',
    name: 'Beta Jeans',
    price: 40,
    image: 'beta.jpg',
    size: 'L',
    qty: 1,
  },
]

const makeStore = ({ isAuthenticated = false, items = baseItems } = {}) => {
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.qty, 0)
  const totalQuantity = items.reduce((acc, item) => acc + item.qty, 0)

  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
    preloadedState: {
      auth: {
        user: isAuthenticated ? { _id: 'u1', name: 'Test User' } : null,
        token: isAuthenticated ? 'token' : null,
        isAuthenticated,
      },
      cart: {
        items,
        totalAmount,
        totalQuantity,
      },
    },
  })
}

const renderCart = ({ isAuthenticated = false, items = baseItems } = {}) => {
  const store = makeStore({ isAuthenticated, items })

  if (isAuthenticated) {
    api.get.mockResolvedValue({
      data: {
        cartItems: items,
        itemsPrice: items.reduce((acc, item) => acc + item.price * item.qty, 0),
      },
    })
  }

  const view = render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>
  )

  return { store, ...view }
}

const findItemRowCheckbox = (itemName) => {
  const row = screen.getAllByText(itemName)[0]?.closest('tr')
  if (!row) return null
  return within(row).queryByRole('checkbox')
}

beforeEach(() => {
  navigateMock.mockReset()
  api.get.mockReset()
  api.patch.mockReset()
  api.delete.mockReset()
})

afterEach(() => {
  cleanup()
})

describe('Cart checkbox selection for checkout', () => {
  it('shows a checkbox for every cart line item', () => {
    renderCart()

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    const secondRowCheckbox = findItemRowCheckbox('Beta Jeans')

    expect(firstRowCheckbox).not.toBeNull()
    expect(secondRowCheckbox).not.toBeNull()
  })

  it('selects all cart items by default on first render', () => {
    renderCart()

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    const secondRowCheckbox = findItemRowCheckbox('Beta Jeans')

    expect(firstRowCheckbox?.checked).toBe(true)
    expect(secondRowCheckbox?.checked).toBe(true)
  })

  it('allows users to uncheck and re-check individual cart items', () => {
    renderCart()

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    expect(firstRowCheckbox).not.toBeNull()

    fireEvent.click(firstRowCheckbox)
    expect(firstRowCheckbox?.checked).toBe(false)

    fireEvent.click(firstRowCheckbox)
    expect(firstRowCheckbox?.checked).toBe(true)
  })

  it('provides a Select All control that toggles every item selection', () => {
    renderCart()

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
    fireEvent.click(selectAllCheckbox)

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    const secondRowCheckbox = findItemRowCheckbox('Beta Jeans')

    expect(firstRowCheckbox?.checked).toBe(false)
    expect(secondRowCheckbox?.checked).toBe(false)

    fireEvent.click(selectAllCheckbox)
    expect(firstRowCheckbox?.checked).toBe(true)
    expect(secondRowCheckbox?.checked).toBe(true)
  })

  it('keeps Select All visual state in sync when an individual item is unselected', () => {
    renderCart()

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')

    expect(selectAllCheckbox.checked).toBe(true)
    fireEvent.click(firstRowCheckbox)
    expect(selectAllCheckbox.checked).toBe(false)
  })

  it('calculates cart totals from selected items only', () => {
    renderCart()

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    fireEvent.click(firstRowCheckbox)

    const totalsPanel = screen.getByText('Cart Totals').closest('.cart-totals')
    expect(totalsPanel?.textContent).toContain('$40.00')
  })

  it('proceeds to checkout using only selected items', async () => {
    renderCart({ isAuthenticated: true })

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    fireEvent.click(firstRowCheckbox)

    fireEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        '/checkout',
        expect.objectContaining({
          state: expect.objectContaining({
            selectedItems: [expect.objectContaining({ product: 'prod-2' })],
          }),
        })
      )
    })
  })

  it('blocks checkout and shows validation message when no items are selected', async () => {
    renderCart({ isAuthenticated: true })

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
    fireEvent.click(selectAllCheckbox)
    fireEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))

    expect(await screen.findByText(/select at least one item/i)).toBeTruthy()
    expect(navigateMock).not.toHaveBeenCalledWith('/checkout', expect.anything())
  })

  it('keeps unselected items in cart and does not remove them automatically', () => {
    renderCart()

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    fireEvent.click(firstRowCheckbox)

    expect(screen.getByText('Alpha Shirt')).toBeTruthy()
    expect(screen.getByText('Beta Jeans')).toBeTruthy()
  })

  it('persists selection state across in-app navigation until cart contents change', () => {
    const { unmount } = renderCart()

    const firstRowCheckbox = findItemRowCheckbox('Alpha Shirt')
    fireEvent.click(firstRowCheckbox)
    expect(firstRowCheckbox?.checked).toBe(false)

    unmount()
    renderCart()

    const firstRowCheckboxAfterReturn = findItemRowCheckbox('Alpha Shirt')
    expect(firstRowCheckboxAfterReturn?.checked).toBe(false)
  })

  it('updates selection state safely when a selected item is removed from cart', () => {
    renderCart()

    const removeButtons = screen.getAllByRole('button', { name: /remove item/i })
    fireEvent.click(removeButtons[0])

    expect(screen.queryByText('Alpha Shirt')).toBeNull()

    const remainingRowCheckbox = findItemRowCheckbox('Beta Jeans')
    expect(remainingRowCheckbox).not.toBeNull()
    expect(remainingRowCheckbox?.checked).toBe(true)
  })
})
