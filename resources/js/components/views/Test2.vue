<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <!-- <div class="container-fluid"> -->
      <span class="navbar-brand">
        <!-- <button class="btn btn-primary">Add Event</button> -->
      </span>

      <!-- Left Side Of Navbar -->
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <v-btn color="primary" dark class="mr-4" @click="dialog = true">
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
          <!-- <v-spacer></v-spacer> -->
        </li>
      </ul>

      <!-- Right Side Of Navbar -->
      <ul class="navbar-nav ml-auto" v-if="!check">
        <li class="nav-item">
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on" @click="checkSchedule=false">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <router-link to="/test2/day">Day</router-link>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <router-link :to="{name: 'week'}">
                  <v-list-item-title>Week</v-list-item-title>
                </router-link>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <router-link :to="{name: 'month'}">
                  <v-list-item-title>Month</v-list-item-title>
                </router-link>
              </v-list-item>
              <v-list-item @click="checkYear=true">
                <router-link :to="{name: 'year'}">
                  <v-list-item-title>Year</v-list-item-title>
                </router-link>
              </v-list-item>
            </v-list>
          </v-menu>
        </li>
        <li class="nav-item"></li>
      </ul>
      <ul class="navbar-nav ml-auto" v-if="check">
        <li class="nav-item"></li>
      </ul>
      <!-- <router-link to="/test2/day">day</router-link> -->
    </nav>
    <div style="height:600px">
      <router-view :events="events"></router-view>
    </div>
  </div>
</template>

<script>
import Schedule from "./Schedule.vue";
export default {
  components: {
    Schedule
  },
  data: () => ({
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
    computed: {
      routeName() {
        return this.$route.name;
      }
    },
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

  created() {
    console.log(this.$route.name);
    this.getEvents();
  },
  methods: {
    showAddEventOnMonth(date) {
      console.log(date.date);
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
      axios.get("api/get-event").then(response => {
        // console.log(response);
        this.events = response.data;
      });
    },
    addEvent() {
      // this.startEvent = this.startEvent.replace("T", " ");
      // this.endEvent = this.endEvent.replace("T", " ");
      // alert(this.startEvent);
      axios
        .post("api/add-event", {
          name: this.name,
          details: this.details,
          start: this.startEvent,
          end: this.endEvent,
          color: this.color,
          user_id: 1
        })
        .then(response => {
          this.focus = this.startEvent.substr(0, 10);
          this.getEvents();

          this.name = null;
          this.details = null;
          this.startEvent = null;
          this.endEvent = null;
          this.color = "#1976D2";
        });
    },
    updateEvent(ev) {
      axios
        .post("api/add-event", {
          check: true,
          name: ev.name,
          details: ev.details,
          start: ev.startEvent,
          end: ev.endEvent,
          color: ev.color,
          id: ev.id,
          user_id: 1
        })
        .then(response => {
          this.selectedOpen = false;
          this.currentlyEditing = null;
          // console.log(response.data);
        });
    },
    editEvent(id) {
      this.currentlyEditing = id;
    },
    deleteEvent(id) {
      axios.post("api/delete/" + id).then(response => {
        this.selectedOpen = false;
        this.getEvents();
      });
    },
    showDateTime() {
      this.check = false;
      this.checkSchedule = false;
      this.type = "day";
    },

    viewDay({ date }) {
      console.log(date);
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
    showEvent({ nativeEvent, event }) {
      const open = () => {
        // console.log(nativeEvent.target);
        this.selectedEvent = event;
        console.log(this.selectedEvent);

        this.selectedEvent.start = this.selectedEvent.start.replace(" ", "T");
        this.selectedEvent.end = this.selectedEvent.end.replace(" ", "T");
        console.log(this.selectedEvent);
        this.selectedElement = nativeEvent.target;
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
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>
<style scoped>
#year {
  display: flex;
}
</style>
