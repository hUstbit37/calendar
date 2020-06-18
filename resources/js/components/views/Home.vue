<template>
  <v-row class="fill-height">
    <v-col style="padding-top:0">
      <!-- Thanh toolbar -->
      <v-sheet height="64">
        <v-toolbar flat color="white">
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

          <!-- <v-avatar size="36">
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>-->
        </v-toolbar>
      </v-sheet>
      <!-- <v-date-picker v-if="checkYear" full-width="true" no-title v-model="today" type="month"></v-date-picker> -->
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
            @click:day="showAddEventOnMonth"
            @click:time="showAddEventOnMonth"
            @change="updateRange"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="en"
            :short-weekdays="false"
          ></v-calendar>
        </v-sheet>

        <!-- Modal Add Event -->
        <v-dialog width="500" v-model="dialog">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addEvent">
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
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
        <!-- Show event and edit -->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
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
                <v-divider :inset="inset"></v-divider>
                <br />
                <v-icon>mdi-calendar-text</v-icon>
                {{selectedEvent.start}}
                <br />
                <v-icon color="purple darken-2">mdi-arrow-down-bold</v-icon>
                <br />
                <v-icon>mdi-calendar-text</v-icon>
                {{selectedEvent.end}}
              </v-form>

              <v-form v-else>
                <v-text-field type="text" v-model="selectedEvent.name" label="Name"></v-text-field>
                <v-text-field type="text" v-model="selectedEvent.details" label="Details"></v-text-field>
                <v-text-field
                  :value="selectedEvent.start.replace(' ', 'T')"
                  v-model="selectedEvent.start"
                  type="datetime-local"
                  label="Start date"
                ></v-text-field>

                <v-text-field
                  :min="selectedEvent.start"
                  type="datetime-local"
                  label="End date"
                  v-model="selectedEvent.end"
                ></v-text-field>
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

              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                <v-icon>mdi-check-circle</v-icon>Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <Test @viewDayYear="viewDayYear" :events="events" v-if="checkYear"></Test>
        <Schedule
          @showAddEventOnSchedule="showAddEventOnSchedule"
          :search="search"
          @daySchedule="daySchedule"
          :events="events"
          v-if="checkSchedule && !checkYear"
        ></Schedule>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import Schedule from "./Schedule.vue";
import Test from "./Test.vue";
export default {
  components: {
    Schedule,
    Test
  },
  data: () => ({
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
  },
  updated() {
    if (this.search) {
      this.showSchedule();
    }
  },
  created() {
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
      // this.sEvent = e.start.replace(" ", "T");
      // this.endEvent = e.end.replace(" ", "T");
      // this.showEvent({ nativeEvent, e });
      // this.dialog = true;
    }
  }
};
</script>
<style scoped>
#year {
  display: flex;
}
</style>
