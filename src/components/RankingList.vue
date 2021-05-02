<template>
  <div id="app">
    <div>
      <img id="trunImage" src="@/assets/logo.png" />
    </div>

    <div class="buttonRow">
      <button
        v-bind:class="{
          'selected-button': showWhat == 'run/hitlist',
          'selection-button': showWhat != 'run/hitlist',
        }"
        v-on:click="showRuns"
      >
        <i class="fas fa-running"></i> Laufen
      </button>
      <button
        v-bind:class="{
          'selected-button': showWhat == 'biking/hitlist',
          'selection-button': showWhat != 'biking/hitlist',
        }"
        v-on:click="showBikings"
      >
        <i class="fas fa-biking"></i> Rad
      </button>
      <button
        v-bind:class="{
          'selected-button': timeSpan == 4,
          'selection-button': timeSpan != 4,
        }"
        v-on:click="setApril"
      >
        April
      </button>
      <button
        v-bind:class="{
          'selected-button': timeSpan == 5,
          'selection-button': timeSpan != 5,
        }"
        v-on:click="setMai"
      >
        Mai
      </button>
      <button
        v-bind:class="{
          'selected-button': timeSpan == 6,
          'selection-button': timeSpan != 6,
        }"
        v-on:click="setJuni"
      >
        Juni
      </button>
    </div>

    <div class="tablecontent">
      <table>
        <tr>
          <th @click="sort('rank')">Platz</th>
          <th>Name</th>
          <th @click="sort('distance')">Strecke</th>
          <th @click="sort('heightMeter')" v-if="showWhat == 'biking/hitlist'">
            H&ouml;henmeter
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
    </div>
  </div>
</template>

<script>
export default {
  setup() {},
  data() {
    return {
      showWhat: "run/hitlist", // Alternative 'biking/hitlist'
      timeSpan: "4",
      activities: [],
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
    loadData: function () {
      this.urlToLoad = this.apiUrl + "/" + this.showWhat + "/" + this.timeSpan;

      async function getFetchData(urlToLoad, pass) {
        const response = await fetch(urlToLoad, {
          headers: { pass: pass },
        });
        const myJson = await response.json(); //extract JSON from the http response
        return myJson;
      }

      getFetchData(this.urlToLoad, this.pass).then((a) => {
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
  padding: 0;
  font-family: "Nunito Sans", sans-serif;
  font-weight: 100;
  color: #262626;
  font-size: 16px;
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

.button-row {
  height: 100px;
}

#trunImage {
  height: 100px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.5em;
}

#app {
  width: 500px;
}
</style>
