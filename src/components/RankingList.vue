<template>
  <div id="app">
    <v-row class="pl-3 pt-6 pb-0">
      <v-btn-toggle v-model="toggleSport" borderless>
        <v-btn v-on:click="showRuns">
          <v-icon>mdi-run</v-icon>
        </v-btn>

        <v-btn v-on:click="showBikings">
          <v-icon>mdi-bike-fast</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle class="pl-3" v-model="toggleTimespan" borderless>
        <v-btn value="4" v-on:click="setApril">
          <span>APR</span>
        </v-btn>

        <v-btn value="5" v-on:click="setMai">
          <span>MAI</span>
        </v-btn>

        <v-btn value="6" v-on:click="setJuni">
          <span>JUN</span>
        </v-btn>

        <v-btn value="S" v-on:click="setSum">
          <v-icon>mdi-sigma</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-row>

    <v-row v-if="sortedActivities.length > 0">
      <v-col>
        <table>
          <tr>
            <th @click="sort('rank')">Platz</th>
            <th>Name</th>
            <th @click="sort('distance')">Strecke</th>
            <th
              @click="sort('heightMeter')"
              v-if="showWhat == 'biking/hitlist'"
            >
              Anstieg
            </th>
          </tr>
          <tr v-for="activity in sortedActivities" :key="activity.id">
            <td>{{ activity.rank }}</td>
            <td>
              <a :href="activity._id.url">{{ activity._id.name }} </a>
            </td>
            <td>{{ activity.distance }} km</td>
            <td v-if="showWhat == 'biking/hitlist'">
              {{ activity.heightMeter }} m
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>

    <v-row v-if="sortedActivities.length == 0">
      <v-card width="75%" flat>
      <v-col>
        <v-alert text outlined colored-border class="mt-3">
          F&uuml;r diese Sportart sind in diesem Monat keine Daten vorhanden.
        </v-alert>
      </v-col>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  setup() {},
  data() {
    return {
      toggleSport: 0,
      toggleTimespan: "6",

      showWhat: "run/hitlist", // Alternative 'biking/hitlist'
      timeSpan: "5",
      activities: [],
      //apiUrl: "http://localhost:80/api",
      apiUrl: "https://atlantis.mkarl.de:443/api",
      pass: "gi9k3C4F4FER",
      urlToLoad: "",
      currentSort: "rank",
      currentSortDir: "asc",
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      this.loadData();
    });
  },
  methods: {
    loadData: async function () {
      this.urlToLoad = this.apiUrl + "/" + this.showWhat + "/" + this.timeSpan;

      const token = await this.$auth.getTokenSilently();

      async function getFetchData(urlToLoad, pass, token) {
        const response = await fetch(urlToLoad, {
          headers: { pass: pass, Authorization: `Bearer ${token}` },
        });
        const myJson = await response.json(); //extract JSON from the http response
        return myJson;
      }

      getFetchData(this.urlToLoad, this.pass, token).then((a) => {
        let rank = 0;
        let lastTotalAmount = 0;

        this.activities = a.data;

        // Platzierung setzen
        this.activities.forEach(function (element) {
          // calculate distance
          element.distance =
            Math.round((element.totalAmount + Number.EPSILON) * 100) / 100;

          // calculate height meter
          element.heightMeter =
            Math.round((element.elevgain + Number.EPSILON) * 1) / 1;

          if (element.totalAmount != lastTotalAmount) {
            rank++;
          }

          element.rank = rank;
          lastTotalAmount = element.totalAmount;
        });
      });
    },
    showRuns: function () {
      this.showWhat = "run/hitlist";
      this.loadData();
    },
    showBikings: function () {
      this.showWhat = "biking/hitlist";
      this.loadData();
    },
    setApril: function () {
      this.timeSpan = 4;
      this.loadData();
    },
    setMai: function () {
      this.timeSpan = 5;
      this.loadData();
    },
    setJuni: function () {
      this.timeSpan = 6;
      this.loadData();
    },
    setSum: function () {
      this.timeSpan = "S";
      this.loadData();
    },
    sort: function (s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
  },
  computed: {
    sortedActivities: function () {
      let activities = this.activities;
      return activities.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === "desc") modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
};
</script>

<style scoped>
#app {
  text-align: left;
  font-family: "Nunito Sans", sans-serif;
  font-weight: 100;
  color: #262626;
  font-size: 16px;
  margin-left: 1em;
}

a {
  color: rgb(0, 0, 0);
}

th,
td {
  padding-right: 18px;
  padding-top: 6px;
  text-align: left;
}

.selected-button {
  background-color: #46bfe0;
  border-radius: 4px;
  border: 1px solid #46bfe0;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: "Nunito Sans", sans-serif;
  font-size: 17px;
  margin-right: 4px;
  padding: 4px 7px;
  text-decoration: none;
  outline: none;
}

.selected-button:active {
  position: relative;
  top: 1px;
}

.selection-button {
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

.selection-button:active {
  position: relative;
  top: 1px;
}

#app {
  width: 500px;
}
</style>
