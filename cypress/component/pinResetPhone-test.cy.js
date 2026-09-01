import PhoneNumber from '@/components/PinReset/PhoneNumber.vue'

describe('<PhoneNumber />', () => {

    beforeEach(() => {
        cy.viewport(1260, 1000)
    })

    it('Validate Phone Number', () => {
        cy.mount(PhoneNumber)

        cy.contains('Enter your phone number to complete your phone number verification').should('be.visible')
        cy.get('input[placeholder="Eg. 024xxxxxxx"]').clear().type('6373393')
        cy.contains('Must be a valid phone number').should('be.visible')
        cy.contains('button', 'Verify').should('be.disabled')

        cy.get('input[placeholder="Eg. 024xxxxxxx"]').clear().type('0243221897')
        cy.contains('button', 'Verify').should('not.be.disabled')
    })

    it('Verify Phone Number', () => {
        const onIncrease = cy.spy().as('increaseEmit')

        cy.intercept('GET', '**/send_otp*purpose=forgot_pin*', {
        statusCode: 200,
        body: { success: true }
        }).as('sendOTP')

        cy.mount(PhoneNumber, {
            onIncrease
        })

        cy.contains('Enter your phone number to complete your phone number verification').should('be.visible')
        cy.get('input[placeholder="Eg. 024xxxxxxx"]').clear().type('0243221897')

        cy.contains('button', 'Verify').click()

        // cy.wait('@sendOTP').then(() => {
        //     cy.get('@increseEmit').should('have.been.calledOnce')
        // })
    })
})