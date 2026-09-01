import ExchangeCylinder from '@/components/Deposits/ExchangeCylinder.vue'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'

describe('<ExchangeCylinder />', () => {

    const mockCylinder = {
        id: 'prod-101',
        name: '12kg Exchange Cylinder',
        images: [{ image_url: '/cylinder.png' }]
    }

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Product Information', () => {
        cy.mount(ExchangeCylinder, {
            props: {
                product: mockCylinder,
                index: 0,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }

            const depositStore = useDepositStore()
            depositStore.depositFromProducts = { id: 'dep-123', style_name: 'New Cylinder' }

            const orderStore = useOrderStore()
            orderStore.cylinderDeposit = { id: 'prod-101' }
        })

        cy.contains('12kg Exchange Cylinder').should('be.visible')
        cy.contains('Deposit').should('be.visible')
        cy.contains('button', 'Select').should('be.visible')
    })

    it('Select button functionality', () => {
        cy.intercept('POST', '**/order/customers/usr-123/carts*', {
            statusCode: 200,
            body: { success: true }
        }).as('exchangeCy')

        cy.mount(ExchangeCylinder, {
            props: {
                product: mockCylinder,
                index: 0,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }

            const depositStore = useDepositStore()
            depositStore.depositFromProducts = { id: 'dep-123', style_name: 'New Cylinder' }

            const orderStore = useOrderStore()
            orderStore.cylinderDeposit = { id: 'prod-101' }
        })

        cy.contains('button', 'Select').click()

        // cy.get('@exchangeCy').then(() => {
        //     const uiStore = useUiStore()

        //     expect(uiStore.notifyDialog).to.be.true
        //     expect(uiStore.notifyMessage).to.include('Added New Cylinder to cart')
        // })
    })
})