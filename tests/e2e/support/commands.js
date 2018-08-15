// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('register', (email, password, accountName) => {
  cy.visit('/')
  cy.location('href').should('match', /#\/login$/)

  cy.get('#register-link').click()
  cy.location('href').should('match', /#\/register$/)

  cy.get('form input#email').type(email)
  cy.get('form input#password').type(password)
  cy.get('form input#accountName').type(accountName)
  cy.get('form.register-form').submit()
  cy.location('href').should('match', /#\/$/)
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/#/login')
  cy.get('form input#email').type(email)
  cy.get('form input#password').type(password)
  cy.get('form.login-form').submit()
  cy.location('href').should('match', /#\/$/)
})
