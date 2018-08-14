<template lang="html">
  <div class="alert-container">
    <div v-show="alert.success" class="alert alert-success" role="alert" v-html="alert.success">
    </div>
    <div v-show="alert.info" class="alert alert-info" role="alert" v-html="alert.info">
    </div>
    <div v-show="alert.warning" class="alert alert-warning" role="alert" v-html="alert.warning">
    </div>
    <div v-if="alert.errors" class="alert alert-danger" role="alert">
      <h2>{{alert.errors.title}}</h2>
      <ul>
        <li v-for="error in alert.errors.errors" v-bind:key="error">
          <span v-if="error.field">{{error.field}} -</span>
          <span v-if="error.message">{{error.message}}</span>
          <span v-else>{{error}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import Alert from '@/services/alert'

export default {
  props: ['position'],
  computed: {
    alert: function () {
      return u.getIn(Alert.get(), `${this.position}.current`, {})
    }
  }
}
</script>

<style lang="css">
</style>
