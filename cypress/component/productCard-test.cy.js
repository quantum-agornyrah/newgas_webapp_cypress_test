import ProductCard from '@/components/Products/ProductCard.vue'
import { useLocationStore } from '@/stores/location'
import { useDepositStore } from '@/stores/deposit'
import { useUiStore } from '@/stores/ui'

describe('<ProductCard />', () => {

  const mockProduct = {
    id: 'prod-1',
    style_name: '15kg Cylinder',
    style_description: 'Standard domestic cylinder',
    thumbnail_image: '/assets/cylinder.png',
    deposit: 100,
    gas_cost: 70,
    total_cost: 170
  }

  it('Test for displaying product information', () => {
    cy.mount(ProductCard, {
      props: {
        product: mockProduct,
        index: 0,
      }
    })

    cy.contains('15kg Cylinder').should('be.visible')
    cy.contains('Gas cost: GHS 70').should('be.visible')
    cy.contains('Deposit cost: GHS 100').should('be.visible')
    cy.contains('GHS 170').should('be.visible')
  })

  it('Test for disabled select when location address is empty', () => {

    cy.mount(ProductCard, {
      props: {
        product: mockProduct,
        index: 0,
      }
    }).then(() => {
        const locationStore = useLocationStore()
        locationStore.userAddress = []
    })

    cy.contains('button', 'Select').should('be.disabled')
  })

  it('Test for the select button function', () => {

    cy.mount(ProductCard, {
      props: {
        product: mockProduct,
        index: 0,
      }
    }).then(() => {
        const locationStore = useLocationStore()
        locationStore.userAddress = [{
            id: 'addr-1',
            name: 'Home'
        }]
    })

    cy.contains('button', 'Select').should('not.be.disabled')

    cy.contains('button', 'Select').click().then(() => {
        const uiStore = useUiStore()
        const depositStore = useDepositStore()

        expect(depositStore.depositFromProducts).to.deep.equal(mockProduct)
        expect(uiStore.newCylinder).to.be.true
    })
  })
})