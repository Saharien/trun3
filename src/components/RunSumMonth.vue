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

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      apiUrl: "/api/runOverview",
      series: [
        {
          name: "2021",
          data: [],
        },
        // {
        //   name: "2020",
        //   data: [8830.2, 6541.2, 6756.7],
        // },
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

      async function getFetchData(urlToLoad, token) {
        const response = await fetch(urlToLoad, {
          headers: { "x-custom-authorization": `Bearer ${token}` },
        });
        const myJson = await response.json(); //extract JSON from the http response
        return myJson;
      }

      getFetchData(this.apiUrl, token).then((a) => {
        a.data.forEach((element) =>
          this.series[0].data.push(element.totalAmount)
        );
        console.log(this.series);
      });
    },
  },
};
</script>

<style scoped></style>
