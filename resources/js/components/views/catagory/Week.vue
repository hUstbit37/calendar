<template>
  <v-calendar ref="calendar" type="week" :now="today" :events="events"></v-calendar>
</template>

<script>
export default {
  props: ["events", "today"],
  mounted() {
    this.$refs.calendar.checkChange();
  }
};
</script>

<style>
</style>