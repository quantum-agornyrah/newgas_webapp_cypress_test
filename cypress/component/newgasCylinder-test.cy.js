import NewgasCylinder from '@/components/Deposits/NewgasCylinder.vue'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'

describe('<NewgasCylinder />', () => {

    const mockCylinder = {
        id: 'prod-101',
        name: '12kg Newgas Cylinder',
        description: 'Brand new Newgas customized cylinder',
        product_deposit_rate: { payable_amount: 200 },
        product_cost: { cost: 150 },
        images: [{ image_url: '/cylinder.png' }]
    }

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Product Information', () => {
        cy.mount(NewgasCylinder, {
            props: {
                product: mockCylinder,
                index: 0,
            }
        })

        cy.contains('12kg Newgas Cylinder').should('be.visible')
        cy.contains('Deposit cost: GHS 200').should('be.visible')
        cy.contains('Gas cost: GHS 150').should('be.visible')
        cy.contains('GHS 350').should('be.visible')
        cy.contains('button', 'Select').should('be.visible')
    })

    it('Select button functionality', () => {
        cy.mount(NewgasCylinder, {
            props: {
                product: mockCylinder,
                index: 0,
            }
        })

        cy.contains('button', 'Select').click().then(() => {
            const uiStore = useUiStore()

            expect(uiStore.addMore).to.be.true
            expect(uiStore.orderDetails).to.deep.equal(mockCylinder)
        })
    })
})