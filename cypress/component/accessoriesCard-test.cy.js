import AccessoriesCard from '@/components/Products/AccessoriesCard.vue'
import { useLocationStore } from '@/stores/location'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'

describe('<AccessoriesCard />', () => {

  const mockAccessory = {
    id: 'acc-1',
    style_name: 'Gas Regulator',
    style_description: 'High pressure safety regulator',
    thumbnail_image: '/assets/accessories.png',
    total_cost: 85
  }

  it('Test for displaying product information', () => {
    cy.mount(AccessoriesCard, {
      props: {
        product: mockAccessory,
        index: 0,
      }
    })

    cy.contains('Gas Regulator').should('be.visible')
    cy.contains('GHS 85').should('be.visible')
  })

  it('Test for decrement and increment actions', () => {
    cy.mount(AccessoriesCard, {
      props: {
        product: mockAccessory,
        index: 0,
      }
    })

    cy.contains('1').should('be.visible')

    cy.get('.mdi-plus').click()
    cy.contains('2').should('be.visible')

    cy.get('.mdi-minus').click()
    cy.contains('1').should('be.visible')
  })

  it('Test for disabled select when location address is empty', () => {

    cy.mount(AccessoriesCard, {
      props: {
        product: mockAccessory,
        index: 0,
      }
    }).then(() => {
        const locationStore = useLocationStore()
        locationStore.userAddress = []
    })

    cy.contains('button', 'Select').should('be.disabled')
  })

  it('Test for the add to cart button function', () => {
    // cy.intercept('POST', '**/order/customers/**/carts*', {
    //     statusCode: 200,
    //     body: { success: true }
    // }).as('addToCart')

    // cy.intercept('GET', '**/order/customers/**/carts*', {
    //     statusCode: 200,
    //     body: { items: [] }
    // }).as('getCart')

    cy.mount(AccessoriesCard, {
      props: {
        product: mockAccessory,
        index: 0,
      }
    }).then(() => {
        const userStore = useUserStore()
        userStore.user = { id: 'usr-100' }

        const orderStore = useOrderStore()
        orderStore.accessories = [{ id: 'odr-type-acc' }]

        const locationStore = useLocationStore()
        locationStore.userAddress = [{
            id: 'addr-1',
            name: 'Home'
        }]
    })

    cy.get('.mdi-plus').click().click()
    cy.contains('3').should('be.visible')

    cy.contains('button', 'Select').should('not.be.disabled')
    cy.contains('button', 'Select').click()

    // cy.wait('@addToCart').its('request.body').should('deep.include', {
    //     product_style_id: 'acc-1',
    //     quantity: 3,
    //     cart_type: 'product'
    // })
  })
})