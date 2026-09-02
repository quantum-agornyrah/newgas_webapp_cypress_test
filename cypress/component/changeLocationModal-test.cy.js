import ChangeLocation from '@/components/Location/ChangeLocation.vue'
import { useProductStore } from '@/stores/product'
import { useUiStore } from '@/stores/ui'

describe('<ChangeLocation />', () => {

    const mockAddresses = [
        {
            id: 'addr-101',
            is_default: true,
            ghana_post_address: { 
                street: 'Main St', 
                address_code: 'GA-100-200' 
            }
        },
        {
            id: 'addr-102',
            is_default: false,
            ghana_post_address: { 
                street: 'Airport Rd', 
                address_code: 'GA-300-400' 
            }
        }
    ]

  it('Display Location', () => {
    cy.mount(ChangeLocation).then(() => {
        const uiStore = useUiStore()
        uiStore.changeLocation = true

        const userStore = useUserStore()
        userStore.user = { id: 'usr-123' }

        const locationStore = useLocationStore()
        locationStore.userAddress = mockAddresses
    })

    cy.contains('Select Address').should('be.visible')
    cy.contains('From the provided locations below select an address for product delivery').should('be.visible')
    cy.contains('Main St - GA-100-200').should('be.visible')
    cy.contains('Airport Rd - GA-300-400').should('be.visible')
  })

  it('Update Location', () => {
    cy.intercept('PATCH', '**/location/customer/usr-123/address/*', {
        statusCode: 200,
        body: { success: true }
    }).as('chooseOption')

    cy.mount(ChangeLocation).then(() => {
        const uiStore = useUiStore()
        uiStore.changeLocation = true

        const userStore = useUserStore()
        userStore.user = { id: 'usr-123' }

        const locationStore = useLocationStore()
        locationStore.userAddress = mockAddresses
    })

    cy.contains('Main St - GA-100-200').click()
    cy.contains('button', 'Select').should('not.be.disabled').click()

    // cy.wait('@chooseOption').then(() => {
    //     const uiStore = useUiStore()
    //     expect(uiStore.changeLocation).to.be.false
    // })
  })
})