import u from './util'
import {truncated} from '../support/client_util'

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

function stringify (value) {
  const stringValue = (u.isArray(value) ? value.join(', ') : value)
  return truncated(stringValue)
}

function jsonEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function navigateHome () {
  cy.get('a.navbar-brand').click()
  // NOTE: the match on location triggers failures sometimes in headless mode, don't know why
  // cy.location('href').should('match', /#\/$/)
}

function clickNewModel () {
  navigateHome()
  cy.get('.new-model').click()
  cy.location('href').should('match', /#\/models\/new$/)
}

function waitForSave () {
  cy.get('.alert-success').contains('Saved')
}

function saveModelForm () {
  cy.get('form.models-form input[type="submit"]').last().click({force: true})
  waitForSave()
}

function navigateToAccount (user) {
  cy.get('.user-profile').click()
  cy.get('input#email').should('have.value', user.email)
  if (user.role === 'admin') {
    cy.get('.account-link.current-account').click()
  } else {
    cy.get('.account-link').should('not.exist')
  }
}

function navigateToModelEdit (model) {
  navigateHome()
  const scope = `tr.models-row.${model.coll}`
  cy.get(`${scope} td a.models-edit`).click({force: true})
  cy.location('href').should('match', /#\/models\/[^\/]+\/edit/)
  cy.get(`form.models-form input#name`).should('have.value', model.name)
  cy.get(`form.models-form input#coll`).should('have.value', model.coll)
}

function verifyModelCreated (model) {
  navigateHome()
  const fields = u.concat(model.fields, model.expectedFields)

  const scope = `tr.models-row.${model.coll}`
  const expectedFields = fields.filter(f => f.relationship === undefined).map(f => f.name)
  cy.get(`${scope} td.fields`).should('contain', expectedFields.join(', '))
  const expectedRelationships = fields.filter(f => f.relationship !== undefined).map(f => f.name)
  cy.get(`${scope} td.relationships`).should('contain', expectedRelationships.join(', '))

  navigateToModelEdit(model)

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
  if (field.required) {
    cy.get(`${scope} input.required`).click({force: true})
  }
}

function createModel (model, options = {}) {
  clickNewModel()
  cy.get('form input#name').type(model.name)
  const fields = model.fields || []
  if (fields[0] && !jsonEqual(fields[0], TITLE_FIELD)) {
    cy.get(`.field-1 a.expand-field`).click()
    cy.get(`.field-1 input.field-name`).clear({force: true}).type(fields[0].name, {force: true})
    cy.get(`.field-1 select.data-type`).select(fields[0].type, {force: true})
  }
  fields.slice(1).forEach(addModelField)
  saveModelForm()
  if (options.verify !== false) verifyModelCreated(model)
}

function clickNewData (model, options = {}) {
  cy.navigateHome()
  if (options.wait) cy.wait(options.wait) // NOTE: this should not be needed?
  cy.get(`tr.models-row.${model.coll} a.new-data`).click({force: true})
  cy.location('href').should('match', new RegExp(`#\/data\/${model.coll}\/new$`))
}

function saveDataForm (options = {}) {
  const className = options.publish ? 'save-and-publish' : 'save'
  cy.get(`form.data-form .${className}`).first().click()
  cy.waitForSave()
}

function createData (model, docs, options = {}) {
  docs.forEach((doc, index) => {
    console.log(`createData for model=${model.name} index=${index}`)
    clickNewData(model, options)
    model.fields.filter(field => doc[field.key]).forEach((field) => {
      const value = doc[field.key]
      const scope = `form.data-form .data-field-${field.key}`
      if (field.category === 'data' && ['string', 'text'].includes(field.type)) {
        // NOTE: needed force here, see: https://on.cypress.io/element-cannot-be-interacted-with
        cy.get(`${scope} .form-control`).type(value, {force: true, delay: 1})
      } else if (field.relationship) {
        u.array(value).forEach((item) => {
          cy.get(`${scope} input.search`).clear().type(item, {force: true, delay: 1})
          cy.get(`${scope} .menu .item`).first().click()
        })
      }
    })
    saveDataForm()
    const EDIT_URL_PATTERN = new RegExp(`/#/data/${model.coll}/([^/]+)/edit`)
    cy.location('href').should('match', EDIT_URL_PATTERN)
      .then((location) => {
        doc.id = location.match(EDIT_URL_PATTERN)[1]
      })
  })
}

function clickDataList (model) {
  cy.navigateHome()
  cy.get(`tr.models-row.${model.coll} a.data-list`).click({force: true})
  cy.location('href').should('match', new RegExp(`#\/data\/${model.coll}$`))
}

function navigateToDataEdit (model, doc) {
  clickDataList(model)
  cy.get(`tr.${model.coll}-${doc.id} a.edit-data`).click({force: true})
}

function verifyDocCreated (model, doc) {
  console.log(`verifyDocCreated for model=${model.name}`, doc)
  cy.clickDataList(model)
  const scope = `tr.${model.coll}-${doc.id}`
  Object.entries(doc).filter(([key, _]) => key !== 'id').forEach(([key, value]) => {
    cy.get(`${scope} .field-${key}`).contains(stringify(value))
  })
  cy.get(`${scope} a.edit-data`).click({force: true})
  model.fields.filter(f => doc[f.key]).forEach((field) => {
    const value = doc[field.key]
    const scope = `.data-field-${field.key}`
    if (field.category === 'data' && ['string', 'text'].includes(field.type)) {
      cy.get(`${scope} .form-control`).should('have.value', value)
    } else {
      u.array(value).forEach((item) => {
        cy.get(`${scope} .selected-results li`).should('contain', item)
      })
    }
  })
}

function verifyDataCreated (model, docs) {
  docs.forEach(doc => verifyDocCreated(model, doc))
}

function deleteDoc (model, doc) {
  navigateToDataEdit(model, doc)
  cy.get('.data-form a.delete').click()
  cy.location('href').should('match', new RegExp(`/data/${model.coll}$`))
  cy.get('.alert-success').contains('Deleted')
  cy.get(`tr.${model.coll}-${doc.id} a.edit-data`).should('not.exist')
}

function deleteModel (model) {
  navigateToModelEdit(model)
  cy.get('form.models-form a.delete').click()
  cy.location('href').should('match', /\/models$/)
  cy.get('.alert-success').contains('Deleted')
}

function deleteCurrentSpace (user) {
  navigateToAccount(user)
  cy.get('a.space-link.current-space').click()
  cy.location('href').should('match', /\/spaces\/[^/]+\/edit$/)
  cy.get('form.spaces-form a.delete').click()
  cy.location('href').should('match', /\/accounts\/[^/]+\/edit$/)
  cy.get('.alert-success').contains(/Deleted/i)
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
  createModel,
  verifyModelCreated,
  saveDataForm,
  saveModelForm,
  createData,
  clickDataList,
  navigateToAccount,
  navigateToModelEdit,
  navigateToDataEdit,
  verifyDataCreated,
  deleteDoc,
  deleteModel,
  deleteCurrentSpace
]
for (let command of commands) {
  Cypress.Commands.add(command.name, command)
}
