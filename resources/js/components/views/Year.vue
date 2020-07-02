<template>
  <div style="padding-top:0">
    <Calendar :data-source="events" @click-day="test" :year="2020" :display-header="true"></Calendar>
  </div>
</template>
  
<script>
// import { db } from "../main";
import Calendar from "v-year-calendar";
export default {
  props: ["events"],
  data() {
    return {
      now: 2021,
      today: new Date().toISOString().substr(0, 10)
    };
  },
  created() {
    console.log(this.today);
  },
  methods: {
    test(e) {
      // console.log(e.date.toLocaleDateString());
      this.$emit("viewDayYear", e);
    }
  },
  components: {
    Calendar
  }
};
</script>
<style scoped>
#list {
  padding-left: 60px;
  padding-top: 0;
  display: flex;
  flex-wrap: wrap;
}
#list-item {
  padding: 40px;
  width: 400px;
  /* height: 400px; */
}
</style>
