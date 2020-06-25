<template>
  <div style="padding-top:0">
    <!-- <v-divider></v-divider>

    <div id="list">
      <div v-for="(item,index) in 12" :key="index" id="list-item">
        <span>
          <strong>Tháng {{item}}</strong>
        </span>
        <v-calendar
          @click:date="viewDay"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          v-model="focus[index]"
          type="month"
          :now="today"
        ></v-calendar>
      </div>
    </div>
    <v-divider></v-divider>-->
    <!-- <v-date-picker no-title prev-icon="false" next-icon :value="today" :reactive="true"></v-date-picker> -->

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
      today: new Date().toISOString().substr(0, 10),
      focus: [
        "2020-01-01",
        "2020-02-01",
        "2020-03-01",
        "2020-04-01",
        "2020-05-01",
        "2020-06-01",
        "2020-07-01",
        "2020-08-01",
        "2020-09-01",
        "2020-10-01",
        "2020-11-01",
        "2020-12-01"
      ]
    };
  },
  created() {
    console.log(this.today);
  },
  methods: {
    viewDay(e) {
      // console.log(e);
      // this.$emit("viewDayYear", e);
    },
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
