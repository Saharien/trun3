<template>
  <div class="dashboard">
    <v-main class="pt-4 pl-4">
      <LongestRuns />
    </v-main>
  </div>
</template>

<script>
import LongestRuns from "@/components/LongestRuns.vue";
export default {
  name: "Dashboard",
  components: {
    LongestRuns,
  },
};
</script>

<style scoped>
</style>