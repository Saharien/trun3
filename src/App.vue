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
/*
#app {
  text-align: left;
  padding: 0;
  font-family: "Nunito Sans", sans-serif;
  font-weight: 100;
  color: #262626;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#trunImage {
  height: 100px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.5em;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
*/
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
