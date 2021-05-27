<template>
  <div class="home">
    <v-main class="pt-2">
      <RankingList />
    </v-main>
  </div>
</template>

<script>
import RankingList from "@/components/RankingList.vue";
export default {
  name: "Home",
  components: {
    RankingList,
  },
};
</script>

<style scoped>
</style>