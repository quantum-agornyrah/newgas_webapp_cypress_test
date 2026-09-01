import GpsLocation from '@/components/Profile/GpsLocation.vue'
import { useUserStore } from '@/stores/user'
import { useLocationStore } from '@/stores/location'
import LocationCard from '@/components/Location/LocationCard.vue'

describe('<GpsLocation />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Empty State when no location exists', () => {
        cy.mount(GpsLocation).then(() => {
          const userStore = useUserStore()
          userStore.user = { id: 'usr-123' }

          const locationStore = useLocationStore()
          locationStore.userAddress = [ ]
        })

        cy.contains('No address has been added yet').should('be.visible')
    })

    it('Display Default Address Section', () => {
        cy.mount(GpsLocation, {
          global: {
            components: { LocationCard }
          }
        }).then(() => {
          const userStore = useUserStore()
          userStore.user = { id: 'usr-123' }
          
          const locationStore = useLocationStore()
          locationStore.userAddress = [
            {
              id: 'addr-1',
              name: 'Home',
              phone: '0200738155',
              is_default: true,
              ghana_post_address: {
                address_code: 'GA-183-8164',
                area: 'Airport Residential',
                region: 'Greater Accra',
                district: 'Accra Metropolitan'
              }
            }
          ]
        })

        cy.contains('button', 'Add Address').should('be.visible')
        cy.contains('Home').should('be.visible')
        cy.contains('Greater Accra').should('be.visible')
    })

    it('Add address button button Functionality', () => {

      const mockGPSdata = {
        id: 'gps-001',
        address_code: 'GA-183-8164',
        street: 'Main St',
        post_code: '00233',
        region: 'Greater Accra',
        district: 'Accra Metropolitan',
        area: 'Airport Residential Area',
        latitude: '5.6037',
        longitude: '-0.1870'
      }

      cy.intercept('GET', '**/location/ghana_post_address/search/address*', {
        statusCode: 200,
        body: mockGPSdata
      }).as('getGPS')

        cy.mount(GpsLocation, {
          global: {
            components: { LocationCard }
          }
        }).then(() => {
          const userStore = useUserStore()
          userStore.user = { id: 'usr-123' }
          
          const locationStore = useLocationStore()
          locationStore.userAddress = [ ]
        })

        cy.contains('Add Address').should('be.visible')
        cy.contains('button', 'Add Address').click()

        cy.contains('Enter delivery location’s details').should('be.visible')
        cy.get('input[type="text"]').clear().type('GA-183-8164')
        cy.contains('button', 'Submit').click()

        // cy.wait('@getGPS').then(() => {
        //   cy.contains('Main St').scrollIntoView().should('be.visible')
        //   cy.contains('Greater Accra').should('be.visible')
        //   cy.contains('Universal Address').parent().should('contain.text', 'GA-183-8164')
        // })
    })
})