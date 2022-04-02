<template>
  <v-app app>
    <v-app-bar app clipped-left flat dark color="#46bfe0">
      <v-img
        src="@/assets/logo.png"
        max-height="50"
        max-width="51"
        contain
      ></v-img>

      <v-toolbar-title>T.RUN</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="ml-3 mt-3 mb-3"
        light
        depressed
        @click="login"
        v-if="!$auth.loading && !$auth.isAuthenticated"
        >Login</v-btn
      >
      <v-btn
        class="ml-3 mt-3 mb-3"
        light
        depressed
        @click="logout"
        v-if="!$auth.loading && $auth.isAuthenticated"
        >Logout</v-btn
      >
    </v-app-bar>

    <v-navigation-drawer app clipped>
      <v-list dense nav>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title @click="gotoRoute('/')">Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="!$auth.loading && $auth.isAuthenticated">
          <v-list-item-content>
            <v-list-item-title @click="gotoRoute('/hitlist')"
              >Rangliste</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="!$auth.loading && $auth.isAuthenticated">
          <v-list-item-content>
            <v-list-item-title @click="gotoRoute('/dashboard')"
              >Dashboard</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer app light>
      <v-col class="text-center" cols="12">
        <span>Made with 🍺 in Passau.</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<style></style>

<script>
export default {
  name: "App",
  data() {
    return {
      showPassword: false,
    };
  },
  methods: {
    gotoRoute(route) {
      this.$router.push(route);
    },
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
