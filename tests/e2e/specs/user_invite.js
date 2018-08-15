import u from '../support/util'

const userId = u.uuid()
const user = {
  email: `${userId}@example.com`,
  password: 'admin',
  role: 'admin'
}
const accountName = `Company ${userId}`
let accountId = null

const newUser = {
  email: `newUser-${userId}@example.com`,
  role: 'read',
  password: 'newUser'
}

const existingUser = {
  email: `existingUser-${userId}@example.com`,
  role: 'admin',
  password: 'existingUser',
  accountName: `Existing Company ${userId}`
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

const ACCOUNT_URL_PATTERN = new RegExp(`/#/accounts/([^/]+)/edit`)
const INVITE_URL_PATTERN = new RegExp(`/#/accounts/([^/]+)/invite-user/([^/]+)`)

function inviteUser (user) {
  cy.get('a.invite-user').click()

  cy.get('input#email').type(user.email)
  cy.get('select#role').select(user.role)
  cy.get('.user-invite-form input[type=submit]').click()
}

function navigateToInvite (user) {
  cy.get('.invited-users-list a.user-invite').first().click()

  cy.get('.user-invite-email').should('contain', user.email)
  cy.get('.user-invite-role').should('contain', user.role)
  cy.location('href').should('match', INVITE_URL_PATTERN)
    .then((location) => {
      user.inviteId = location.match(INVITE_URL_PATTERN)[2]
    })
}

function acceptInviteUrl (user) {
  return `/#/accounts/${accountId}/invite-user-accept/${user.inviteId}`
}

function acceptInvite (user) {
  cy.visit(acceptInviteUrl(user))
  cy.get('input#password').type(user.password)
  cy.get('form.user-invite-accept input[type=submit]').click()
  cy.location('href').should('match', /\/#\/$/)

  navigateToAccount(user)
}

describe('User Invite', () => {
  it(`Register with email=${user.email} and account ${accountName}`, () => {
    cy.register(user.email, user.password, accountName)
  })

  it('Invite a new user to the account', () => {
    navigateToAccount(user)

    cy.location('href').should('match', ACCOUNT_URL_PATTERN)
      .then((location) => {
        accountId = location.match(ACCOUNT_URL_PATTERN)[1]
      })

    cy.get('.users-list li').should('have.length', 1)
    cy.get('.invited-users-list').should('not.exist')

    inviteUser(newUser)

    cy.get('.users-list li').should('have.length', 1)
    cy.get('.invited-users-list').should('have.length', 1)
    cy.get('.invited-users-list a.user-invite').first().click()

    cy.get('.user-invite-email').should('contain', newUser.email)
    cy.get('.user-invite-role').should('contain', newUser.role)
  })

  it('Delete invite and invite again', () => {
    cy.get('a.user-invite-delete').click()

    cy.get('.users-list li').should('have.length', 1)
    cy.get('.invited-users-list').should('not.exist')

    inviteUser(newUser)

    cy.get('.users-list li').should('have.length', 1)
    cy.get('.invited-users-list').should('have.length', 1)
    navigateToInvite(newUser)
  })

  it('Accept invite as new user', () => {
    acceptInvite(newUser)

    cy.get('a.logout').click()
  })

  it('Register existing user', () => {
    cy.register(existingUser.email, existingUser.password, existingUser.accountName)
  })

  it('Log back in as first user, remove user, invite existing user', () => {
    cy.login(user.email, user.password)
    navigateToAccount(user)

    cy.get('.users-list li').should('have.length', 2)
    cy.get('a.remove-user').click()
    cy.get('.account-form input[type=submit]').click()

    navigateToAccount(user)
    cy.get('.users-list li').should('have.length', 1)

    inviteUser(existingUser)

    navigateToInvite(existingUser)
  })

  it('Accept invite as existing user not logged in', () => {
    acceptInvite(existingUser)

    cy.get('a.logout').click()
  })

  it('Log back in as first user, remove existing user and invite again', () => {
    cy.login(user.email, user.password)
    navigateToAccount(user)

    cy.get('.users-list li').should('have.length', 2)
    cy.get('a.remove-user').click()
    cy.get('.account-form input[type=submit]').click()

    navigateToAccount(user)
    cy.get('.users-list li').should('have.length', 1)

    inviteUser(existingUser)

    navigateToInvite(existingUser)
  })

  it('Accept invite as existing user logged in', () => {
    cy.login(existingUser.email, existingUser.password)
    cy.visit(acceptInviteUrl(existingUser))
    cy.location('href').should('match', /\/#\/$/)

    navigateToAccount(existingUser)

    cy.get('.user-profile').click()
    cy.get('ul.accounts li').should('have.length', 2)
    cy.get('a.current-account').should('contain', accountName)

    cy.get('a.logout').click()
  })
})
