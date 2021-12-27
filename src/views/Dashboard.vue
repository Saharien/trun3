<template>
  <v-row>
    <v-col cols="4">
      <LongestRuns />
    </v-col>
    <v-col cols="4">
      <LongestBikings class="pb-4" />
    </v-col>
    <v-col cols="4">
      <RunSumMonth class="pb-4" />
    </v-col>
  </v-row>
</template>

<script>
import LongestRuns from "@/components/LongestRuns.vue";
import LongestBikings from "@/components/LongestBikings.vue";
import RunSumMonth from "@/components/RunSumMonth.vue";
export default {
  name: "Dashboard",
  components: {
    LongestRuns,
    LongestBikings,
    RunSumMonth,
  },
};
</script>

<style scoped></style>
