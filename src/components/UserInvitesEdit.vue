<template>
  <div>
    <h1>User Invite</h1>

    <p>
      Account:
      <router-link :to="accountUrl()">
        {{account.name}}
      </router-link>
    </p>

    <p>
      Email: {{userInvite.email}}
    </p>

    <p>
      Role: {{userInvite.role}}
    </p>

    <p>
      Invited at:
      {{userInvite.createdAt | date('YYYY-MM-DD hh:mm') }}
      ({{userInvite.createdAt | timeAgo}})
    </p>

    <p>
      <a href="#" @click="remove()">Delete Invite</a>
    </p>
  </div>
</template>

<script>
import router from '@/router'
import UserInvite from '@/services/user_invite'
import Account from '@/services/account'
import Alert from '@/services/alert'

export default {
  data: () => {
    return {
      userInvite: {},
      account: {}
    }
  },
  created () {
    this.getData()
  },
  watch: {
    '$route': 'getData'
  },
  methods: {
    accountUrl () {
      return `/accounts/${this.account.id}/edit`
    },
    async getData () {
      const id = this.$route.params.id
      this.account = await Account.get(id, {relationshipLevels: 2})
      const inviteId = this.$route.params.inviteId
      this.userInvite = await UserInvite(this.account.id).get(inviteId)
    },
    remove: async function () {
      await UserInvite(this.account.id).remove(this.userInvite.id)
      Alert.setNext('success', 'User Invite Deleted')
      router.push(`/accounts/${this.account.id}/edit`)
    }
  }
}
</script>

<style lang="css">
</style>
