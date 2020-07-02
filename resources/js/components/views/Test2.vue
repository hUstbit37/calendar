<template>
  <v-app>
    <v-content>
      <v-calendar @click:event="showEvent" type="month" :events="events"></v-calendar>
      <br />
      <button class="btn btn-danger" @click="addEvent">Click</button>
    </v-content>
  </v-app>
  <!-- <div> -->
  <!-- <video controls width="640px" @click="count()">
      <source :src="url" type="video/mp4" />
    </video>
    <br />
    <button class="btn btn-danger" @click="testDbFirebase">Click</button>
  {{countPlay}}-->

  <!-- </div> -->
</template>

<script>
import { db } from "../../app.js";
import { app } from "firebase";
export default {
  data() {
    return {
      events: [],
      url: "../../../../videos/BigBang.mp4",
      countPlay: 0,
      isWindowLoad: false
    };
  },
  created() {
    window.addEventListener("load", this.onWindowLoad);
  },
  mounted() {
    this.getEvent();
    // this.testDbFirebase();
    //1 day: 86400000
    let temp = 0;
  },
  methods: {
    showEvent(event) {
      let test = event.event;
      console.log(test.color);
    },
    toTimestamp(date) {
      return `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },

    getEvent() {
      db.collection("calEvent").onSnapshot(event => {
        event.forEach(doc => {
          let appData = doc.data();
          appData.id = doc.id;
          console.log(doc.id);
          this.events.push(appData);
        });
        console.log(this.events);
      });
    },
    addEvent() {
      let startEvent = "2020-07-01 10:30:00";
      let endEvent = "2020-07-10 11:30:00";
      let startEventTime = new Date(startEvent);
      let endEventTime = new Date(endEvent);
      let endEventTime1 = endEventTime.getTime();
      let startEventTime1 = startEventTime.getTime();

      while (startEventTime1 <= endEventTime1) {
        let start = this.toTimestamp(new Date(startEventTime1));
        let test = new Date(startEventTime1);
        test.setHours(endEventTime.getHours());
        test.setMinutes(endEventTime.getMinutes());
        test.setSeconds(endEventTime.getSeconds());
        let end = this.toTimestamp(test);
        let events = [];
        startEventTime1 += 86400000;
        this.events.push({
          name: "Test1",
          details: "Test firebase",
          start: start,
          end: end,
          color: "green"
        });
      }
      this.events.forEach(item => {
        db.collection("calEvent")
          .add(item)
          .then(() => {
            console.log("add done");
          });
      });
      console.log(this.events);
    },
    onWindowLoad() {
      this.isWindowLoad = true;
    },
    count() {
      if (this.isWindowLoad) {
        this.countPlay += 1;
        db.collection("testDbFirebase").update({
          count: this.countPlay
        });
      }
      this.isWindowLoad = false;
    },
    async testDbFirebase() {
      let snapshot = await db.collection("testCountLike").get();
      console.log(snapshot);
      let count = 0;
      snapshot.forEach(doc => {
        console.log(doc.data().count);
        this.countPlay = doc.data().count;
      });
    }
  }
};
</script>

<style>
</style>