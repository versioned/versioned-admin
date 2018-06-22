// https://docs.cypress.io/api/introduction/api.html

import u from '../support/util'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin'
}
const accountName = `Company ${userId}`

const Article = {
  name: 'Article',
  fields: [
    {
      name: 'Author',
      category: 'two-way-relationship',
      relationship: {
        toField: 'articles',
        type: 'many-to-one'
      }
    },
    {
      name: 'Slot',
      category: 'two-way-relationship',
      relationship: {
        type: 'one-to-one'
      }
    },
    {
      name: 'Categories',
      category: 'two-way-relationship',
      relationship: {
        toType: 'category',
        toField: 'articles',
        type: 'many-to-many'
      }
    },
    {
      name: 'Awesome',
      type: 'boolean'
    },
    {
      name: 'Score',
      type: 'integer'
    }
  ]
}

const Author = {
  name: 'Author'
}

const Slot = {
  name: 'Slot'
}

const Category = {
  name: 'Category'
}

function navigateHome () {
  cy.get('a.navbar-brand').click()
  cy.location('href').should('match', /#\/$/)
}

function saveModelsForm () {
  cy.get('form.models-form input[type="submit"]').last().click()
  cy.get('.alert-success').contains('Saved')
}

function clickNewModel () {
  navigateHome()
  cy.get('.new-model').click()
  cy.location('href').should('match', /#\/models\/new$/)
}

const FIELD_DEFAULTS = {
  category: 'data',
  type: 'string'
}

function addModelField (field, index) {
  field = Object.assign({}, FIELD_DEFAULTS, field)
  cy.get('.add-field').click()
  const scope = `.field-${index + 2}`
  cy.get(`${scope} input.field-name`).type(field.name)
  if (field.category === 'data') {
    cy.get(`${scope} select.data-type`).select(field.type)
  } else {
    cy.get(`${scope} input.${field.category}`).click()
  }
  if (field.relationship) {
    const {type, toType, toField} = field.relationship
    if (toType) cy.get(`${scope} input.to-type`).clear().type(toType)
    if (toField) cy.get(`${scope} input.to-field`).clear().type(toField)
    cy.get(`${scope} input.${type}`).click()
  }
}

function createModel (model) {
  clickNewModel()
  cy.get('form input#name').type(model.name);
  (model.fields || []).forEach(addModelField)
  saveModelsForm()
}

describe('Kitchensink', () => {
  it('Visit homepage and get redirected to login page', () => {
    cy.visit('/')
    cy.location('href').should('match', /#\/login$/)
  })

  it(`Click register link and submit register form with email=${user.email}`, () => {
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

  it('Create Article model', () => {
    createModel(Article)
  })

  it('Create Author model', () => {
    createModel(Author)
  })

  it('Create Slot model', () => {
    createModel(Slot)
  })

  it('Create Category model', () => {
    createModel(Category)
  })
})
