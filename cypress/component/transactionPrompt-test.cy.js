import Transaction from '@/components/Prompts/Transaction.vue'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

describe('<Transaction />', () => {

  const mockOrder = {
    order_details: { id: 'ord-101' }
  }

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Step 1: Display Default Transaction dialog', () => {
        cy.mount(Transaction, {
            props: {
                order: mockOrder,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }

            const uiStore = useUiStore()
            uiStore.transactionDialog = true
            uiStore.transTitle = 'Transaction Cancel'
            uiStore.transError = 'Are you certain to cancel?'
        })

        cy.contains('No, Continue').should('be.visible')
        cy.contains('Yes, Cancel').should('be.visible')
        cy.contains('Transaction Cancel').should('be.visible')
        cy.contains('Are you certain to cancel?').should('be.visible')
    })

    it('Step 2: Display Transaction Reason dialog', () => {
        cy.mount(Transaction, {
            props: {
                order: mockOrder,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
            
            const uiStore = useUiStore()
            uiStore.transactionDialog = true
            uiStore.transTitle = 'Transaction Cancel'
        })

        cy.contains('Yes, Cancel').click()

        cy.contains('Are you sure you want to cancel this order? Choose a reason for order cancellation').should('be.visible')
        cy.contains('Changed my mind').should('be.visible')
    })

    it('Step 2: Display Transaction Reason dialog & enable submit button', () => {
        cy.mount(Transaction, {
            props: {
                order: mockOrder,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
            
            const uiStore = useUiStore()
            uiStore.transactionDialog = true
            uiStore.transTitle = 'Transaction Cancel'
        })

        cy.contains('Yes, Cancel').click()
        cy.contains('Yes, Remove').should('be.disabled')

        cy.contains('Changed my mind').click()
        cy.contains('Yes, Remove').should('not.be.disabled')
    })

    it('Step 3: Display Transaction Success dialog', () => {
        cy.intercept('PATCH', '**/cancel_order*', {
            statusCode: 200,
            body: { success: true }
        }).as('cancelTransaction')

        cy.mount(Transaction, {
            props: {
                order: mockOrder,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
            
            const uiStore = useUiStore()
            uiStore.transactionDialog = true
            uiStore.transTitle = 'Transaction Process'
        })

        cy.contains('Yes, Cancel').click()

        cy.contains('Changed my mind').click()
        cy.contains('Yes, Remove').should('not.be.disabled')

        // cy.contains('Yes, Remove').click()
        // cy.wait('@cancelTransaction').then(() => {
        //     cy.contains('Your order has been cancelled successfully').should('be.visible')
        // })
        
    })
})