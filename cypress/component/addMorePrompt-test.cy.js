import AddMore from '@/components/Prompts/AddMore.vue'
import { useUiStore } from '@/stores/ui'

describe('<AddMore />', () => {
    beforeEach(() => {
        cy.viewport(1260, 950)
    })

    it('Display Default dialog', () => {
        cy.mount(AddMore).then(() => {
            const uiStore = useUiStore()
            uiStore.addMore = true
        })

        cy.contains('Continue Adding').should('be.visible')
        cy.contains('Proceed to Checkout').should('be.visible')
    })

    it('Close dialog', () => {
        cy.mount(AddMore).then(() => {
            const uiStore = useUiStore()
            uiStore.addMore = true
        })

        cy.get('.mdi-close').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.addMore).to.be.false
        })
    })

    // it('The Continue Adding functionality', () => {
    //     cy.intercept('POST', '**/order/customers/usr-123/carts*', {
    //         statusCode: 200,
    //         body: { success: true }
    //     }).as('addCartItems')

    //     cy.mount(AddMore).then(() => {
    //         const userStore = useUserStore()
    //         userStore.user = { id: 'usr-123' }

    //         const orderStore = useOrderStore()
    //         orderStore.orderType = [{ id: 'type-1' }]

    //         const uiStore = useUiStore()
    //         uiStore.addMore = true
    //         uiStore.orderDetails = { id: 'prod-001', customer_deposit_token_id: 'token-1' }
    //     })

    //     cy.contains('Continue Adding').click()
    //     cy.wait('@addCartItems').then(() => {
    //         const uiStore = useUiStore
    //         expect(uiStore.addMore).to.be.false
    //         expect(uiStore.addProduct).to.be.true
    //     })
    // })

    // it('The Checkout functionality', () => {
    //     cy.intercept('POST', '**/order/customers/usr-123/carts*', {
    //         statusCode: 200,
    //         body: { success: true }
    //     }).as('checkOut')

    //     cy.mount(AddMore).then(() => {
    //         const userStore = useUserStore()
    //         userStore.user = { id: 'usr-123' }

    //         const orderStore = useOrderStore()
    //         orderStore.orderType = [{ id: 'type-1' }]

    //         const uiStore = useUiStore()
    //         uiStore.addMore = true
    //         uiStore.orderDetails = { id: 'prod-001', customer_deposit_token_id: 'token-1' }
    //     })

    //     cy.contains('Proceed to Checkout').click()
    //     cy.wait('@checkOut').then(() => {
    //         const uiStore = useUiStore
    //         expect(uiStore.addMore).to.be.false
    //     })
    // })
})