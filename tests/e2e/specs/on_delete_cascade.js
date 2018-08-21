import u from '../support/util'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin',
  role: 'admin'
}
const accountName = `Company ${userId}`

describe('On Delete Cascade', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Create Author model', () => {
  })

  it('Create Article model with many-to-one required relationship to Author', () => {
  })

  it('Create an author', () => {
  })

  it('Create an article', () => {
  })

  it('Attempt delete of author - should be rejected. Author and Article should still be there', () => {
  })

  it('Add onDelete: cascade to author field', () => {
  })

  it('Attempt to delete author - both author and article should now be gone', () => {
  })
})
