<template>
  <div class="dashboard">
    <v-main class="pt-4 pl-4">
      <LongestRuns />
      <LongestBikings class="pb-4" />
      <RunSumMonth class="pb-4" />
    </v-main>
  </div>
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

<style scoped>
</style>