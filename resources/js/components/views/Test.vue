<template>
  <v-row class="fill-height">
    <v-col style="padding-top:0">
      <!-- Thanh toolbar -->

      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn color="primary" dark class="mr-4" @click="openDialogAddEvent">
            <v-icon color="red">mdi-plus</v-icon>Add Event
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">Today</v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn text @click="check=true">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-icon>mdi-menu-down</v-icon>
            <!-- <v-icon small>mdi-arrow-down-drop-circle-outline</v-icon> -->
          </v-btn>
          <v-dialog v-model="check" width="300">
            <v-date-picker @click:date="showDateTime" v-model="focus"></v-date-picker>
          </v-dialog>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span v-if="checkSchedule">Schedule</span>
                <span v-else-if="checkYear">Year</span>
                <span v-else>{{ typeToLabel[type]}}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="showDay">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showWeek">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showMonth">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>

              <v-list-item @click="show4Day">
                <v-list-item-title>4 Days</v-list-item-title>
              </v-list-item>
              <v-list-item @click="checkYear=true">
                <v-list-item-title>Year</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showSchedule">
                <v-list-item-title>Schedule</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-sheet height="600" v-if="!checkSchedule && !checkYear">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @dbclick:day="showAddEventOnMonth"
            @dbclick:time="showAddEventOnMonth"
            @mousedown:event="startDrag"
            @mousedown:time="startTime"
            @mousemove:day="mouseMoveDayOnMonth"
            @mousemove:time="mouseMove"
            @mouseup:day="endDragMonth"
            @mouseup:time="endDrag"
            @change="updateRange"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="en"
            :short-weekdays="false"
          >
            <template #event="{ event, timed}">
              <div class="v-event-draggable" v-html="getEventHtml(event, timed)"></div>
              <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
            </template>
          </v-calendar>
        </v-sheet>

        <!-- Modal Add Event -->
        <v-dialog width="500" v-model="dialog">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addOneEvent">
                <v-text-field type="text" label="Event Name" v-model="name"></v-text-field>
                <v-text-field type="text" label="Event Detail" v-model="details"></v-text-field>

                <v-text-field type="datetime-local" label="Start date" v-model="startEvent"></v-text-field>
                <v-text-field
                  :min="startEvent"
                  type="datetime-local"
                  label="End date"
                  v-model="endEvent"
                ></v-text-field>
                <v-text-field type="color" label="Color" v-model="color"></v-text-field>
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click.stop="dialog = false"
                >Add Event</v-btn>
                <v-btn depressed @click="checkMoreAction()">More Action</v-btn>
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>

        <edit-event-dialog
          v-if="checkMoreActionData"
          :key="selectedEvent"
          :selectedEvent="selectedEvent"
          :checkMoreActionData="checkMoreActionData"
          @closeEditEventDialog="closeEditEventDialog"
          @addOrUpdateEvent="addOrUpdateEvent"
        ></edit-event-dialog>

        <!-- Show event and edit -->
        <v-menu
          v-model="selectedOpen"
          min-width="350"
          :activator="selectedElement"
          :close-on-content-click="false"
        >
          <v-card color="grey lighten-4" width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="deleteEvent(selectedEvent.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <v-form v-if="currentlyEditing !== selectedEvent.id">
                <b>{{selectedEvent.details}}</b>
                <v-divider></v-divider>
                <br />
                <v-icon>mdi-calendar-text</v-icon>
                {{selectedEvent.start}}
                <br />
                <v-icon color="purple darken-2">mdi-arrow-down-bold</v-icon>
                <br />
                <v-icon>mdi-calendar-text</v-icon>
                {{selectedEvent.end}}
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                <v-icon>mdi-close-octagon</v-icon>Cancel
              </v-btn>
              <v-btn
                text
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent.id)"
              >
                <v-icon small>mdi-eyedropper</v-icon>Edit
              </v-btn>

              <!-- <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                <v-icon>mdi-check-circle</v-icon>Ok
              </v-btn>-->
            </v-card-actions>
          </v-card>
        </v-menu>

        <Year @viewDayYear="viewDayYear" :events="events" v-if="checkYear"></Year>
        <Schedule
          @showAddEventOnSchedule="showAddEventOnSchedule"
          :search="search"
          @daySchedule="daySchedule"
          :events="events"
          v-if="checkSchedule && !checkYear"
        ></Schedule>
        <v-snackbar v-model="snackbar" width="80px" timeout="2000">Event saved</v-snackbar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "../../app.js";
import Schedule from "./Schedule.vue";
import Year from "./Year.vue";
import EditEventDialog from "./EditEventDialog.vue";
export default {
  components: {
    Schedule,
    Year,
    EditEventDialog
  },
  data: () => ({
    checkMoreActionData: false,
    snackbar: false,
    dragTime: null,
    dragEvent: null,
    dragStart: null,
    lastEvent: "",
    createEvent: null,
    createStart: null,
    extendOriginal: null,

    search: "",
    checkSchedule: false,
    checkYear: false,
    check: false,
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
      year: "year"
    },
    startEvent: null,
    endEvent: null,
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],

    name: null,
    details: null,
    color: "#1976D2",
    dialog: false,
    currentlyEditing: null
  }),

  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      console.log(startMonth);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "Asia/Ho_Chi_Minh",
        month: "long"
      });
    }
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.getEvents();
  },
  updated() {
    if (this.search) {
      this.showSchedule();
    }
  },

  methods: {
    checkMoreAction() {
      this.checkMoreActionData = true;
      this.dialog = false;
    },
    toDate(tms) {
      return typeof tms === "string"
        ? new Date(tms)
        : new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute);
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
    extendBottom(event) {
      console.log("extend");
      console.log(event);
      this.createEvent = event;
      this.createStart = this.toDate(event.start);
      this.extendOriginal = event.end;
    },
    getEventHtml(event, timed) {
      const cal = this.$refs.calendar;
      let name = event.name ? event.name : "No title";

      if (timed) {
        return `<strong>${name} <br></strong>${event.start} - ${event.end}`;
      } else {
        return `<strong>${name}</strong> `;
      }
    },

    startDrag(e) {
      if (e.event && e.timed) {
        this.dragEvent = e.event;
        // console.log(this.dragEvent);
        this.dragTime = null;
        this.extendOriginal = null;
      } else {
        this.dragEvent = e.event;
      }
    },
    startTime(e) {
      // console.log("mousedown time", e);
      const mouse = this.toDate(e);
      // console.log(mouse);
      if (this.dragEvent && this.dragTime === null) {
        const start = this.toDate(this.dragEvent.start);

        this.dragTime = mouse.getTime() - start.getTime();
      }
    },
    mouseMove(tms) {
      // console.log("mouse Move", tms);
      if (this.dragEvent && this.dragTime !== null) {
        const start = this.toDate(this.dragEvent.start);
        const end = this.toDate(this.dragEvent.end);
        const duration = end.getTime() - start.getTime();
        // console.log("Mouse move if", duration);
        const mouse = this.toDate(tms);
        const newStartTime = mouse.getTime() - this.dragTime;
        const newEnd = newStartTime + duration;
        let t = new Date();
        t.setTime(newStartTime);
        this.dragEvent.start = this.toTimestamp(t);

        t.setTime(newEnd);
        this.dragEvent.end = this.toTimestamp(t);
        // console.log(this.dragEvent);
        this.updateEvent(this.dragEvent);
        setTimeout(() => {
          this.snackbar = true;
        }, 1000);
      } else if (this.createEvent && this.createStart !== null) {
        const mouse = this.toDate(tms).getTime();
        // console.log("test2", mouse);
        const mouseRounded = this.roundTime(mouse, false);
        // console.log("test", mouseRounded);
        const min = Math.min(mouseRounded, this.createStart);
        // console.log("test2", min);
        const max = Math.max(mouseRounded, this.createStart);

        this.createEvent.start = this.toTimestamp(new Date(min));
        this.createEvent.end = this.toTimestamp(new Date(max));
        console.log(this.createEvent);
        this.updateEvent(this.createEvent);
        // this.snackbar = true;
        setTimeout(() => {
          this.snackbar = true;
        }, 1000);
      }
      // console.log(a);
    },
    mouseMoveDayOnMonth(tms) {
      // console.log("move Month", this.toDate(tms));
      if (this.dragEvent) {
        const start = this.toDate(this.dragEvent.start);
        const end = this.toDate(this.dragEvent.end);
        const duration = end.getTime() - start.getTime();
        // console.log("dragEvent.start", this.dragEvent.start);
        const mouse = this.toDate(tms);
        mouse.setHours(start.getHours());
        mouse.setMinutes(start.getMinutes());
        mouse.setSeconds(start.getSeconds());
        // console.log("mouse", mouse);
        const newStartTime = mouse.getTime();
        const newEnd = newStartTime + duration;
        let t = new Date();
        t.setTime(newStartTime);
        this.dragEvent.start = this.toTimestamp(t);
        t.setTime(newEnd);
        this.dragEvent.end = this.toTimestamp(t);

        this.updateEvent(this.dragEvent);

        setTimeout(() => {
          this.snackbar = true;
        }, 1000);
      }
    },
    roundTime(time, down = true) {
      const roundDownTime = 15 * 60 * 1000; // 15 minutes

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    endDragMonth(e) {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    endDrag(e) {
      // console.log("mouseup time endDrag", e);
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    showAddEventOnMonth(date) {
      // console.log(date.date);
      if (date.time) {
        this.startEvent = date.date + "T" + date.time;
        this.endEvent = date.date + "T" + date.time;
      } else {
        this.startEvent = date.date + "T00:00";
        this.endEvent = date.date + "T00:00";
      }

      this.dialog = true;
    },
    daySchedule(ev) {
      this.focus = ev;
      this.type = "day";
      this.checkSchedule = false;
    },
    getEvents() {
      console.log("getEvent");

      db.collection("calEvent").onSnapshot(event => {
        let events = [];
        event.forEach(doc => {
          let appData = doc.data();
          appData.id = doc.id;
          // console.log(doc.id);
          events.push(appData);
        });
        this.events = events;
        this.events.push({
          name: "event default",
          details: "test1",
          start: "2020-07-14",
          end: "2020-07-14",
          color: "#1976D2"
        });
        // console.log("event all", this.events);
      });
    },
    addOrUpdateEvent(e) {
      console.log("addOrUpdateEvent", e);
      e.forEach(event => {
        if (typeof this.selectedEvent.start !== "undefined") {
          console.log("start update", event);
          this.updateEvent(event);
        } else {
          this.events.push(event);
          db.collection("calEvent")
            .add({
              name: event.name,
              details: event.details,
              start: event.start,
              end: event.end,
              color: event.color
            })
            .then(() => {
              console.log("add done");
            });
        }
      });
    },

    addOneEvent() {
      db.collection("calEvent")
        .add({
          name: this.name,
          details: this.details,
          start: this.startEvent,
          end: this.endEvent,
          color: this.color
        })
        .then(() => {
          console.log("add done");
        });

      this.name = null;
      this.details = null;
      this.startEvent = null;
      this.endEvent = null;
      this.color = "#1976D2";
    },
    updateEvent(ev) {
      console.log(ev);
      let id =
        typeof this.selectedEvent.start !== "undefined"
          ? this.selectedEvent.id
          : ev.id;
      console.log(this.selectedEvent);
      db.collection("calEvent")
        .doc(id)
        .update({
          name: ev.name,
          details: ev.details,
          start: ev.start,
          end: ev.end,
          color: ev.color
        })
        .then(() => {
          console.log("update done");
          this.selectedOpen = false;
          this.currentlyEditing = null;
        });
    },
    editEvent(id) {
      this.currentlyEditing = id;
      this.checkMoreActionData = true;
      this.selectedOpen = false;
    },
    deleteEvent(id) {
      if (window.confirm("Do you really want to delete?")) {
        db.collection("calEvent")
          .doc(id)
          .delete()
          .then(() => {
            console.log("Document deleted!");
            this.selectedOpen = false;
            this.currentlyEditing = null;
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    showDateTime() {
      this.check = false;
      this.checkSchedule = false;
      this.type = "day";
    },

    viewDay({ date }) {
      // console.log(date);
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      // console.log(event);
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ event, nativeEvent }) {
      const open = () => {
        this.selectedEvent = event;
        console.log(this.selectedEvent);
        this.selectedEvent.start = this.selectedEvent.start;
        this.selectedEvent.end = this.selectedEvent.end;
        this.selectedElement = nativeEvent.target;
        console.log("1", this.selectedElement);
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },

    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    showDay() {
      this.type = "day";
      this.checkYear = false;
      this.checkSchedule = false;
    },
    showWeek() {
      this.type = "week";
      this.checkYear = false;
      this.checkSchedule = false;
    },
    showMonth() {
      this.type = "month";
      this.checkYear = false;
      this.checkSchedule = false;
    },
    show4Day() {
      this.type = "4day";
      this.checkYear = false;
      this.checkSchedule = false;
    },
    showSchedule() {
      this.checkYear = false;
      this.checkSchedule = true;
    },
    viewDayYear(e) {
      console.log(e);
      this.focus = e.date;
      this.type = "day";
      this.checkYear = false;
    },
    showAddEventOnSchedule(e) {
      console.log(e);
    },
    closeEditEventDialog() {
      this.checkMoreActionData = false;
      // this.selectedEvent = {};
    },
    openDialogAddEvent() {
      this.dialog = true;
      this.selectedEvent = {};
    }
  }
};
</script>
<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}
.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}
.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;
  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }
  &:hover::after {
    display: block;
  }
}
</style>
