# Ticket: Cart Item Selection for Checkout

## Summary

Add checkbox-based selection on the cart page so users can choose which cart items are included in checkout.

## Problem

Today, all items in the cart are always used for checkout. Users need the ability to keep items in the cart but exclude some of them from the current checkout.

## Requirement

On the cart page, each cart item must have a checkbox. Only checked items should be sent to checkout and used to calculate checkout totals. Unchecked items must remain in the cart and must not be included in the checkout flow.

## User Story

As a shopper, I want to select only certain items from my cart for checkout, so I can purchase part of my cart now and leave the rest for later.

## Acceptance Criteria

1. A checkbox is displayed for every cart line item.
2. By default, all cart items are selected when the cart page loads.
3. Users can check and uncheck individual items.
4. A "Select All" control is available:
   - Checking it selects all cart items.
   - Unchecking it clears all selections.
   - Its visual state reflects whether all items are currently selected.
5. Cart totals on the cart page are calculated from selected items only.
6. Clicking "Proceed to Checkout" sends only selected items to the checkout page.
7. If no items are selected and user clicks "Proceed to Checkout", checkout must not continue:
   - Show a clear validation message asking user to select at least one item.
8. Unselected items remain in the cart and are not removed automatically.
9. Selected state should persist during in-app navigation (for example, cart -> product -> cart) until the cart content changes.
10. If a selected item is removed from cart, selection state updates safely without errors.

## Out of Scope

- No database schema changes are required.
- No change to payment provider integration behavior beyond using selected items only.
- No bulk delete endpoint is required in this ticket.

## Notes for Implementation

- Selection should be tracked by a stable cart item identity (product + size combination, or equivalent unique key used by the cart).
- Checkout summary, subtotal, shipping, and total should be based on selected items only.
- Existing single-item remove from cart behavior should continue to work unchanged.

## Suggested Frontend Areas

- ecommerce-frontend/src/pages/Cart.jsx
- ecommerce-frontend/src/pages/Checkout.jsx
- ecommerce-frontend/src/store/cartSlice.js

## Suggested Backend Impact

- None required if selected items are passed from frontend checkout payload.
- Validate on payment session creation that item list is non-empty.
