<template>
  <v-card title>
    <v-card-title> Längste Radfahrten </v-card-title>
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

    <v-overlay :value="busy" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
import { fetchData } from "../api/api";

export default {
  data() {
    return {
      busy: false,
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
      this.busy = true;

      const token = await this.$auth.getTokenSilently();

      const response = await fetchData({ funcName: "bikingLongest", token });
      this.longestBikings = response.data;

      this.longestBikings.map((ride) => {
        let dateObject = new Date(ride.date);
        ride.formatedDate = dateObject.toLocaleDateString("de-DE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        ride.distance = ride.distance.toFixed(2);

        return ride;
      });

      this.busy = false;
    },
  },
};
</script>

<style scoped></style>
