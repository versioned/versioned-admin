import u from './util'

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

const TITLE_FIELD = {
  name: 'Title',
  type: 'string'
}

function jsonEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function navigateHome () {
  cy.get('a.navbar-brand').click()
  cy.location('href').should('match', /#\/$/)
}

function clickNewModel () {
  navigateHome()
  cy.get('.new-model').click()
  cy.location('href').should('match', /#\/models\/new$/)
}

function waitForSave () {
  cy.get('.alert-success').contains('Saved')
}

function saveModelsForm () {
  cy.get('form.models-form input[type="submit"]').last().click({force: true})
  waitForSave()
}

function verifyModelCreated (model) {
  navigateHome()
  const fields = u.concat(model.fields, model.expectedFields)

  const scope = `tr.models-row.${model.coll}`
  const expectedFields = fields.filter(f => f.relationship === undefined).map(f => f.name)
  cy.get(`${scope} td.fields`).should('contain', expectedFields.join(', '))
  const expectedRelationships = fields.filter(f => f.relationship !== undefined).map(f => f.name)
  cy.get(`${scope} td.relationships`).should('contain', expectedRelationships.join(', '))

  // NOTE/FIXME: Cypress seems to think the link is not visible so need to use force here, see:
  // https://docs.cypress.io/guides/references/error-messages.html#cy-failed-because-the-element-cannot-be-interacted-with
  cy.get(`${scope} td a.models-edit`).click({force: true})
  cy.location('href').should('match', /#\/models\/[^\/]+\/edit/)
  cy.get(`form.models-form input#name`).should('have.value', model.name)
  cy.get(`form.models-form input#coll`).should('have.value', model.coll)

  fields.forEach((field, index) => {
    const scope = `div.form-group.field-${index + 1}`
    cy.get(`${scope} a.expand-field`).click()
    cy.get(`${scope} input.field-name`).should('have.value', field.name)
    cy.get(`${scope} input.field-key`).should('have.value', field.key)
    if (field.category === 'two-way-relationship') {
      cy.get(`${scope} input.two-way-relationship`).should('be.checked')
    } else if (field.category === 'one-way-relationship') {
      cy.get(`${scope} input.one-way-relationship`).should('be.checked')
    } else {
      cy.get(`${scope} select.data-type option[value="${field.type}"]`).should('be.selected')
    }
    if (field.relationship) {
      cy.get(`${scope} input.to-type`).should('have.value', field.relationship.toType)
      cy.get(`${scope} input.to-field`).should('have.value', field.relationship.toField)
      cy.get(`${scope} input.${field.relationship.type}`).should('be.checked')
    }
  })
}

function addModelField (field, index) {
  cy.get('.add-field').click({force: true})
  const scope = `.field-${index + 2}`
  cy.get(`${scope} input.field-name`).type(field.name, {force: true})
  if (field.category === 'data') {
    cy.get(`${scope} select.data-type`).select(field.type, {force: true})
  } else {
    cy.get(`${scope} input.${field.category}`).click({force: true})
  }
  if (field.relationship) {
    const {type, toType, toField} = field.relationship
    if (toType) cy.get(`${scope} input.to-type`).clear({force: true}).type(toType, {force: true})
    if (toField) cy.get(`${scope} input.to-field`).clear({force: true}).type(toField, {force: true})
    cy.get(`${scope} input.${type}`).click({force: true})
  }
}

function createModel (model) {
  clickNewModel()
  cy.get('form input#name').type(model.name)
  const fields = model.fields || []
  if (fields[0] && !jsonEqual(fields[0], TITLE_FIELD)) {
    cy.get(`.field-1 a.expand-field`).click()
    cy.get(`.field-1 input.field-name`).clear({force: true}).type(fields[0].name, {force: true})
    cy.get(`.field-1 select.data-type`).select(fields[0].type, {force: true})
  }
  fields.slice(1).forEach(addModelField)
  saveModelsForm()
  verifyModelCreated(model)
}

function register (email, password, accountName) {
  cy.visit('/')
  cy.location('href').should('match', /#\/login$/)

  cy.get('#register-link').click()
  cy.location('href').should('match', /#\/register$/)

  cy.get('form input#email').type(email)
  cy.get('form input#password').type(password)
  cy.get('form input#accountName').type(accountName)
  cy.get('form.register-form').submit()
  cy.location('href').should('match', /#\/$/)
}

function login (email, password) {
  cy.visit('/#/login')
  cy.get('form input#email').type(email)
  cy.get('form input#password').type(password)
  cy.get('form.login-form').submit()
  cy.location('href').should('match', /#\/$/)
}

const commands = [
  register,
  login,
  waitForSave,
  navigateHome,
  createModel
]
for (let command of commands) {
  Cypress.Commands.add(command.name, command)
}
