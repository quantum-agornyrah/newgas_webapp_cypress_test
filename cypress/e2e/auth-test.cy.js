describe('Authentication Flow Test', () => {

  const mockUser = {
    id: '001',
    first_name: 'Cypress',
    last_name: 'Tester',
    phone: '0200738155',
    email: 'cypresstester@gmail.com',
  }

  beforeEach(() => {
    cy.visit('/')
  })

  it('1. Test for phone number validation', () => {
    cy.get('button[type="submit"]:visible').should('be.disabled')

    cy.get('input[type="text"]').type('020073815')
    cy.get('button[type="submit"]:visible').should('be.disabled')
    cy.contains('Must be a valid phone number').should('be.visible')

    cy.get('input[type="text"]').type('5')
    cy.get('button[type="submit"]:visible').should('not.be.disabled')
  })

  it('2. Successful Login flow with PIN', () => {
    cy.intercept('GET', '**/nova_auth/customer/check_phone_exists*', {
      statusCode: 200,
      body: {
        pin_exists: true,
      }
    }).as('checkPhone')

    cy.intercept('POST', '**/nova_auth/customer/login', {
      statusCode: 200,
      body: {
        access_token: 'fake-jwt-access-token',
        refresh_token: 'fake-jwt-refresh-token',
        data: mockUser,
      }
    }).as('loginRequest')

    cy.intercept('GET', '**/nova_auth/customer/*/details*', {
      statusCode: 200,
      body: mockUser
    }).as('getUserDetails')

    cy.intercept('GET', '**/location/customer/*/address*', {
      statusCode: 200,
      body: { items: [{ id: 'addr-1', is_default: true, address: 'Accra' }] }
    }).as('getAddresses')

    cy.intercept('GET', '**/order/customer/**', {
      statusCode: 200,
      body: { items: [] }
    }).as('getOrders')

    cy.intercept('GET', '**/order_type*', {
      statusCode: 200,
      body: [{ id: '1', name: 'refill' }]
    }).as('getOrderType')

    cy.get('input[type="text"]').first().type('0200738155')
    cy.get('button[type="submit"]:visible').click()
    cy.wait('@checkPhone')

    cy.get('input[type="password"]').type('1234')
    cy.get('button[type="submit"]:visible').click()

    cy.wait('@loginRequest')
    cy.wait('@getUserDetails')

    cy.url().should('include', '/orders')
  })

  it('3. Invalid Login flow with wrong PIN', () => {
    cy.intercept('GET', '**/nova_auth/customer/check_phone_exists*', {
      statusCode: 200,
      body: {
        pin_exists: true,
      }
    }).as('checkPhone')

    cy.intercept('POST', '**/nova_auth/customer/login', {
      statusCode: 400,
      body: 'Invalid credentials provided'
    }).as('failedRequest')

    cy.get('input[type="text"]').first().type('0200738155')
    cy.get('button[type="submit"]:visible').click()
    cy.wait('@checkPhone')

    cy.get('input[type="password"]').type('9999')
    cy.contains('button', 'Login').click()
    cy.wait('@failedRequest')

    cy.get('.v-card').should('contain.text', 'Error')
  })

  it('4. Successful Login flow with OTP', () => {
    cy.intercept('GET', '**/nova_auth/customer/check_phone_exists*', {
      statusCode: 200,
      body: {
        pin_exists: false,
      }
    }).as('checkPhone')

    cy.intercept('GET', '**/nova_auth/customer/send_otp*', {
      statusCode: 200,
      body: {
        message: 'OTP sent successfully'
      }
    }).as('sendOtp')

    cy.get('input[type="text"]').first().type('0200738155')
    cy.get('button[type="submit"]:visible').click()

    cy.wait('@checkPhone')
    cy.wait('@sendOtp')
    
    cy.contains('Please enter the 6-digit One-time password').should('be.visible')
    cy.contains('OTP Code valid for').should('be.visible')
  })
})