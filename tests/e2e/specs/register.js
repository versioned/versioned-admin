// https://docs.cypress.io/api/introduction/api.html

import u from '../support/util'

const userId = u.uuid()
const user = {
  email: `${userId}@e2e-test.com`,
  password: userId
}
const accountName = `Company ${userId}`

describe('Register', () => {
  it('Visit homepage and get redirected to login page', () => {
    cy.visit('/')
    cy.location('href').should('match', /#\/login$/)
  })

  it('Click register link and submit register form', () => {
    cy.get('#register-link').click()
    cy.location('href').should('match', /#\/register$/)

    cy.get('form input#email').type(user.email)
    cy.get('form input#password').type(user.password)
    cy.get('form input#accountName').type(accountName)
    cy.get('form.register-form').submit()
    cy.location('href').should('match', /#\/$/)
  })

  it('Click logout link and log back in again', () => {
    cy.get('a.logout').click()
    cy.location('href').should('match', /#\/login$/)

    cy.get('form input#email').type(user.email)
    cy.get('form input#password').type(user.password)
    cy.get('form.login-form').submit()
    cy.location('href').should('match', /#\/$/)
  })

  it('Check email and company name in Navbar', () => {
    cy.get('.brand').should('contain', accountName)
    cy.get('.user-email').should('contain', user.email)
  })
})
