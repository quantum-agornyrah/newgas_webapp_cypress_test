import OrderHistoryCard from '@/components/Orders/OrderHistoryCard.vue'
import { useOrderStore } from '@/stores/order'
import { useUiStore } from '@/stores/ui'
import { useCartStore } from '@/stores/cart'

describe('<OrderHistoryCard />', () => {

  const mockOrderHistory = {
    id: 'ord-101',
    created_at: '2026-08-20T10:00:00Z',
    products: [
        { style_name: '12kg Cylinder' }
    ],
    transactions: [
        { payable_amount: 150 }
    ]
  }

  it('Test for displaying order history information', () => {
    cy.mount(OrderHistoryCard, {
      props: {
        status: 'completed',
        order: mockOrderHistory,
        refill_id: 'refill-001',
      }
    })

    cy.contains('12kg Cylinder').should('be.visible')
    cy.contains('completed').should('be.visible')
    cy.contains('GHS 150').should('be.visible')
  })

  it('Test for reorder button diability', () => {
    cy.mount(OrderHistoryCard, {
      props: {
        status: 'created',
        order: mockOrderHistory,
        refill_id: 'refill-001',
      }
    })

    cy.contains('button', 'Reorder').should('be.disabled')
  })

  it('Test for reorder button visibility', () => {
    cy.mount(OrderHistoryCard, {
      props: {
        status: 'completed',
        order: mockOrderHistory,
        refill_id: 'refill-001',
      }
    })

    cy.contains('button', 'Reorder').should('not.be.disabled')
  })

  it('Test for reorder functionality with existing cart items', () => {
    cy.mount(OrderHistoryCard, {
      props: {
        status: 'completed',
        order: mockOrderHistory,
        refill_id: 'refill-001',
      }
    }).then(() => {
        const cartStore = useCartStore()
        cartStore.cart = { cart_items: { quantity: 2} }
    })

    cy.contains('button', 'Reorder').should('be.visible')
    cy.contains('button', 'Reorder').click().then(() => {
        const uiStore = useUiStore()
        expect(uiStore.clearCartDialog).to.be.true  
    })
  })
})