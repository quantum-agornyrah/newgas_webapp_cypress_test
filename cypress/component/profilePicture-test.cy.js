import ProfilePicture from '@/components/Profile/ProfilePicture.vue'
import { useProfileStore } from '@/stores/profile'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

describe('<ProfilePicture />', () => {

  it('Display Default Profile dialog', () => {
    cy.mount(ProfilePicture).then(() => {
        const profileStore = useProfileStore()

        profileStore.profilePic = true
        profileStore.imageDataUrl = null
    })

    cy.contains('Profile Picture').should('be.visible')
    cy.contains('Upload Picture').should('be.visible')
    cy.contains('Cancel').should('be.visible')
  })

  it('Display Profile dialog with profile picture', () => {
    cy.mount(ProfilePicture).then(() => {
        const profileStore = useProfileStore()
        profileStore.profilePic = true
        profileStore.imageDataUrl = true

        const userStore = useUserStore()
        userStore.user = {
          id: 'usr-001',
          profile_pic: 'https://example.com/avatar.jpg'
        }
    })

    cy.contains('Change Picture').should('be.visible')
    cy.contains('Remove Picture').should('be.visible')
    cy.contains('Submit').should('be.visible')
  })

  it('Test for remove picture button dialog functionality', () => {
    cy.mount(ProfilePicture).then(() => {
        const profileStore = useProfileStore()
        profileStore.profilePic = true
        profileStore.imageDataUrl = true

        const userStore = useUserStore()
        userStore.user = {
          id: 'usr-001',
          profile_pic: 'https://example.com/avatar.jpg'
        }
    })

    cy.contains('Remove Picture').click().then(() => {
      const uiStore = useUiStore()
      expect(uiStore.actionDialog).to.be.true
      expect(uiStore.actionTitle).to.be.equal('Remove Profile Picture')
    })
  })
})