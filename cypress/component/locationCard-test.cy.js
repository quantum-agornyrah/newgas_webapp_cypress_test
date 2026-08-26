import LocationCard from '@/components/Location/LocationCard.vue'

describe('<LocationCard />', () => {

  const mockItem = {
    id: 'addr-1',
    name: 'Office',
    phone: '0200738155',
    is_default: true,
    ghana_post_address: {
      address_code: 'GA-183-8164',
      area: 'Airport Residential',
      region: 'Greater Accra',
      district: 'Accra Metropolitan'
    }
  }

  it('Test for default address badge', () => {
    cy.mount(LocationCard, {
      props: {
        item: mockItem,
        deletePrompt: () => {}
      }
    })

    cy.contains('Default location').should('be.visible')
    cy.contains('Office').should('be.visible')
    cy.contains('GA-183-8164, Airport Residential').should('be.visible')
  })

  it('Test for set default location button rendering', () => {
    cy.mount(LocationCard, {
      props: {
        item: { ...mockItem, is_default: false },
        deletePrompt: () => {}
      }
    })

    cy.contains('Default location').should('not.exist')
    cy.contains('button', 'Set default location').should('be.visible')
  })

  it('Test for the remove button function', () => {
    const onRemove = cy.spy().as('removeAddress')

    cy.mount(LocationCard, {
      props: {
        item: mockItem,
        deletePrompt: onRemove
      }
    })

    cy.contains('button', 'Remove').click()
    cy.get('@removeAddress').should('have.been.calledWith', mockItem)
  })
})