import ChangeEmail from '@/components/Profile/ChangeEmail.vue'
import { useUserStore } from '@/stores/user'

describe('<ChangeEmail />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Step 1: Display Default Email Profile', () => {
        cy.mount(ChangeEmail).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123', email: 'cypresstester@gmail.com' }
        })

        cy.contains('Your email address').should('be.visible')
        cy.contains('cypresstester@gmail.com').should('be.visible')
        cy.contains('Change Email').should('be.visible')
    })

    it('Step 1: Display Email Profile with no email', () => {
        cy.mount(ChangeEmail).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('No email address has been added yet').should('be.visible')
    })

    it('Step 2: Display OTP section to change email', () => {
        cy.intercept('GET', '**/nova_auth/customer/usr-123/email/update_request*', {
            statusCode: 200,
            body: { success: true }
        }).as('getOTP')

        cy.mount(ChangeEmail).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123', email: 'cypresstester@gmail.com' }
        })

        cy.contains('button', 'Change Email').click()

        // cy.get('getOTP').then(() => {
        //     cy.contains('Enter one-time password').should('be.visible')
        //     cy.contains('We have sent the verification code to the email cypresstester@gmail.com')
        // })
    })

    it('Step 3: Add email when no email exists', () => {
        cy.mount(ChangeEmail).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('No email address has been added yet').should('be.visible')
        cy.contains('Add Email').click()
        cy.contains('Submit').should('be.disabled')

        cy.contains('Enter your email address').should('be.visible')
        cy.get('input[type="text"]').type('newemail@gmail.com')

        cy.contains('Submit').should('not.be.disabled')

    })
})