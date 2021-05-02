<template>
  <div class="home">
    
    <!-- Check that the SDK client is not currently loading before accessing is methods -->
    <div v-if="!$auth.loading">
      <!-- show login when not authenticated -->
      <div v-if="!$auth.isAuthenticated">
        <button  @click="login">Einloggen</button>
        <p>Wir haben einen neuen Login-Screen - dieser kann jetzt das Passwort speichern. Die Zugangsdaten findet Ihr im Confluence und in Strava im Club bei den Beiträgen.</p>
      </div>
      
      <!-- show content and logout when authenticated -->     
      <div v-if="$auth.isAuthenticated">
        <RankingList/>
        <p><button @click="logout">Ausloggen</button></p>
      </div>

    </div>

    
  </div>
</template>

<script>
import RankingList from '@/components/RankingList.vue'

export default {
  name: 'Home',
  components: {
    RankingList
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>

<style scoped>
#home {
  text-align: left;
  padding: 0;
  padding-top: 4px;
  font-family: "Nunito Sans", sans-serif;
  font-weight: 100;
  color: #262626;
  font-size: 16px;
}

button {
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #46bfe0;
  display: inline-block;
  cursor: pointer;
  color: #46bfe0;
  font-family: "Nunito Sans", sans-serif;
  font-size: 17px;
  margin-right: 4px;
  padding: 4px 7px;
  text-decoration: none;
  outline: none;
}

</style>
