import ChangePhone from '@/components/Profile/ChangePhone.vue'
import { useUserStore } from '@/stores/user'

describe('<ChangePhone />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Step 1: Display Default Phone Profile', () => {
        cy.mount(ChangePhone).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123', phone: '0200345177' }
        })

        cy.contains('Enter one-time password').should('be.visible')
        cy.contains('0200345177').should('be.visible')
        cy.contains('Submit').should('be.disabled')
    })

    it('Step 1: Verify Phone number with OTP without any Phone number', () => {
        cy.intercept('GET', '**/phone/update_request/confirm*', {
            statusCode: 200,
            body: { success: true }
        }).as('verifyOTP')

        cy.mount(ChangePhone).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('Submit').should('be.disabled')

        cy.get('input').first().type('123456')
        cy.contains('Submit').should('not.be.disabled').click()

        // cy.wait('@verifyOTP').then(() => {
        //   cy.contains('Enter your New phone number').should('be.visible')
        // })
    })

    it('Step 2: Display section to submit new email', () => {
        cy.intercept('POST', '**/phone/update_request/confirm*', {
            statusCode: 200,
            body: { security_token: 'sec-tok-123' }
        }).as('submitOTP')

        cy.intercept('GET', '**/phone/update*', {
            statusCode: 200,
            body: { success: true }
        }).as('newPhone')

        cy.mount(ChangePhone).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('Submit').should('be.disabled')
        cy.get('input').first().type('123456')
        cy.contains('Submit').should('not.be.disabled').click()

        // cy.wait('@submitOTP').then(() => {
        //   cy.contains('Enter your New phone number').should('be.visible')
        //   cy.get('input[type="text"]').type('0234521223')
        //   cy.contains('Submit').click()
        // })

        // cy.wait('@newPhone').then(() => {
        //   cy.contains('0234521223').should('be.visible')
        // })
    })
})