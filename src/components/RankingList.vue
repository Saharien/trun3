<template>
  <v-card tile>
    <v-card-title>
      <h1>Rangliste</h1>
      <v-spacer></v-spacer>
      <v-btn-toggle class="pl-3" v-model="timeSpan" borderless>
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
import { fetchData } from "../api/api";

export default {
  data() {
    return {
      tab: null,
      headersRun: [
        { text: "Platz", value: "rank" },
        { text: "Name", value: "_id.name" },
        { text: "Strecke in km", value: "distance" },
      ],
      headersCycle: [
        { text: "Platz", value: "rank" },
        { text: "Name", value: "_id.name" },
        { text: "Strecke in km", value: "distance" },
        { text: "Anstieg in hm", value: "heightMeter" },
      ],
      toggleSport: 0,

      timeSpan: "S",
      dataToShow: "hitlistRun",
      runActivities: [],
      cycleActivities: [],
    };
  },
  mounted: function () {
    this.$nextTick(async () => {
      await this.loadData();
    });

    const currentMonth = new Date().getMonth() + 1;
    if ([4, 5, 6].includes(currentMonth)) {
      this.timeSpan = currentMonth;
    }
  },
  methods: {
    loadData: async function () {
      const token = await this.$auth.getTokenSilently();

      const response = await fetchData({
        funcName: `${this.dataToShow}?timeSpan=${this.timeSpan}`,
        token,
      });
      const data = response.data.map((element, index) => ({
        _id: element._id,
        distance:
          Math.round((element.totalAmount + Number.EPSILON) * 100) / 100,
        heightMeter: Math.round((element.elevgain + Number.EPSILON) * 1) / 1,
        rank: index + 1,
      }));

      if (this.dataToShow === "hitlistRun") this.runActivities = data;
      if (this.dataToShow === "hitlistBike") this.cycleActivities = data;
    },
    showRuns: async function () {
      this.dataToShow = "hitlistRun";
      this.loadData();
    },
    showBikings: async function () {
      this.dataToShow = "hitlistBike";
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
  },
};
</script>

<style scoped>
</style>
