import ProfileDetails from '@/components/Profile/ProfileDetails.vue'
import { useUiStore } from '@/stores/ui'

describe('<ProfileDetails />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Default Profile Details Form', () => {
        cy.mount(ProfileDetails)

        cy.contains('Profile Picture').should('be.visible')
        cy.contains('First Name').should('be.visible')
        cy.contains('Last Name').should('be.visible')
        // cy.contains('Email').should('be.visible')
        cy.contains('Edit Profile').should('be.visible')
    })

    it('Edit Form button Functionality', () => {
        cy.mount(ProfileDetails)

        cy.contains('Profile Picture').should('be.visible')
        cy.contains('First Name').should('not.be.disabled')
        cy.contains('Last Name').should('not.be.disabled')
        // cy.contains('Email').should('not.be.disabled')

        cy.contains('Edit Profile').should('be.visible').click()

        cy.contains('Cancel').should('be.visible')
        cy.contains('Save').should('be.disabled')
    })

    it('Submitting form with user data', () => {
        cy.intercept('POST', '**/update_profile*', {
            statusCode: 200,
            body: { success: true }
        }).as('submitProfile')

        cy.mount(ProfileDetails)

        cy.contains('Edit Profile').should('be.visible').click()
        cy.contains('Save').should('be.disabled')

        cy.get('input[placeholder="Eg. Kwadwo"]').type('Cypress')
        cy.get('input[placeholder="Eg. Mensah"]').type('Tester')
        // cy.get('input[placeholder="Eg. kwadwomensah@example.com"]').type('cypresstester@gmail.com')

        cy.contains('Save').should('not.be.disabled').click()

        // cy.wait('@submitProfile').then(() => {
        //     const uiStore = useUiStore()
        //     expect(uiStore.success).to.be.true
        //     expect(uiStore.notifyTitle).to.be.eq('Success')
        // })
    })
})