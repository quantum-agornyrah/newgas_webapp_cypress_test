import ProductsServices from '@/components/Products/ProductsServices.vue'
import { useProductStore } from '@/stores/product'

describe('<ProductsServices />', () => {

  it('Display tab buttons', () => {
    cy.mount(ProductsServices)

    cy.contains('Cylinders').should('be.visible')
    cy.contains('Accessories').should('be.visible')
    cy.contains('Select your preferred cylinder type and size').should('be.visible')
  })

  it('Switch to Acessories button', () => {
    cy.mount(ProductsServices)

    cy.contains('button', 'Accessories').click().then(() => {
        const productStore = useProductStore()
        expect(productStore.activeView).to.equal('accessories')
    })
  })
})