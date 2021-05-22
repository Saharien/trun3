<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->

    <v-app>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'App',
  data () {
    return {
      showPassword: false
    }
  }  
}
</script>
