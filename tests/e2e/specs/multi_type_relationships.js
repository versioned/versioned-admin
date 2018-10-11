import u from '../support/util'
import {Model, TITLE_FIELD} from '../support/test_util'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin',
  role: 'admin'
}
const accountName = `Company ${userId}`

const Page = Model({
  name: 'Page',
  fields: [
    TITLE_FIELD,
    {
      name: 'Items',
      category: 'one-way-relationship',
      relationship: {
        toTypes: ['imagewidget', 'herowidget'],
        type: 'one-to-many'
      }
    }
  ]
})

const ImageWidget = Model({
  name: 'ImageWidget',
  fields: [
    TITLE_FIELD
  ]
})

const HeroWidget = Model({
  name: 'HeroWidget',
  fields: [
    TITLE_FIELD
  ]
})

const page = {
  title: 'The Page',
  items: ['Image Widget', 'Hero Widget']
}

const imageWidget = {
  title: 'Image Widget'
}

const heroWidget = {
  title: 'Hero Widget'
}

describe('Multi-type one-way relationships', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Create ImageWidget model and data', () => {
    cy.createModel(ImageWidget)
    cy.createData(ImageWidget, [imageWidget])
  })

  it('Create HeroWidget model and data', () => {
    cy.createModel(HeroWidget)
    cy.createData(HeroWidget, [heroWidget])
  })

  it('Create Page model and data', () => {
    cy.createModel(Page)
    cy.wait(2000) // wait for relationship data to land in Algolia search index
    cy.createData(Page, [page])
  })
})
