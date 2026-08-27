import Action from '@/components/Prompts/Action.vue'
import { useUiStore } from '@/stores/ui'

describe('<Action />', () => {

  it('Display Default dialog', () => {
    cy.mount(Action, {
      props: {
        action: () => {},
      }
    }).then(() => {
      const uiStore = useUiStore()
      uiStore.actionDialog = true
      uiStore.actionTitle = 'Delete Address'
      uiStore.actionPrompt = 'Are you sure you want to perform this action?'
    })

    cy.contains('button', 'No, Keep').should('be.visible')
    cy.contains('button', 'Yes, Remove').should('be.visible')
    cy.contains('Delete Address').should('be.visible')
  })

  it('Test for No, Keep button dialog functionality', () => {
    cy.mount(Action, {
      props: {
        action: () => {},
      }
    }).then(() => {
      const uiStore = useUiStore()
      uiStore.actionDialog = true
      uiStore.actionTitle = 'Delete Address'
      uiStore.actionPrompt = 'Are you sure you want to perform this action?'
    })

    cy.contains('No, Keep').click().then(() => {
      const uiStore = useUiStore()
      expect(uiStore.actionDialog).to.be.false
    })
  })

  it('Test for Yes, Remove button dialog functionality', () => {
    const onRemove = cy.spy().as('confirmRemove')

    cy.mount(Action, {
      props: {
        action: onRemove,
      }
    }).then(() => {
      const uiStore = useUiStore()
      uiStore.actionDialog = true
      uiStore.actionTitle = 'Delete Address'
      uiStore.actionPrompt = 'Are you sure you want to perform this action?'
    })

    cy.contains('button', 'Yes, Remove').click()
    cy.get('@confirmRemove').should('have.been.calledOnce')
  })
})