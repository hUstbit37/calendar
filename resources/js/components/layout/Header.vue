<template>
  <div>
    <v-navigation-drawer app>
      <v-row justify="center">
        <v-date-picker v-model="picker"></v-date-picker>
      </v-row>
    </v-navigation-drawer>
    <v-app-bar app></v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picker: new Date().toISOString().substr(0, 10)
    };
  }
};
</script>

<style>
</style>