// Custom Login Command
Cypress.Commands.add('login', ( user = { id: '001', first_name: 'Cypress' }) => {

    cy.on('window:before:load', (win) => {
        win.sessionStorage.setItem('session', 'fake-jwt-access-token');
        win.sessionStorage.setItem('user-refresh', 'fake-jwt-refresh-token')
        win.sessionStorage.setItem('user', JSON.stringify(user))
        win.localStorage.setItem('user', user.id)
    })
})