<template>
  <v-calendar ref="calendar" type="day" :now="today" :events="events"></v-calendar>
</template>

<script>
export default {
  props: ["events", "today"],
  data() {
    return {};
  },
  mounted() {
    this.$refs.calendar.checkChange();
  }
};
</script>

<style>
</style>