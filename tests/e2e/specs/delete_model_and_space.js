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
    TITLE_FIELD
  ]
})

const article = {
  title: 'Trump Touts Success Of Singapore Summit After Securing $10 Billion Trade Deal To Sell Nuclear Warheads To North Korea'
}

describe('Delete Model and Space', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Create Article model', () => {
    cy.createModel(Article)
  })

  it('Create an article', () => {
    cy.createData(Article, [article])
  })

  it('Delete Article model', () => {
    cy.deleteModel(Article)
  })

  it('Create Article model again', () => {
    cy.createModel(Article)
  })

  it('Create article again', () => {
    cy.createData(Article, [article])
  })

  it('Delete Space', () => {
    cy.deleteCurrentSpace(user)
  })
})
