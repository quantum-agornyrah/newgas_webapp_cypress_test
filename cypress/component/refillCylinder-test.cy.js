import RefillCylinder from '@/components/Deposits/RefillCylinder.vue'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'

describe('<RefillCylinder />', () => {

    const mockCylinder = {
        id: 'prod-101',
        style_name: '12kg Cylinder',
        gas_cost: 150,
        customer_deposit_token_id: 'token-123',
        images: [{ image_url: '/cylinder.png' }]
    }

    const mockRefill = [{ id: 'refill-type-1' }]

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Product Information', () => {
        cy.mount(RefillCylinder, {
            props: {
                product: mockCylinder,
                index: 0,
                selectedAddress: 'addr-1',
                refill: mockRefill,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('12kg Cylinder').should('be.visible')
        cy.contains('Gas cost: GHS 150').should('be.visible')
        cy.contains('button', 'Refill').should('be.visible')
    })

    it('Check Cart Status', () => {
        cy.mount(RefillCylinder, {
            props: {
                product: {...mockCylinder, deposit_token_in_cart: true},
                index: 0,
                selectedAddress: 'addr-1',
                refill: mockRefill,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('12kg Cylinder').should('be.visible')
        cy.contains('Gas cost: GHS 150').should('be.visible')
        cy.contains('button', 'Refill Cylinder in cart').should('be.disabled')
    })

    it('Refill button functionality', () => {
        cy.intercept('POST', '**/order/customers/:id/carts', {
          statusCode: 200,
          body: { success: true }
        }).as('refillCylinder')

        cy.mount(RefillCylinder, {
            props: {
                product: mockCylinder,
                index: 0,
                selectedAddress: 'addr-1',
                refill: mockRefill,
            }
        }).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123' }
        })

        cy.contains('button', 'Refill').should('not.be.disabled').click()

        // cy.wait('@refillCylinder').then(() => {
        //     const uiStore = useUiStore()

        //     expect(uiStore.notifyDialog).to.be.true
        //     expect(uiStore.notifyMessage).to.equal('Refill of your 12kg Cylinder cylinder has been added to your cart')
        // })
    })
})