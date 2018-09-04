<template>
  <div id="app">
    <navbar></navbar>
    <alerts position="top"></alerts>
    <main role="main">
      <div class="container">
        <router-view></router-view>
        <div v-if="$store.state.loading" class="loader">
          <img src="/ajax-loader.gif">
        </div>
      </div>
    </main>
    <alerts position="bottom"></alerts>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Alerts from '@/components/Alerts'

export default {
  name: 'app',
  components: {
    Navbar,
    Alerts
  }
}
</script>

<style>
  main {
    margin-bottom: 20px;
  }
  .btn {
    margin-bottom: 10px;
  }
  .form-group.buttons {
    margin-top: 10px;
  }

  .form-input {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .form-group.required label:after {
    content:"*";
    color:red;
  }

  .field-heading.required:after {
    content:"*";
    color:red;
  }
  .loader {
    margin-top: 20px;
  }
</style>
