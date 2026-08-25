describe('Gas Refill Flow', () => {

  const mockUser = {
    id: '001',
    first_name: 'Cypress',
    last_name: 'Tester',
  }

  const mockAddress = {
    id: 'addr-1',
    is_default: true,
    street: 'Main St'
  }

  const mockCylinders = [
    {
      id: 'cyl-12kg',
      style_name: '12kg Cylinder',
      style_description: '12kg LPG Cylinder Refill',
      gas_cost: 150,
      customer_deposit_token_id: 'token-123',
      deposit_token_in_cart: false,
      images: [{ image_url: '/logo.png' }]
    },
    {
      id: 'cyl-5kg',
      style_name: '5kg Cylinder',
      style_description: '5kg LPG Cylinder Refill',
      gas_cost: 70,
      customer_deposit_token_id: 'token-456',
      deposit_token_in_cart: true,
      images: [{ image_url: '/logo.png' }]
    },
    {
      id: 'cyl-15kg',
      style_name: '15kg Cylinder',
      style_description: '15kg LPG Cylinder Refill',
      gas_cost: 120,
      customer_deposit_token_id: 'token-789',
      deposit_token_in_cart: true,
      images: [{ image_url: '/logo.png' }]
    }
  ]

  beforeEach(() => {
    // Authenticate user
    cy.login(mockUser)

    // Make necessary API calls
    cy.intercept('GET', '**/nova_auth/customer/*/details*', { statusCode: 200, body: mockUser }).as('getUser')
    cy.intercept('GET', '**/location/customer/*/address*', { statusCode: 200, body: { items: [mockAddress] } }).as('getAddresses')
    cy.intercept('GET', '**/order_type*', { statusCode: 200, body: [{ id: 'type-refill', name: 'refill' }] }).as('getOrderTypes')
  })

  it('Display cylinder sizes', () => {
    // Call out all cylinders to refill
    cy.intercept('GET', '**/order/customer_deposit_token/*/refill_cylinders*', {
      statusCode: 200,
      body: { items: mockCylinders }
    }).as('getCylinders')

    // Visit the refill page and wait for call to execute
    cy.visit('/refill')
    cy.wait('@getCylinders')

    // Display the available cylinders
    cy.contains('List of your available cylinders for refill').should('be.visible')
    cy.contains('12kg Cylinder').should('be.visible')
    cy.contains('5kg Cylinder').should('be.visible')
    cy.contains('15kg Cylinder').should('be.visible')
  })

  it('Display empty state when cylinders are no available', () => {
    // Call out all cylinders to refill
    cy.intercept('GET', '**/order/customer_deposit_token/*/refill_cylinders*', {
      statusCode: 200,
      body: { items: [] }
    }).as('getEmptyCylinders')

    cy.visit('/refill')
    cy.wait('@getEmptyCylinders')

    cy.contains('No cylinders available for refill').should('be.visible')
  })

  it('Test adding cylinder to cart ', () => {
    // Call out all cylinders to refill
    cy.intercept('GET', '**/order/customer_deposit_token/*/refill_cylinders*', {
      statusCode: 200,
      body: { items: mockCylinders }
    }).as('getCylinders')

    cy.intercept('POST', '**/order/customers/*/carts*', {
      statusCode: 200,
      body: { message: 'Item added to cart' }
    }).as('addToCart')

    cy.intercept('GET', '**/order/customers/*/carts*', {
      statusCode: 200,
      body: { card_items: { quantity: 1 } }
    }).as('getCart')
    
    cy.visit('/refill')
    cy.wait('@getCylinders')

    cy.contains('button', 'Refill').click()

    cy.wait('@addToCart')

    // Verify successful addition to cart
    cy.get('.v-dialog').should('contain.text', 'Success')
  })
})