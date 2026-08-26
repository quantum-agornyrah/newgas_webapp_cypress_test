describe('Cart Details & Order History Flow', () => {

  const mockUser = {
    id: '001',
    first_name: 'Cypress',
    last_name: 'Tester',
    email: 'cypresstester@gmail.com',
    phone: '0200738155'
  }

  const mockAddress = {
    id: 'addr-1',
    name: 'Home',
    phone: '0200738155',
    is_default: true,
    ghana_post_address: {
      address_code: 'GA-183-8164',
      area: 'Airport Residential',
      region: 'Greater Accra',
      district: 'Accra Metropolitan',
      street: 'Main St'
    }
  }

  const mockOrderTypes = [
    { id: 'type-1', name: 'refill' },
    { id: 'type-2', name: 'new' },
    { id: 'type-3', name: 'exchange' },
    { id: 'type-4', name: 'pay_at_once' }
  ]

  const mockDeliveryOptions = {
    items: [
      { id: 'del-1', name: 'Free delivery', delivery_cost: '0.00' },
      { id: 'del-2', name: 'Fast delivery', delivery_cost: '20.00' }
    ]
  }

  const mockTimeSlots = {
    items: [
      { id: 'slot-1', start_time: '09:00 AM', end_time: '12:00 PM' },
      { id: 'slot-2', start_time: '02:00 PM', end_time: '05:00 PM' }
    ]
  }

  const mockCartItems = {
    cart_items: {
      quantity: 1,
      total_cost: 150,
      product: [
        {
          id: 'cart-item-1',
          style_name: '12kg Cylinder Refill',
          style_description: '12kg Cylinder Refill',
          deposit_cost: 0,
          gas_cost: 150,
          quantity: 1,
          payable_amount: 150,
          order_type: 'type-1',
          thumbnail_image: '/logo.png'
        }
      ]
    }
  }

  const mockOrderHistory = {
    items: [
      {
        id: 'ord-101',
        order_status: 'completed',
        created_at: '2026-08-20T09:00:00Z',
        products: [{ style_name: '12kg Cylinder Refill' }],
        transactions: [{ payable_amount: 150 }]
      },
      {
        id: 'ord-102',
        order_status: 'confirmed',
        created_at: '2026-08-22T10:00:00Z',
        products: [{ style_name: '10kg Cylinder' }],
        transactions: [{ payable_amount: 70 }]
      },
      {
        id: 'ord-103',
        order_status: 'confirmed',
        created_at: '2026-08-24T12:00:00Z',
        products: [{ style_name: '15kg Cylinder' }],
        transactions: [{ payable_amount: 170 }]
      },
      {
        id: 'ord-104',
        order_status: 'completed',
        created_at: '2026-08-26T11:00:00Z',
        products: [{ style_name: '7kg Cylinder' }],
        transactions: [{ payable_amount: 50 }]
      }
    ],
    pagination: { pages: 1 }
  }

  beforeEach(() => {
    // Authenticate user
    cy.login(mockUser)

    // Make necessary API calls
    cy.intercept('GET', '**/nova_auth/customer/*/details*', { statusCode: 200, body: mockUser }).as('getUser')
    cy.intercept('GET', '**/location/customer/*/address*', { statusCode: 200, body: { items: [mockAddress] } }).as('getAddresses')
    cy.intercept('GET', '**/order_type*', { statusCode: 200, body: { items: mockOrderTypes } }).as('getOrderTypes')
    cy.intercept('GET', '**/order/order_type*', { statusCode: 200, body: { items: mockOrderTypes } }).as('getOrderTypesFull')
    cy.intercept('GET', '**/order/delivery_type*', { statusCode: 200, body: mockDeliveryOptions }).as('getDeliveryOptions')
    cy.intercept('GET', '**/location/timeslots*', { statusCode: 200, body: mockTimeSlots }).as('getTimeSlots')
  })

  it('Display Cart and Product details', () => {
    // Call out all cylinder products
    cy.intercept('GET', '**/order/customers/*/carts*', {
      statusCode: 200,
      body: { items: mockCartItems }
    }).as('getCart')

    // Visit the products page and wait for call to execute
    cy.visit('/orderdetails')
    cy.wait('@getUser')
    cy.wait('@getCart')

    // Display the necessory elements
    cy.contains('12kg Cylinder Refill').should('be.visible')
    cy.contains('Gas Cost: 150').should('be.visible')
    cy.contains('Quantity: 1').should('be.visible')
    cy.contains('GHS 150').should('be.visible')
  })

  it('Remove a cart item', () => {
    // Call out all cylinder products
    cy.intercept('GET', '**/order/customers/*/carts*', {
      statusCode: 200,
      body: { items: mockCartItems }
    }).as('getCart')

    cy.intercept('DELETE', '**/order/customers/*/carts/*', {
      statusCode: 200,
      body: { message: 'Item deleted' }
    }).as('removeCartItem')

    // Visit the products page and wait for call to execute
    cy.visit('/orderdetails')
    cy.wait('@getUser')
    cy.wait('@getCart')

    // Click the delete icon
    cy.get('.mdi-delete-outline').first().click()

    // Display the necessory elements
    cy.get('.v-dialog').should('contain.text', 'Remove Product?')
    cy.contains('button', 'Yes, Remove').click()

    cy.wait('@removeCartItem')
  })

  it('Display Empty Cart state', () => {
    // Call out all cylinder products
    cy.intercept('GET', '**/order/customers/*/carts*', {
      statusCode: 200,
      body: { items: { cart_items: { quantity: 0, total_cost: 0, product: [] } } }
    }).as('getCart')

    // Visit the products page and wait for call to execute
    cy.visit('/orderdetails')
    cy.wait('@getUser')
    cy.wait('@getCart')

    // Display the necessory elements
    cy.contains('Your Cart is empty').should('be.visible')
  })

  it('Display Order History List', () => {
    // Call out all cylinders to refill
    cy.intercept('GET', '**/order/customer/*/orders/v2*', {
      statusCode: 200,
      body: mockOrderHistory
    }).as('getOrderHistory')

    cy.visit('/orders')
    cy.wait('@getUser')
    cy.wait('@getOrderHistory')

    // Display the necessory elements
    cy.contains('Order History').should('be.visible')
    cy.contains('12kg Cylinder Refill').should('be.visible')
    cy.contains('completed').should('be.visible')
    cy.contains('GHS 150').should('be.visible')

    cy.contains('15kg Cylinder').should('be.visible')
    cy.contains('confirmed').should('be.visible')
    cy.contains('GHS 170').should('be.visible')
  })

  it('Display Empty Order History state', () => {
    // Call out all cylinder products
    cy.intercept('GET', '**/order/customer/*/orders/v2*', {
      statusCode: 200,
      body: { items : [] }
    }).as('getOrderHistory')

    // Visit the products page and wait for call to execute
    cy.visit('/orders')
    cy.wait('@getUser')
    cy.wait('@getOrderHistory')

    // Display the necessory elements
    cy.contains('You have no order history').should('be.visible')
  })
})