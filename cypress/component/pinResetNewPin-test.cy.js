import NewPIN from '@/components/PinReset/NewPIN.vue'
import { useProfileStore } from '@/stores/profile'

describe('<OTP />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Verify New PIN Page', () => {
        cy.mount(NewPIN)

        cy.contains('Enter and confirm your new PIN').should('be.visible')
        cy.contains('New Pin').should('be.visible')

        cy.contains('button', 'Submit').should('be.disabled')
    })

    it('Verify NewPIN Value sent to phone number - Case 1', () => {
        cy.mount(NewPIN)

        cy.contains('New Pin').should('be.visible')
        cy.contains('Confirm Pin').should('be.visible')
        cy.get('input[type="password"]').eq(0).type('1111')
        cy.get('input[type="password"]').eq(4).type('2222')

        cy.contains('Both PIN should match').should('be.visible')
        cy.contains('button', 'Submit').should('be.disabled')
    })

    it('Verify NewPIN Value sent to phone number - Case 2', () => {

        cy.intercept('POST', '**/reset_pin', {
          statusCode: 200,
          body: { success: true }
        }).as('verifyNewPIN')

        cy.mount(NewPIN)

        cy.contains('New Pin').should('be.visible')
        cy.contains('Confirm Pin').should('be.visible')
        cy.get('input[type="password"]').eq(0).type('1111')
        cy.get('input[type="password"]').eq(4).type('1111')

        cy.contains('button', 'Submit').should('not.be.disabled').click()

        // cy.wait('@verifyNewPIN').then(() => {
        //     const uiStore = useUiStore()

        //     expect(uiStore.notifyDialog).to.be.true
        //     expect(uiStore.notifyMessage).to.equal('Your PIN has been successfully updated')
        // })
    })
})