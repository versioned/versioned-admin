// https://docs.cypress.io/api/introduction/api.html

import u from '../support/util'
import {truncated} from '../support/client_util'
import data from '../support/kitchensink_data'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin'
}
const accountName = `Company ${userId}`

const TITLE_FIELD = {
  name: 'Title',
  type: 'string'
}

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
        toType: 'author',
        toField: 'articles',
        type: 'many-to-one'
      }
    },
    {
      name: 'Slot',
      category: 'two-way-relationship',
      relationship: {
        toType: 'slot',
        toField: 'article',
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
        toType: 'article',
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
        toType: 'article',
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
        toType: 'article',
        toField: 'categories'
      }
    }
  ]
})

function Model (model) {
  const modelDefaults = {
    coll: u.dbFriendly(model.name)
  }
  const fieldDefaults = {
    category: 'data',
    type: 'string'
  }
  function fieldsWithDefaults (fields) {
    return (fields || []).map((field) => {
      const key = u.dbFriendly(field.name)
      return Object.assign({key}, fieldDefaults, field)
    })
  }
  return Object.assign({}, modelDefaults, model, {
    fields: fieldsWithDefaults(model.fields),
    expectedFields: fieldsWithDefaults(model.expectedFields)
  })
}

function stringify (value) {
  const stringValue = (u.isArray(value) ? value.join(', ') : value)
  return truncated(stringValue)
}

function saveDataForm (options = {}) {
  const className = options.publish ? 'save-and-publish' : 'save'
  cy.get(`form.data-form .${className}`).first().click()
  cy.waitForSave()
}

function clickNewData (model) {
  cy.navigateHome()
  cy.get(`tr.models-row.${model.coll} a.new-data`).click({force: true})
  cy.location('href').should('match', new RegExp(`#\/data\/${model.coll}\/new$`))
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

function createData (model) {
  (data[model.name] || []).forEach((doc, index) => {
    console.log(`createData for model=${model.name} index=${index}`)
    clickNewData(model)
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

function verifyDocCreated (model, doc) {
  console.log(`verifyDocCreated for model=${model.name}`, doc)
  clickDataList(model)
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

function verifyDataCreated (model) {
  data[model.name].forEach(doc => verifyDocCreated(model, doc))
}

function updateArticleData () {
  const model = Article
  const doc = data[model.name][0]
  navigateToDataEdit(Article, doc)

  cy.log('Make changes')
  const EDIT = ' EDIT'
  cy.get(`.data-field-title .form-control`).type(EDIT)
  cy.get(`.data-field-body .form-control`).type(EDIT)
  const removeSlot = data[Slot.name].find(d => d.name === 'First Page')
  cy.get(`.data-field-slot .selected-results .slot-${removeSlot.id} .remove-relationship`).click()
  const removeCategory = data[Category.name].find(d => d.name === 'Entertainment')
  cy.get(`.data-field-categories .selected-results .category-${removeCategory.id} .remove-relationship`).click()

  cy.log('Save form and navigate back (refresh)')
  saveDataForm()
  navigateToDataEdit(Article, doc)

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
  saveDataForm()
  navigateToDataEdit(Article, doc)

  cy.log('verify changes (slot/category should be there again)')
  cy.get('.version').should('contain', '1')
  cy.get('.published-version').should('not.exist')
  cy.get(`.data-field-slot .selected-results .slot-${removeSlot.id}`).should('exist')
  cy.get(`.data-field-categories .selected-results .category-${removeCategory.id}`).should('exist')
}

function publishArticleData () {
  const model = Article
  const doc = data[model.name][1]

  navigateToDataEdit(Article, doc)
  cy.get('.version').should('have.text', '1')
  cy.get('.published-version').should('not.exist')
  cy.get('.publish-status').first().should('have.text', 'Not Yet Published')

  cy.log('Click publish button - creates published version')
  saveDataForm({publish: true})
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
  saveDataForm({publish: true})
  cy.get('.version').should('have.text', '2')
  cy.get('.published-version').should('have.text', '2')
  cy.get('.publish-status').first().should('have.text', 'Published')
  cy.get('.publish-status-draft').should('not.exist')
  cy.get('.versions li').should('have.length', 2)

  cy.log('Navigate away and back and check changes have persisted')
  navigateToDataEdit(Article, doc)
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
    cy.get('.brand').should('contain', accountName)
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
    createData(Author)
  })

  it('Create Slot data', () => {
    createData(Slot)
  })

  it('Create Category data', () => {
    createData(Category)
  })

  it('Create Article data', () => {
    createData(Article)
  })

  it('Verify Article data created', () => {
    verifyDataCreated(Article)
  })

  it('Update Article data', () => {
    updateArticleData()
  })

  it('Publish Article data', () => {
    publishArticleData()
  })
})
