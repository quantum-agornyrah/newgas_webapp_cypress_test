import OTP from '@/components/PinReset/OTP.vue'
import { useProfileStore } from '@/stores/profile'

describe('<OTP />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Verify OTP Page', () => {
        cy.mount(OTP).then(() => {
          const profileStore = useProfileStore()
          profileStore.forgotPin_phone = '0200714322'
        })

        cy.contains('Please enter the 6-digit One-time password (OTP)').should('be.visible')
        cy.contains('we have sent to your number 0200714322').should('be.visible')

        cy.contains('button', 'Submit').should('be.disabled')
    })

    it('Verify OTP Value sent to phone number', () => {
        const onIncrease = cy.spy().as('increaseEmit')

        cy.intercept('POST', '**/verify_otp', {
          statusCode: 200,
          body: { access_token: 'acc-123', refresh_token: 'ref_123', data: {} }
        }).as('verifyOTP')

        cy.mount(OTP, {
            onIncrease
        })

        cy.get('input').first().type('123456')
        cy.contains('button', 'Submit').should('not.be.disabled').click()

        // cy.wait('@verifyOTP').then(() => {
        //     cy.get('@increseEmit').should('have.been.calledOnce')
        // })
    })
})