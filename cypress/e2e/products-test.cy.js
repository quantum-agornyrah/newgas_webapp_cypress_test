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

  const mockCategories = [
    { id: 'c-cyl-001', name: 'Cylinder' },
    { id: 'c-acc-001', name: 'Accessories' }
  ]

  // Mock PRODUCTS [Cylinders & Accessories]
  const mockCylinders = [
    {
      id: 'prod-cyl-1',
      style_name: '12kg Cylinder',
      style_description: '12kg LPG Cylinder with Burner',
      deposit: 200,
      gas_cost: 150,
      total_cost: 350,
      thumbnail_image: '/logo.png'
    },
    {
      id: 'prod-cyl-2',
      style_name: '5kg Cylinder',
      style_description: '5kg LPG Cylinder with a tube',
      deposit: 100,
      gas_cost: 70,
      total_cost: 170,
      thumbnail_image: '/logo.png'
    },
  ]

  const mockAccessories = [
    {
      id: 'prod-acc-1',
      style_name: 'Smart Gas Regulator',
      style_description: 'High pressure safety regulator',
      total_cost: 80,
      thumbnail_image: '/logo.png'
    },
    {
      id: 'prod-acc-2',
      style_name: 'Inflammable Apron',
      style_description: 'High fire resistant apron',
      total_cost: 50,
      thumbnail_image: '/logo.png'
    },
  ]

  beforeEach(() => {
    // Authenticate user
    cy.login(mockUser)

    // Make necessary API calls
    cy.intercept('GET', '**/nova_auth/customer/*/details*', { statusCode: 200, body: mockUser }).as('getUser')
    cy.intercept('GET', '**/location/customer/*/address*', { statusCode: 200, body: { items: [mockAddress] } }).as('getAddresses')
    cy.intercept('GET', '**/order_type*', { 
      statusCode: 200, 
      body: [
        { id: '1', name: 'new' },
        { id: '2', name: 'exchange' },
        { id: '3', name: 'pay_at_once' },
      ] 
    }).as('getOrderTypes')

    cy.intercept('GET', '**/product/productcategories/*', { statusCode: 200, body: { items: mockCategories }}).as('getCategories')
  })

  it('Display Cylinders', () => {
    // Call out all cylinder products
    cy.intercept('GET', '**/product/customers/products/?category_id=c-cyl*', {
      statusCode: 200,
      body: { items: mockCylinders }
    }).as('getCylinders')

    // Visit the products page and wait for call to execute
    cy.visit('/products')
    cy.wait('@getCategories')
    cy.wait('@getCylinders')

    // Display the necessory elements
    cy.contains('Select your preferred cylinder type and size').should('be.visible')
    cy.contains('12kg Cylinder').should('be.visible')
    cy.contains('Gas cost: GHS 150').should('be.visible')

    cy.contains('5kg Cylinder').should('be.visible')
    cy.contains('Gas cost: GHS 70').should('be.visible')
  })

  it('Display Accessories', () => {
    // Call out all cylinder products
    cy.intercept('GET', '**/product/customers/products/?category_id=c-acc*', {
      statusCode: 200,
      body: { items: mockAccessories }
    }).as('getAccessories')

    // Visit the products page and wait for call to execute
    cy.visit('/products')
    cy.wait('@getCategories')

    // Switch to the Accessories tab
    cy.contains('button', 'Accessories').click()
    cy.wait('@getAccessories')

    // Display the necessory elements
    cy.contains('Select your preferred Newgas Accessory').should('be.visible')
    cy.contains('Smart Gas Regulator').should('be.visible')
    cy.contains('GHS 80').should('be.visible')

    cy.contains('Inflammable Apron').should('be.visible')
    cy.contains('GHS 50').should('be.visible')
  })

  it('Test Qunatity and Adding accessory to cart ', () => {
    // Call out all cylinders to refill
    cy.intercept('GET', '**/product/customers/products/?category_id=c-cyl*', {
      statusCode: 200,
      body: { items: mockCylinders }
    }).as('getCylinders')

    cy.intercept('GET', '**/product/customers/products/?category_id=c-acc*', {
      statusCode: 200,
      body: { items: mockAccessories }
    }).as('getAccessories')

    cy.intercept('POST', '**/order/customers/*/carts*', {
      statusCode: 200,
      body: { message: 'Added to cart' }
    }).as('addToCart')

    cy.visit('/products')
    cy.wait('@getCylinders')

    // Go to the Accessories tab
    cy.contains('button', 'Accessories').click()
    cy.wait('@getAccessories')

    // Increase quantity of first item and add to cart
    cy.get('.mdi-plus').eq(0).click()
    cy.contains('button:visible', 'Select').first().click()
    cy.wait('@addToCart')

    // Verify successful addition to cart
    cy.get('.v-dialog').should('contain.text', 'Success')
  })
})