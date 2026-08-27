import AddProduct from '@/components/Prompts/AddProduct.vue'
import { useUiStore } from '@/stores/ui'

describe('<AddProduct />', () => {
    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Default dialog', () => {
        cy.mount(AddProduct).then(() => {
            const uiStore = useUiStore()
            uiStore.addProduct = true
        })

        cy.contains('Add Product').should('be.visible')
        cy.contains('Choose from the option below to process your order.').should('be.visible')
        cy.contains('Refill Cylinder').should('be.visible')
        cy.contains('Products & Accessories').should('be.visible')
    })

    it('Close dialog', () => {
        cy.mount(AddProduct).then(() => {
            const uiStore = useUiStore()
            uiStore.addProduct = true
        })

        cy.get('.mdi-close').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.addProduct).to.be.false
        })
    })

    it('The Refill button functionality', () => {
        cy.mount(AddProduct).then(() => {
            const uiStore = useUiStore()
            uiStore.addProduct = true
        })

        cy.contains('Refill Cylinder').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.addProduct).to.be.false
        })
    })

    it('The Products & Accessories button functionality', () => {

        cy.mount(AddProduct).then(() => {
            const uiStore = useUiStore()
            uiStore.addProduct = true
        })

        cy.contains('Products & Accessories').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.addProduct).to.be.false
        })
    })
})