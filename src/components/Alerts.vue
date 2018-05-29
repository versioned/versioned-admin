<template lang="html">
  <div>
    <div v-show="alert.success" class="alert alert-success" role="alert" v-html="alert.success">
    </div>
    <div v-show="alert.info" class="alert alert-info" role="alert" v-html="alert.info">
    </div>
    <div v-show="alert.warning" class="alert alert-warning" role="alert" v-html="alert.warning">
    </div>
    <div v-if="alert.errors" class="alert alert-danger" role="alert">
      <span v-class="alert.errors.title">{{alert.errors.title}}</span>
      <ul>
        <li v-for="error in alert.errors.errors" v-bind:key="error">
          {{error}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import u from '@/util'
import Alert from '@/services/alert'

export default {
  computed: {
    alert: function () {
      return u.getIn(Alert.get(), 'current', {})
    }
  }
}
</script>

<style lang="css">
</style>
