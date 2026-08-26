describe('Profile and Location Flow', () => {

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

  const mockGpsResult = {
    id: 'gps-001',
    address_code: 'GA-183-8164',
    street: 'Main St',
    post_code: '00233',
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    area: 'Airport Residential Area',
    latitude: '5.6037',
    longitude: '-0.1870'
  }

  beforeEach(() => {
    // Authenticate user
    cy.login(mockUser)

    // Make necessary API calls
    cy.intercept('GET', '**/nova_auth/customer/*/details*', { statusCode: 200, body: mockUser }).as('getUser')
    cy.intercept('GET', '**/location/customer/*/address*', { statusCode: 200, body: { items: [mockAddress] } }).as('getAddresses')
  })

  it('Display Profile details', () => {
    // Call out all cylinder products
    cy.intercept('PATCH', '**/nova_auth/customer/*/update_profile', { statusCode: 200, body: { message: 'Profile Updated' } }).as('getProfile')

    // Visit the profiles page and wait for call to execute
    cy.visit('/profile')
    cy.wait('@getUser')

    // Display the necessory elements
    cy.get('input[placeholder="Eg. Kwadwo"]').should('have.value', 'Cypress')
    cy.get('input[placeholder="Eg. Mensah"]').should('have.value', 'Tester')

    cy.contains('button', 'Edit Profile').click()

    cy.get('input[placeholder="Eg. Kwadwo"]').clear().type('UpdatedName')
    cy.contains('button', 'Save').click()

    cy.wait('@getProfile')

    // Verify successful addition to cart
    cy.get('.v-dialog').should('contain.text', 'Your Profile has been successfully updated')
  })

  it('Test GPS Location Tab & View Address List', () => {

    // Visit the profile page and wait for call to execute
    cy.visit('/profile')
    cy.wait('@getUser')
    cy.wait('@getAddresses')

    // Switch to the Accessories tab
    cy.contains('GPS Location').click()

    // Display the necessory elements
    cy.contains('GA-183-8164').should('be.visible')
    cy.contains('Airport Residential').should('be.visible')
  })

  it('Search Ghana Post GPS Address Code', () => {
    // Call out all postal addresses
    cy.intercept('GET', '**/location/ghana_post_address/search/address*', {
      statusCode: 200,
      body: mockGpsResult,
    }).as('getGPSAddress')

    // Visit the profile page and wait for call to execute
    cy.visit('/profile')
    cy.wait('@getUser')
    cy.wait('@getAddresses')

    cy.contains('GPS Location').click()

    cy.contains('button', 'Add Address').click()
    cy.contains('Enter delivery location’s details').should('be.visible')
    cy.get('.v-window-item--active input').first().type('GA-183-8164')
    cy.contains('button', 'Submit').click()

    cy.wait('@getGPSAddress')

    // Verify and scroll to address card details
    cy.contains('Street').scrollIntoView().should('be.visible')
    cy.contains('Main St').should('be.visible')
    cy.contains('Universal Address').parent().should('contain.text', 'GA-183-8164')
    cy.contains('Airport Residential Area').should('be.visible')
  })
})