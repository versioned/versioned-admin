// https://docs.cypress.io/api/introduction/api.html

describe('Login', () => {
  it('Can log in', () => {
    cy.visit('/')
    // cy.request()
    // https://docs.cypress.io/api/commands/request.html#URL
    // https://github.com/cypress-io/cypress-example-kitchensink
    // cy.location('href').then(href => {
    //   console.log('pm debug href', href)
    // })

    cy.location('href').should('match', /#\/login$/)
    // cy.location('pathname').should('eq', '#/login')
    // cy.contains('h1', 'Welcome to Your Vue.js App')
  })
})
