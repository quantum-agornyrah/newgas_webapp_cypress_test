import DeleteAccount from '@/components/Profile/DeleteAccount.vue'
import { useUiStore } from '@/stores/ui'

describe('<DeleteAccount />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Default Delete Modal', () => {
        cy.mount(DeleteAccount)

        cy.contains('Why are you leaving us ?').should('be.visible')
        cy.contains('I no longer need the service.').should('be.visible')
        cy.contains('Privacy or security concerns.').should('be.visible')

        cy.contains('Continue').should('be.visible')
    })

    it('Display Reason text area', () => {
        cy.mount(DeleteAccount)

        cy.contains('Why are you leaving us ?').should('be.visible')
        cy.contains('I no longer need the service.').should('be.visible')
        cy.contains('Privacy or security concerns.').should('be.visible')

        cy.contains('Other').should('be.visible').click()
        cy.get('textarea[placeholder="Reason for deleting..."]').type('I have no idea')
    })

    it('Continue button Functionality', () => {
        cy.mount(DeleteAccount)

        cy.contains('Why are you leaving us ?').should('be.visible')
        cy.contains('I no longer need the service.').should('be.visible')
        cy.contains('Privacy or security concerns.').should('be.visible')

        cy.contains('Other').should('be.visible').click()
        cy.get('textarea[placeholder="Reason for deleting..."]').type('I have no idea')
        cy.contains('Continue').should('be.visible').click()

        cy.contains('Delete Account').should('be.visible')
        cy.contains('Is this goodbye? Are you sure you don’t want to reconsider?').should('be.visible')

        cy.contains('button', 'Submit').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.deleteDialog).to.be.true
        })
    })
})