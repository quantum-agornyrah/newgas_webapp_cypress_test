import MainProfile from '@/components/Profile/MainProfile.vue'
import { useUserStore } from '@/stores/user'
import { useLocationStore } from '@/stores/location'
import { useProfileStore } from '@/stores/profile'

describe('<MainProfile />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Nvavigation Cards', () => {
        cy.mount(MainProfile).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123', first_name: 'Cypress', last_name: 'Tester' }

            const locationStore = useLocationStore()
            locationStore.userAddress = []

            const profileStore = useProfileStore()
            profileStore.selectedWindow = 'profile'
        })

        cy.contains('Address').should('be.visible')
        cy.contains('Profile').should('be.visible')
        cy.contains('GPS Location').should('be.visible')
        cy.contains('Email Address').should('be.visible')
        cy.contains('Change Phone Number').should('be.visible')
        cy.contains('Change Pin').should('be.visible')
    })

    it('Display Navigation Card Contents by switching to GPS Location View', () => {
        cy.mount(MainProfile).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123', first_name: 'Cypress', last_name: 'Tester' }

            const locationStore = useLocationStore()
            locationStore.userAddress = []
            
            const profileStore = useProfileStore()
            profileStore.selectedWindow = 'profile'
        })

        cy.contains('GPS Location').click().then(() => {
            const profileStore = useProfileStore()
            expect(profileStore.selectedWindow).to.equal('location')
        })
    })

    it('Display Navigation Card Contents by switching to Email View', () => {
        cy.mount(MainProfile).then(() => {
            const userStore = useUserStore()
            userStore.user = { id: 'usr-123', first_name: 'Cypress', last_name: 'Tester' }

            const locationStore = useLocationStore()
            locationStore.userAddress = []
            
            const profileStore = useProfileStore()
            profileStore.selectedWindow = 'profile'
        })

        cy.contains('Email Address').click().then(() => {
            const profileStore = useProfileStore()
            expect(profileStore.selectedWindow).to.equal('email')
        })
    })

    // it('Display Navigation Card Contents by switching to Change Phone View', () => {
    //     cy.mount(MainProfile).then(() => {
    //         const userStore = useUserStore()
    //         userStore.user = { id: 'usr-123', first_name: 'Cypress', last_name: 'Tester' }

    //         const locationStore = useLocationStore()
    //         locationStore.userAddress = []
            
    //         const profileStore = useProfileStore()
    //         profileStore.selectedWindow = 'profile'
    //     })

    //     cy.contains('Change Phone Number').click().then(() => {
    //         const profileStore = useProfileStore()
    //         expect(profileStore.selectedWindow).to.equal('changePhone')
    //     })
    // })

    // it('Display Navigation Card Contents by switching to Change Pin Section View', () => {
    //     cy.mount(MainProfile).then(() => {
    //         const userStore = useUserStore()
    //         userStore.user = { id: 'usr-123', first_name: 'Cypress', last_name: 'Tester' }

    //         const locationStore = useLocationStore()
    //         locationStore.userAddress = []
            
    //         const profileStore = useProfileStore()
    //         profileStore.selectedWindow = 'profile'
    //     })

    //     cy.contains('Change Pin').click().then(() => {
    //         const profileStore = useProfileStore()
    //         expect(profileStore.selectedWindow).to.equal('changePin')
    //     })
    // })
})