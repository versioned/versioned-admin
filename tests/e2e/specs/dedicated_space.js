import u from '../support/util'
import {Model, TITLE_FIELD} from '../support/test_util'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin',
  role: 'admin'
}
const accountName = `Company ${userId}`

const dedicatedSpace = {
  name: 'dedicated',
  mongodbUrl: Cypress.env('MONGODB_URL'),
  algoliaApplicationId: Cypress.env('ALGOLIASEARCH_APPLICATION_ID'),
  algoliaApiKey: Cypress.env('ALGOLIASEARCH_API_KEY')
}

const Article = Model({
  name: 'Article',
  fields: [
    TITLE_FIELD
  ]
})

const Author = Model({
  name: 'Author',
  fields: [
    {
      name: 'Name',
      type: 'string'
    },
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

const author = {
  name: 'Peter Marklund'
}

const article = {
  title: 'Trump Touts Success Of Singapore Summit After Securing $10 Billion Trade Deal To Sell Nuclear Warheads To North Korea',
  author: 'Peter Marklund'
}

const dedicatedAuthor = {
  name: 'Joe Armstrong'
}

const dedicatedArticle = {
  title: 'A computer scientist working in the area of fault-tolerant distributed systems. He is best known as the author of the Erlang programming language.',
  author: 'Joe Armstrong'
}

describe('Dedicated Space', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Create Author model', () => {
    cy.createModel(Author)
  })

  it('Create Article model', () => {
    cy.createModel(Article)
  })

  it('Create an author', () => {
    cy.createData(Author, [author])
  })

  it('Create an article', () => {
    cy.createData(Article, [article])
  })

  it('Create dedicated space', () => {
    cy.createSpace(user, dedicatedSpace)
  })

  it('Create Author model', () => {
    cy.createModel(Author)
  })

  it('Create Article model', () => {
    cy.createModel(Article)
  })

  it('Create an author', () => {
    cy.createData(Author, [dedicatedAuthor])
  })

  it('Create an article', () => {
    cy.createData(Article, [dedicatedArticle])
  })
})
