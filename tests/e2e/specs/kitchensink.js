// https://docs.cypress.io/api/introduction/api.html

const u = require('../support/util')
const data = require('../support/kitchensink_data')
const {Model, TITLE_FIELD} = require('../support/test_util')

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin'
}
const accountName = `Company ${userId}`

const Article = Model({
  name: 'Article',
  fields: [
    TITLE_FIELD,
    {
      name: 'Body',
      type: 'text'
    },
    {
      name: 'Author',
      category: 'two-way-relationship',
      relationship: {
        toTypes: ['author'],
        toField: 'articles',
        type: 'many-to-one'
      }
    },
    {
      name: 'Slot',
      category: 'two-way-relationship',
      relationship: {
        toTypes: ['slot'],
        toField: 'article',
        type: 'one-to-one'
      }
    },
    {
      name: 'Categories',
      category: 'two-way-relationship',
      relationship: {
        toTypes: ['category'],
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
})

const Author = Model({
  name: 'Author',
  fields: [
    {
      name: 'Name',
      type: 'string'
    }
  ],
  expectedFields: [
    {
      name: 'Articles',
      category: 'two-way-relationship',
      relationship: {
        type: 'one-to-many',
        toTypes: ['article'],
        toField: 'author'
      }
    }
  ]
})

const Slot = Model({
  name: 'Slot',
  fields: [
    {
      name: 'Name',
      type: 'string'
    }
  ],
  expectedFields: [
    {
      name: 'Article',
      category: 'two-way-relationship',
      relationship: {
        type: 'one-to-one',
        toTypes: ['article'],
        toField: 'slot'
      }
    }
  ]
})

const Category = Model({
  name: 'Category',
  fields: [
    {
      name: 'Name',
      type: 'string'
    }
  ],
  expectedFields: [
    {
      name: 'Articles',
      category: 'two-way-relationship',
      relationship: {
        type: 'many-to-many',
        toTypes: ['article'],
        toField: 'categories'
      }
    }
  ]
})

function updateArticleData () {
  const model = Article
  const doc = data[model.name][0]
  cy.navigateToDataEdit(Article, doc)

  cy.log('Make changes')
  const EDIT = ' EDIT'
  cy.get(`.data-field-title .form-control`).type(EDIT)
  cy.get(`.data-field-body .form-control`).type(EDIT)
  const removeSlot = data[Slot.name].find(d => d.name === 'First Page')
  cy.get(`.data-field-slot .selected-results .slot-${removeSlot.id} .remove-relationship`).click()
  const removeCategory = data[Category.name].find(d => d.name === 'Entertainment')
  cy.get(`.data-field-categories .selected-results .category-${removeCategory.id} .remove-relationship`).click()

  cy.log('Save form and navigate back (refresh)')
  cy.saveDataForm()
  cy.navigateToDataEdit(Article, doc)

  cy.log('Verify changes')
  cy.get('.version').should('have.text', '1')
  cy.get('.published-version').should('not.exist')
  cy.get(`.data-field-title .form-control`).should('have.value', doc.title + EDIT)
  cy.get(`.data-field-body .form-control`).should('have.value', doc.body + EDIT)
  cy.get(`.data-field-slot .selected-results .slot-${removeSlot.id}`).should('not.exist')
  cy.get(`.data-field-categories .selected-results .category-${removeCategory.id}`).should('not.exist')

  cy.log('Make some different changes (re-add slot and category)')
  cy.get(`.data-field-slot input.search`).clear().type(removeSlot.name, {force: true, delay: 1})
  cy.get(`.data-field-slot .menu .item`).first().click()
  cy.get(`.data-field-categories input.search`).clear().type(removeCategory.name, {force: true, delay: 1})
  cy.get(`.data-field-categories .menu .item`).first().click()

  cy.log('Save form and navigate back (refresh)')
  cy.saveDataForm()
  cy.navigateToDataEdit(Article, doc)

  cy.log('verify changes (slot/category should be there again)')
  cy.get('.version').should('contain', '1')
  cy.get('.published-version').should('not.exist')
  cy.get(`.data-field-slot .selected-results .slot-${removeSlot.id}`).should('exist')
  cy.get(`.data-field-categories .selected-results .category-${removeCategory.id}`).should('exist')
}

function publishArticleData () {
  const model = Article
  const doc = data[model.name][1]

  cy.navigateToDataEdit(Article, doc)
  cy.get('.version').should('have.text', '1')
  cy.get('.published-version').should('not.exist')
  cy.get('.publish-status').first().should('have.text', 'Not Yet Published')

  cy.log('Click publish button - creates published version')
  cy.saveDataForm({publish: true})
  cy.get('.version').should('have.text', '1')
  cy.get('.published-version').should('have.text', '1')
  cy.get('.publish-status').first().should('have.text', 'Published')
  cy.get('.publish-status-draft').should('not.exist')
  cy.get('.versions li').should('have.length', 1)

  cy.log('Make changes and click save - draft version is created')
  const EDIT = ' EDIT'
  cy.get(`.data-field-title .form-control`).type(EDIT)
  cy.get('.save').click()
  cy.get('.version').should('have.text', '2')
  cy.get('.published-version').should('have.text', '1')
  cy.get('.publish-status').first().should('have.text', 'Published')
  cy.get('.publish-status-draft').first().should('have.text', 'Draft')
  cy.get('.versions li').should('have.length', 2)

  cy.log('Click publish button - published version is updated')
  cy.saveDataForm({publish: true})
  cy.get('.version').should('have.text', '2')
  cy.get('.published-version').should('have.text', '2')
  cy.get('.publish-status').first().should('have.text', 'Published')
  cy.get('.publish-status-draft').should('not.exist')
  cy.get('.versions li').should('have.length', 2)

  cy.log('Navigate away and back and check changes have persisted')
  cy.navigateToDataEdit(Article, doc)
  cy.get('.version').should('have.text', '2')
  cy.get('.published-version').should('have.text', '2')
}

describe('Kitchensink', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Click logout link and log back in again', () => {
    cy.get('a.logout').click()
    cy.location('href').should('match', /#\/login$/)

    cy.get('form input#email').type(user.email)
    cy.get('form input#password').type(user.password)
    cy.get('form.login-form').submit()
    cy.location('href').should('match', /#\/$/)
  })

  it('Check company name in Navbar', () => {
    cy.get('.brand').should('contain', 'Versioned')
  })

  it('Create Article model', () => {
    cy.createModel(Article)
  })

  it('Create Author model', () => {
    cy.createModel(Author)
  })

  it('Create Slot model', () => {
    cy.createModel(Slot)
  })

  it('Create Category model', () => {
    cy.createModel(Category)
  })

  it('Create Author data', () => {
    cy.createData(Author, data[Author.name])
  })

  it('Create Slot data', () => {
    cy.createData(Slot, data[Slot.name])
  })

  it('Create Category data', () => {
    cy.createData(Category, data[Category.name])
  })

  it('Create Article data', () => {
    cy.createData(Article, data[Article.name])
  })

  it('Verify Article data created', () => {
    cy.verifyDataCreated(Article, data[Article.name])
  })

  it('Update Article data', () => {
    updateArticleData()
  })

  it('Publish Article data', () => {
    publishArticleData()
  })
})
