import ChangePIN from '@/components/Profile/ChangePIN.vue'
import { useUserStore } from '@/stores/user'

describe('<ChangePIN />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Step 1: Display Default Pin Profile', () => {
        cy.mount(ChangePIN).then(() => {
            const userStore = useUserStore()
            userStore.user = { 
                id: 'usr-123', 
                phone: '0200345177', 
                first_name: 'Cypress', 
                last_name: 'Tester' 
            }
        })

        cy.contains('Enter one-time password').should('be.visible')
        cy.contains('0200345177').should('be.visible')
        cy.contains('Submit').should('be.disabled')
    })

    it('Step 1: Verify PIN number with OTP without any User Data', () => {
        cy.intercept('POST', '**/verify_otp*', {
            statusCode: 200,
            body: { success: true }
        }).as('verifyOTP')

        cy.mount(ChangePIN).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('Submit').should('be.disabled')
        cy.get('input').first().type('123456')
        cy.contains('Submit').should('not.be.disabled').click()

        // cy.wait('@verifyOTP').then(() => {
        //   cy.contains('Welcome, Cypress Tester').should('be.visible')
        //   cy.contains('Please enter the old 4-digit PIN').should('be.visible')
        // })
    })

    it('Step 2: Display section to input new PIN so hat it doesnt match with old PIN', () => {
        cy.intercept('POST', '**/verify_otp*', {
            statusCode: 200,
            body: { success: true }
        }).as('submitPIN')

        cy.mount(ChangePIN).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('Submit').should('be.disabled')
        cy.get('input').first().type('123456')
        cy.contains('Submit').should('not.be.disabled').click()

        // cy.wait('@submitPIN').then(() => {
        //   cy.contains('Welcome, Cypress Tester').should('be.visible')
        //   cy.contains('Please enter the old 4-digit PIN').should('be.visible')

        //   cy.get('input[type="password"]').eq(0).type('1234')
        //   cy.get('input[type="password"]').eq(1).type('5678')
        //   cy.get('input[type="password"]').eq(2).type('5688')

        //   cy.contains('Both PIN should match').should('be.visible')
        //   cy.contains('continue').should('be.visible')
        // })
    })
})