import ClearCart from '@/components/Prompts/ClearCart.vue'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

describe('<ClearCart />', () => {
    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Default dialog', () => {
        cy.mount(ClearCart).then(() => {
            const uiStore = useUiStore()
            uiStore.clearCartDialog = true

            uiStore.clearTitle = 'Clear Cart Items'
            uiStore.clearPrompt = 'Are you sure you want to clear cart?'
        })

        cy.contains('Clear Cart Items').should('be.visible')
        cy.contains('Are you sure you want to clear cart?').should('be.visible')
        cy.contains('Checkout Cart').should('be.visible')
        cy.contains('Clear Cart').should('be.visible')
    })

    it('Close dialog', () => {
        cy.mount(ClearCart).then(() => {
            const uiStore = useUiStore()
            uiStore.clearCartDialog = true
        })

        cy.get('.mdi-close').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.clearCartDialog).to.be.false
        })
    })

    it('The Checkout Cart button functionality', () => {
        cy.mount(ClearCart).then(() => {
            const uiStore = useUiStore()
            uiStore.clearCartDialog = true
        })

        cy.contains('Checkout Cart').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.clearCartDialog).to.be.false
        })
    })

    // it('The Clear Cart button functionality', () => {
    //     cy.intercept('DELETE', '**/clear_all_cart_items*', {
    //         statusCode: 200,
    //         body: { success: true }
    //     }).as('deleteCart')

    //     cy.mount(ClearCart).then(() => {
    //         const userStore = useUserStore()
    //         userStore.user = { id: 'usr-123' }

    //         const uiStore = useUiStore()
    //         uiStore.clearCartDialog = true
    //     })

    //     cy.contains('button', 'Clear Cart').click()
    //     // cy.contains('.v-btn', 'Clear Cart').click({ force: true })

    //     cy.wait('@deleteCart').then(() => {
    //         const uiStore = useUiStore()
    //         expect(uiStore.notifyDialog).to.be.true
    //         expect(uiStore.notifyMessage).to.be.equal('Cleared cart successfully.')

    //         expect(uiStore.clearCartDialog).to.be.false
    //     })
    // })
})