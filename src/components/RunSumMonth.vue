<template>
  <v-card title>
    <v-card-title> Laufkilometer je Monat </v-card-title>
    <v-list-item three-line>
      <v-list-item-content>
        <div id="chart">
          <apexchart
            type="line"
            height="350"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { fetchData } from "../api/api";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: "2021",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#46bfe0", "#545454"],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: ["April", "Mai", "Juni"],
          title: {
            text: "Monat",
          },
        },
        yaxis: {
          title: {
            text: "km",
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
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

      fetchData({ funcName: "runOverview", token }).then((a) => {
        a.data.forEach((element) =>
          this.series[0].data.push(element.totalAmount)
        );
      });
    },
  },
};
</script>

<style scoped></style>
