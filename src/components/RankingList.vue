<template>
  <v-card tile>
    <v-card-title>
      <h1>Rangliste</h1>
      <v-spacer></v-spacer>
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
    </v-card-title>

    <v-tabs v-model="tab">
      <v-tab key="run" v-on:click="showRuns">Laufen</v-tab>
      <v-tab key="cycle" v-on:click="showBikings">Radfahren</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="run">
        <v-data-table
          :headers="headersRun"
          :items="runActivities"
          :items-per-page="-1"
          :sort-by="['rank']"
        >
        </v-data-table>
      </v-tab-item>
      <v-tab-item key="cycle">
        <v-data-table
          :headers="headersCycle"
          :items="cycleActivities"
          :items-per-page="-1"
          :sort-by="['rank']"
        ></v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
  setup() {},
  data() {
    return {
      tab: null,
      headersRun: [
        { text: "Platz", value: "rank" },
        { text: "Name", value: "_id.name" },
        { text: "Strecke", value: "distance" },
      ],
      headersCycle: [
        { text: "Platz", value: "rank" },
        { text: "Name", value: "_id.name" },
        { text: "Strecke", value: "distance" },
        { text: "Anstieg", value: "heightMeter" },
      ],
      toggleSport: 0,
      toggleTimespan: "6",

      timeSpan: "5",
      runActivities: [],
      cycleActivities: [],
      //apiUrl: "http://localhost:80/api",
      apiUrl: "https://atlantis.mkarl.de:443/api",
      pass: "gi9k3C4F4FER",
      urlToLoad: "",
    };
  },
  mounted: function () {
    this.$nextTick(async () => {
      this.runActivities = await this.loadData();
    });
  },
  methods: {
    loadData: async function (dataToShow = "run/hitlist") {
      const urlToLoad = `${this.apiUrl}/${dataToShow}/${this.timeSpan}`;

      const token = await this.$auth.getTokenSilently();

      async function getFetchData(urlToLoad, pass, token) {
        const response = await fetch(urlToLoad, {
          headers: { pass: pass, Authorization: `Bearer ${token}` },
        });
        const myJson = await response.json(); //extract JSON from the http response
        return myJson;
      }

      const response = await getFetchData(urlToLoad, this.pass, token);
      const data = response.data.map((element, index) => ({
        _id: element._id,
        distance:
          Math.round((element.totalAmount + Number.EPSILON) * 100) / 100,
        heightMeter: Math.round((element.elevgain + Number.EPSILON) * 1) / 1,
        rank: index + 1,
      }));

      return data;
    },
    showRuns: async function () {
      if (this.runActivities.length === 0)
        this.runActivities = await this.loadData("run/hitlist");
    },
    showBikings: async function () {
      if (this.cycleActivities.length === 0)
        this.cycleActivities = await this.loadData("biking/hitlist");
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
  },
  computed: {},
};
</script>

<style scoped>
</style>
