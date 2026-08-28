import NewCylinder from '@/components/Prompts/NewCylinder.vue'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

describe('<NewCylinder />', () => {
    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Default dialog', () => {
        cy.mount(NewCylinder).then(() => {
            const uiStore = useUiStore()
            uiStore.newCylinder = true
        })

        cy.contains('Cash Deposit').should('be.visible')
        cy.contains('Cylinder Deposit').should('be.visible')
    })

    it('Close dialog', () => {
        cy.mount(NewCylinder).then(() => {
            const uiStore = useUiStore()
            uiStore.newCylinder = true
        })

        cy.get('.mdi-close').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.newCylinder).to.be.false
        })
    })

    it('The Cylinder Deposit functionality', () => {
        cy.mount(NewCylinder).then(() => {
            const uiStore = useUiStore()
            uiStore.newCylinder = true
        })

        cy.contains('Checkout Cart').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.newCylinder).to.be.false
        })
    })

    // it('The Cash Deposit functionality', () => {
    //     cy.intercept('POST', '**/clear_all_cart_items*', {
    //         statusCode: 200,
    //         body: { success: true }
    //     }).as('deleteCart')

    //     cy.mount(NewCylinder).then(() => {
    //         const userStore = useUserStore()
    //         userStore.user = { id: 'usr-123' }

    //         const uiStore = useUiStore()
    //         uiStore.newCylinder = true
    //     })

    //     cy.contains('button', 'Clear Cart').click()
    //     // cy.contains('.v-btn', 'Clear Cart').click({ force: true })

    //     cy.wait('@deleteCart').then(() => {
    //         const uiStore = useUiStore()

    //         expect(uiStore.newCylinder).to.be.false
    //     })
    // })
})