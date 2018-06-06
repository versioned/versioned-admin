<template>
  <div id="app">
    <navbar></navbar>
    <alerts></alerts>
    <main role="main">
      <div class="container">
        <router-view></router-view>
      </div>
      <!-- <footer class="footer">
        <alerts></alerts>
      </footer> -->
    </main>
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

  .field-heading.required a:after {
    content:"*";
    color:red;
  }
</style>
