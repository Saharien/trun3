<template>
  <div id="app">
    <v-row class="pl-3 pt-6 pb-0">
      <v-card class="mx-auto" max-width="95%">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              Längste Läufe
            </v-list-item-title>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Datum</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Distanz (km)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="run in longestRuns" :key="run.id">
                    <td>
                      {{ run.formatedDate }}
                    </td>
                    <td>
                      <a :href="run.url">{{ run.name }} </a>
                    </td>
                    <td>{{ run.distance }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //apiUrl: "http://localhost:80/api/run/longest",
      apiUrl: "https://atlantis.mkarl.de:443/api/run/longest",
      pass: "gi9k3C4F4FER",
      longestRuns: [],
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      this.loadData();
    });
  },
  methods: {
    loadData: async function () {
      const token = await this.$auth.getTokenSilently();

      async function getFetchData(urlToLoad, pass, token) {
        const response = await fetch(urlToLoad, {
          headers: { pass: pass, Authorization: `Bearer ${token}` },
        });
        const myJson = await response.json(); //extract JSON from the http response
        return myJson;
      }

      getFetchData(this.apiUrl, this.pass, token).then((a) => {
        this.longestRuns = a.data;

        this.longestRuns.forEach(function (element) {
          let dateObject = new Date(element.date);
          element.formatedDate = dateObject.toLocaleDateString("de-DE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        });
      });
    },
  },
};
</script>

<style scoped>
</style>