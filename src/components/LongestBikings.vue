<template>
  <v-card title>
    <v-card-title>
      Längste Radfahrten
    </v-card-title>
    <v-list-item three-line>
      <v-list-item-content>
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
              <tr v-for="biking in longestBikings" :key="biking.id">
                <td>
                  {{ biking.formatedDate }}
                </td>
                <td>
                  <a :href="biking.url">{{ biking.name }} </a>
                </td>
                <td>{{ biking.distance }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      //apiUrl: "http://localhost:80/api/run/longest",
      apiUrl: "https://atlantis.mkarl.de:443/api/biking/longest",
      pass: "gi9k3C4F4FER",
      longestBikings: [],
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
        this.longestBikings = a.data;

        this.longestBikings.forEach(function (element) {
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

<style scoped></style>
