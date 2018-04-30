<template lang="html">
  <div>
    <div v-show="alert.success" class="alert alert-success" role="alert">
      {{alert.success}}
    </div>
    <div v-show="alert.info" class="alert alert-info" role="alert">
      {{alert.info}}
    </div>
    <div v-show="alert.warning" class="alert alert-warning" role="alert">
      {{alert.warning}}
    </div>
    <div v-if="alert.errors" class="alert alert-danger" role="alert">
      {{alert.errors.title}}
      <ul>
        <li v-for="error in alert.errors.errors" v-bind:key="error">
          {{error}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Alert from '@/services/alert'

export default {
  computed: {
    alert: function() {
      return Alert.get().current
    }
  }
}
</script>

<style lang="css">
</style>
