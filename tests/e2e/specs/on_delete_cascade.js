import u from '../support/util'
import {Model, TITLE_FIELD} from '../support/test_util'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin',
  role: 'admin'
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
      required: true,
      relationship: {
        toType: 'author',
        toField: 'articles',
        type: 'many-to-one'
      }
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

const author = {
  name: 'Peter Marklund'
}

const article = {
  title: 'Trump Touts Success Of Singapore Summit After Securing $10 Billion Trade Deal To Sell Nuclear Warheads To North Korea',
  author: 'Peter Marklund'
}

describe('On Delete Cascade', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Create Author model', () => {
    cy.createModel(Author, {verify: false})
  })

  it('Create Article model with many-to-one required relationship to Author', () => {
    cy.createModel(Article)
    cy.verifyModelCreated(Author)
  })

  it('Create an author', () => {
    cy.createData(Author, [author])
  })

  it('Create an article', () => {
    cy.createData(Article, [article])
  })

  it('Attempt delete of author - should be rejected. Author and Article should still be there', () => {
    cy.navigateToDataEdit(Author, author)
    cy.get('.data-form a.delete').click()
    cy.get('.alert.errors li').should('contain', 'Cannot be deleted due to the following relationships: articles')
  })

  it('Add onDelete: cascade to author field', () => {
    cy.navigateToModelEdit(Article)
    cy.get('.field.author a.expand-field').click()
    cy.get('.field.author input.cascade').click()
    cy.saveModelForm()
  })

  it('Attempt to delete author - both author and article should now be gone', () => {
    cy.deleteDoc(Author, author)
  })

  it('Create author again', () => {
    cy.createData(Author, [author])
  })

  it('Create article again', () => {
    cy.createData(Article, [article])
  })

  it('Delete Author model', () => {
    cy.deleteModel(Author)
  })

  it('Delete Article model', () => {
    cy.deleteModel(Article)
  })

  it('Create Author model again', () => {
    cy.createModel(Author, {verify: false})
  })

  it('Create author again', () => {
    cy.createData(Author, [author])
  })

  it('Delete Space', () => {
    cy.deleteCurrentSpace(user)
  })
})
