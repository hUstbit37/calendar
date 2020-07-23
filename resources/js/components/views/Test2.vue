<template>
  <v-app>
    <v-content>
      <!-- <button class="btn btn-primary" @click="checkMoreActionData=true">Click</button> -->
      <v-btn color="primary" dark class="mr-4" @click="checkMoreActionData=true">
        <v-icon color="red">mdi-plus</v-icon>Add Event
      </v-btn>
      <v-btn fab text small @click="prev">
        <v-icon small>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn fab text small @click="next">
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>
      <v-divider></v-divider>
      <v-sheet width="1200" height="500">
        <v-calendar
          :now="today"
          v-model="focus"
          ref="calendar"
          @click:event="showEvent"
          type="month"
          :events="events"
        ></v-calendar>
      </v-sheet>

      <v-dialog max-width="680" v-model="checkMoreActionData">
        <v-form @submit.prevent="saveEvent">
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="checkMoreActionData = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Event</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn type="submit" dark text>Save</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col cols="10">
                  <v-text-field dense outlined type="text" label="Event Name" v-model="name"></v-text-field>
                </v-col>
              </v-row>
              <v-text-field dense outlined type="text" label="Event Detail" v-model="details"></v-text-field>
              <v-row>
                <v-col cols="2">
                  <v-subheader>From</v-subheader>
                </v-col>
                <v-col cols="4">
                  <v-text-field :value="today" v-model="startDate" filled rounded dense type="date"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="startTime"
                    v-show="!checkBox"
                    filled
                    rounded
                    dense
                    type="time"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <v-subheader>To</v-subheader>
                </v-col>
                <v-col cols="4">
                  <v-text-field :value="today" v-model="endDate" filled rounded dense type="date"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="endTime"
                    v-show="!checkBox"
                    filled
                    rounded
                    dense
                    type="time"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox dense v-model="checkBox" label="Allday"></v-checkbox>
                </v-col>
                <v-col>
                  <v-checkbox v-model="checkRepeat" label="Repeat"></v-checkbox>
                </v-col>
              </v-row>

              <v-row v-if="checkRepeat">
                <v-col lg="1">
                  <v-subheader>Repeat</v-subheader>
                </v-col>
                <v-col lg="4">
                  <v-text-field v-model="numberRepeat" filled rounded dense type="number"></v-text-field>
                </v-col>
                <v-col lg="3">
                  <v-select
                    v-model="selectedRepeat"
                    :items="items"
                    :menu-props="{ top: true, offsetY: true }"
                    dense
                    filled
                    rounded
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="endDateRepeat"
                    label="End"
                    outlined
                    filled
                    rounded
                    dense
                    type="date"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="selectedRepeat=='week'">
                <v-col lg="2">
                  <v-subheader>on</v-subheader>
                </v-col>
                <v-col lg="10">
                  <v-select
                    :menu-props="{ top: true, offsetY: true }"
                    dense
                    multiple
                    :items="weekdays"
                    v-model="selectedWeekdays"
                    label="Weekdays"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row v-if="selectedRepeat=='month'">
                <v-col lg="2">
                  <v-subheader>Each</v-subheader>
                </v-col>
                <v-col lg="10">
                  <v-select
                    :menu-props="{ top: true, offsetY: true }"
                    dense
                    chips
                    multiple
                    :items="dateInMonth"
                    v-model="selectedDateInMonth"
                    label="Date"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </v-dialog>
      {{toWeekday}}
      {{selectedDateInMonth}}
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
import Axios from "axios";
export default {
  data() {
    return {
      selectedEvent: null,
      dateInMonth: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
      ],
      selectedDateInMonth: [],
      selectedWeekdays: [],
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      a: new Date(),
      endDateRepeat: null,
      numberRepeat: 1,
      selectedRepeat: "day",
      items: ["day", "week", "month"],
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      name: null,
      details: null,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      checkMoreActionData: false,
      checkRepeat: false,
      checkBox: false,
      events: [
        {
          name: "asas",
          details: "asas",
          start: "2020-07-15 15:00",
          end: "2020-07-15 16:00",
          // timed: false
        },
      ],
      url: "../../../../videos/BigBang.mp4",
      countPlay: 0,
      isWindowLoad: false,
    };
  },

  mounted() {
    this.getEvent();

    console.log("test", new Date(1369008000000));
  },
  computed: {
    toWeekday() {
      let arr = [];

      this.selectedWeekdays.forEach((item) => {
        if (item == "Mon") {
          arr.push(1);
        } else if (item == "Tue") {
          arr.push(2);
        } else if (item == "Wed") {
          arr.push(3);
        } else if (item == "Thu") {
          arr.push(4);
        } else if (item == "Fri") {
          arr.push(5);
        } else if (item == "Sat") {
          arr.push(6);
        } else if (item == "Sun") {
          arr.push(0);
        }
      });
      return arr.sort();
    },
  },
  methods: {
    countDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    },
    dayToNextDate(date, day, w) {
      date.setDate(
        date.getDate() + +7 * w + +((+day + (+7 - +date.getDay())) % 7)
      );
      return date;
    },
    saveEvent() {
      if (!this.checkRepeat) {
        this.addOneEvent();
      }
      if (this.checkRepeat) {
        if (this.selectedRepeat == "day") {
          this.addEventRepeatDaily();
        }
        if (this.selectedRepeat == "week") {
          this.addEventRepeatWeekly();
        }
        if (this.selectedRepeat == "month") {
          this.addEventRepeatMonthly();
        }
      }

      this.checkMoreActionData = false;
      this.checkRepeat = false;
      this.checkBox = false;
      this.name = null;
      this.details = null;
      console.log("event", this.events);
    },
    pad(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
    toTimestamp(date) {
      return (
        date.getUTCFullYear() +
        "-" +
        this.pad(date.getUTCMonth() + 1) +
        "-" +
        this.pad(date.getUTCDate()) +
        " " +
        this.pad(date.getUTCHours() + 7) +
        ":" +
        this.pad(date.getUTCMinutes())
      );
    },
    toDate(date) {
      return (
        date.getUTCFullYear() +
        "-" +
        this.pad(date.getUTCMonth() + 1) +
        "-" +
        this.pad(date.getDate())
      );
    },
    showEvent(event) {
      this.selectedEvent = event.event;
      console.log("a", event);

      this.name = this.selectedEvent.name;
      this.details = this.selectedEvent.details;
      if (this.selectedEvent.start.length < 11) {
        this.checkBox = true;
        this.startDate = this.selectedEvent.start;
        this.endDate = this.selectedEvent.end;
      } else {
        this.startDate = this.selectedEvent.start.substr(0, 10);
        this.endDate = this.selectedEvent.end.substr(0, 10);
        this.startTime = this.selectedEvent.start.substr(11, 5);
        this.endTime = this.selectedEvent.end.substr(11, 5);
      }
      this.checkMoreActionData = true;
    },

    getEvent() {
      // db.collection("calEvent4").onSnapshot((event) => {
      //   event.forEach((doc) => {
      //     let appData = doc.data();
      //     appData.id = doc.id;
      //     console.log(doc.id);
      //     this.events.push(appData);
      //   });
      //   console.log(this.events);
      // });
      axios.get("api/get-event").then((response) => {
        response.data.forEach((event) => {
          this.events.push(event);
        });
      });
    },
    // add event when allday+ no repeat or no allday + no repeat

    addOneEvent() {
      let start = this.checkBox
        ? this.startDate
        : this.startDate + " " + this.startTime;
      let end = this.checkBox
        ? this.endDate
        : this.endDate + " " + this.endTime;

      this.events.push({
        name: this.name,
        details: this.details,
        start: start,
        end: end,
      });
      axios.post("api/add-event", {
        name: this.name,
        details: this.details,
        start: start,
        end: end,
        color: "#1976D2",
        user_id: 1,
      });
    },
    //add event allday + repeat daily
    addEventRepeatDaily() {
      let startEvent = new Date(this.startDate);
      // startEvent.setHours(startEvent.getHours() - 7);
      console.log(startEvent.getDate());
      let endEvent = new Date(this.endDate);
      // endEvent.setHours(endEvent.getHours() - 7);
      let endEventRepeat = new Date(this.endDateRepeat);
      // endEventRepeat.setHours(endEventRepeat.getHours() - 7);
      let t = endEvent.getTime() - startEvent.getTime();
      let temp = +endEvent.getDate() + +1 - +startEvent.getDate();
      let repeat = temp <= this.numberRepeat ? this.numberRepeat : temp;
      let events = [];
      while (startEvent.getTime() <= endEventRepeat.getTime()) {
        let start = this.checkBox
          ? this.toDate(startEvent)
          : this.toDate(startEvent) + " " + this.startTime;
        let end = this.checkBox
          ? this.toDate(endEvent)
          : this.toDate(endEvent) + " " + this.endTime;
        events.push({
          name: this.name,
          details: this.details,
          start: start,
          end: end,
          user_id: 1,
          color: "#1976D2",
        });
        this.events.push({
          name: this.name,
          details: this.details,
          start: start,
          end: end,
          user_id: 1,
          color: "#1976D2",
        });
        startEvent.setDate(+startEvent.getDate() + +repeat);
        endEvent.setDate(+endEvent.getDate() + +repeat);
      }

      axios.post("api/add-event", { events: events }).then((response) => {
        console.log(response.data);
      });
    },

    addEventRepeatWeekly() {
      console.log("add weekly");
      let startEvent = new Date(this.startDate);
      // console.log("start old", startEvent);
      let endEvent = new Date(this.endDate);
      let endEventRepeat = new Date(this.endDateRepeat);
      let k = +endEvent.getDate() - +startEvent.getDate();
      let events = [];
      this.toWeekday.forEach((item) => {
        console.log(startEvent.getDate());
        let t = +item - +startEvent.getDay();
        console.log("item", item);
        let startEvent1 = new Date(this.startDate);
        let endEvent1 = new Date(this.endDate);
        if (+t >= 0) {
          startEvent1.setDate(+startEvent1.getDate() + +t);
        } else {
          startEvent1.setDate(
            +startEvent.getDate() + +t + 7 * this.numberRepeat
          );
        }
        console.log(this.toDate(startEvent1));
        endEvent1.setDate(+startEvent1.getDate() + +k);
        do {
          console.log("starte1", this.toDate(startEvent1));
          let start = this.checkBox
            ? this.toDate(startEvent1)
            : this.toDate(startEvent1) + " " + this.startTime;
          let end = this.checkBox
            ? this.toDate(endEvent1)
            : this.toDate(endEvent1) + " " + this.endTime;
          this.events.push({
            name: this.name,
            details: this.details,
            start: start,
            end: end,
          });
          startEvent1.setDate(+startEvent1.getDate() + +7 * this.numberRepeat);
          endEvent1.setDate(+startEvent1.getDate() + +k);
        } while (startEvent1.getTime() < endEventRepeat.getTime());
      });
      console.log(this.events);
    },

    addEventRepeatMonthly() {
      let startEvent = new Date(this.startDate);
      // console.log("start old", startEvent);
      let endEvent = new Date(this.endDate);
      let endEventRepeat = new Date(this.endDateRepeat);
      let k = +endEvent.getDate() - +startEvent.getDate();
      let events = [];
      this.selectedDateInMonth.forEach((item) => {
        console.log(startEvent.getDate());
        let t = +item - +startEvent.getDate();
        console.log("item", item);
        let startEvent1 = new Date(this.startDate);
        let endEvent1 = new Date(this.endDate);
        if (+t >= 0) {
          console.log("t", t);
          startEvent1.setDate(+startEvent1.getDate() + +t);
        } else {
          startEvent1.setMonth(+startEvent.getMonth() + +1 * this.numberRepeat);
          startEvent1.setDate(item);
        }
        // console.log(this.toDate(startEvent1));
        endEvent1.setDate(+startEvent1.getDate() + +k);
        endEvent1.setMonth(startEvent1.getMonth());

        do {
          console.log("starte1", this.toDate(startEvent1));
          let start = this.checkBox
            ? this.toDate(startEvent1)
            : this.toDate(startEvent1) + " " + this.startTime;
          let end = this.checkBox
            ? this.toDate(endEvent1)
            : this.toDate(endEvent1) + " " + this.endTime;
          this.events.push({
            name: this.name,
            details: this.details,
            start: start,
            end: end,
          });
          startEvent1.setMonth(
            +startEvent1.getMonth() + +1 * this.numberRepeat
          );

          endEvent1.setDate(+startEvent1.getDate() + +k);
          endEvent1.setMonth(startEvent1.getMonth());
        } while (startEvent1.getTime() < endEventRepeat.getTime());
      });
    },
    addEvent() {
      let startEvent = this.startDate + " " + this.startTime;
      let endEvent = this.endDate + " " + this.endTime;
      let startEventTime = new Date(startEvent);
      console.log("tam", this.toTimestamp(startEventTime));
      let endEventTime = new Date(endEvent);
      let endEventTime1 = endEventTime.getTime();

      let startEventTime1 = startEventTime.getTime();
      // console.log(this.toTimestamp(new Date(startEventTime1)));

      while (startEventTime1 <= endEventTime1) {
        let start = this.toTimestamp(new Date(startEventTime1));
        let test = new Date(startEventTime1);
        test.setDate(test.getDate() + this.numberRepeat);
        test.setHours(endEventTime.getHours());
        test.setMinutes(endEventTime.getMinutes());
        test.setSeconds(endEventTime.getSeconds());
        let end = this.toTimestamp(test);
        let events = [];
        startEventTime1 = startEventTime1 + this.numberRepeat * 86400000;
        this.events.push({
          name: this.name,
          details: this.details,
          start: start,
          end: end,
        });
      }

      console.log(this.events);
    },
    onWindowLoad() {
      this.isWindowLoad = true;
    },
    count() {
      if (this.isWindowLoad) {
        this.countPlay += 1;
        db.collection("testDbFirebase").update({
          count: this.countPlay,
        });
      }
      this.isWindowLoad = false;
    },
    async testDbFirebase() {
      let snapshot = await db.collection("testCountLike").get();
      console.log(snapshot);
      let count = 0;
      snapshot.forEach((doc) => {
        console.log(doc.data().count);
        this.countPlay = doc.data().count;
      });
    },
  },
  prev() {
    this.$refs.calendar.prev();
  },
  next() {
    this.$refs.calendar.next();
  },
};
</script>

<style>
</style>