import OrderInfo from '@/components/Orders/OrderInfo.vue'
import { useLocationStore } from '@/stores/location'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

describe('<OrderInfo />', () => {

    const mockCart = [
        {
            id: 'cart-1',
            style_name: '12kg Cylinder',
            gas_cost: 150,
            deposit_cost: 0,
            quantity: 1,
            payable_amount: 150,
            orderTypeName: 'refill'
        },
        {
            id: 'cart-2',
            style_name: 'Cylinder Casing',
            gas_cost: 70,
            deposit_cost: 0,
            quantity: 1,
            payable_amount: 70,
            orderTypeName: 'new'
        },
    ]

    const mockAddress = [
        { 
            id: 'addr-1', 
            is_default: true, 
            ghana_post_address: { 
                street: 'Main St', 
                address_code: 'GA-100' 
            } 
        }
    ]

  it('Display Order Summary', () => {
    cy.mount(OrderInfo).then(() => {
        const locationStore = useLocationStore()
        locationStore.userAddress = mockAddress

        const userStore = useUserStore()
        userStore.user = { id: 'usr-123', phone: '0200753144' }

        const cartStore = useCartStore()
        cartStore.cartLoader = false 
        cartStore.orderTypes = mockCart
    })

    cy.contains('Order Details').should('be.visible')
    cy.contains('Product Details').should('be.visible')
    cy.contains('12kg Cylinder').should('be.visible')
    cy.contains('GHS 150').should('be.visible')

    cy.contains('Cylinder Casing').should('be.visible')
    cy.contains('GHS 70').should('be.visible')
  })

  it('Empty Cart', () => {
    cy.mount(OrderInfo).then(() => {
        const locationStore = useLocationStore()
        locationStore.userAddress = mockAddress

        const userStore = useUserStore()
        userStore.user = { id: 'usr-123', phone: '0200753144' }

        const cartStore = useCartStore()
        cartStore.cartLoader = false 
        cartStore.orderTypes = []
    })

    cy.contains('Order Details').should('be.visible')
    cy.contains('Your Cart is empty').should('be.visible')
  })
})