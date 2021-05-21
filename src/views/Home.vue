<template>
  <div class="home">
    <v-app-bar app flat dark color="#46bfe0">
      <v-img
        src="@/assets/logo.png"
        max-height="50"
        max-width="51"
        contain
      ></v-img>

      <v-toolbar-title>T.RUN</v-toolbar-title>
    </v-app-bar>

    <v-main class="pt-2">
      <!-- Check that the SDK client is not currently loading before accessing is methods -->
      <div v-if="!$auth.loading">
        <!-- show login when not authenticated -->
        <div v-if="!$auth.isAuthenticated">
          <v-btn class="ml-3 mt-3 mb-3" depressed @click="login">Einloggen</v-btn>
          <div class="ml-4 mt-0 mb-3 mr-4">
            Wir haben einen neuen Login-Screen - dieser kann jetzt das
            Passwort speichern. Die Zugangsdaten findet Ihr im Confluence und in
            Strava im Club bei den Beiträgen.
          </div>
        </div>

        <!-- show content and logout when authenticated -->
        <div v-if="$auth.isAuthenticated">
          <RankingList />
          <v-btn class="ml-3 mt-3 mb-3" depressed @click="logout">Ausloggen</v-btn>
        </div>
      </div>
    </v-main>
  </div>
</template>

<script>
import RankingList from "@/components/RankingList.vue";
export default {
  name: "Home",
  components: {
    RankingList,
  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>

<style scoped>
</style>