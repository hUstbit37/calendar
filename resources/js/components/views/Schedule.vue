<template>
  <div>
    <v-data-table
      @click:row="showAddEventOnSchedule"
      :headers="headers"
      :items="events"
      :search="search"
    >
      <template v-slot:item.name="{ item }">
        <span id="itemName">
          <strong>{{ item.name }}</strong>
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["events", "search"],
  data() {
    return {
      checkFooter: false,
      headers: [
        { text: "Name", align: "start", value: "name" },
        { text: "Start", value: "start" },
        { text: "End", value: "end" },
        { text: "Details", value: "details" }
      ]
    };
  },
  created() {
    // this.getEvents();
  },

  methods: {
    showAddEventOnSchedule(e) {
      this.$emit("showAddEventOnSchedule", e);
    },
    // getEvents() {
    //   axios.get("api/get-event").then(response => {
    //     console.log(response);
    //     this.events = response.data;
    //   });
    // },
    showDay(ev) {
      this.$emit("daySchedule", ev);
    }
  },
  destroyed() {
    console.log("destroyed");
  }
};
</script>

<style scoped>
#itemName {
  font-weight: bold;
  cursor: pointer;
}

/* #itemName:hover {
  background-color: blue;
  color: #fff;
  border-radius: 5px;
} */
</style>