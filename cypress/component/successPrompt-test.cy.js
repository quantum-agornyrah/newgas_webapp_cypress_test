import Success from '@/components/Prompts/Success.vue'
import { useUiStore } from '@/stores/ui'

describe('<Success />', () => {
    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Display Default Success dialog', () => {
        cy.mount(Success).then(() => {
            const uiStore = useUiStore()
            uiStore.notifyDialog = true

            uiStore.success = true
            uiStore.notifyTitle = 'Opearation Succeeded'
            uiStore.notifyMessage = 'Congatulations, operation fell through'
        })

        cy.contains('Ok').should('be.visible')
        cy.contains('Cylinder Deposit').should('be.visible')
    })

    it('Display Default Failed dialog', () => {
        cy.mount(Success).then(() => {
            const uiStore = useUiStore()
            uiStore.notifyDialog = true

            uiStore.success = false
            uiStore.notifyTitle = 'Opearation Failed'
            uiStore.notifyMessage = 'Oops, operation DID fall through'
        })

        cy.contains('Ok').should('be.visible')
        cy.contains('Cylinder Deposit').should('be.visible')
    })


    it('Close dialog', () => {
        cy.mount(Success).then(() => {
            const uiStore = useUiStore()
            uiStore.notifyDialog = true
        })

        cy.get('.mdi-close').click().then(() => {
            const uiStore = useUiStore()
            expect(uiStore.notifyDialog).to.be.false
        })
    })
})