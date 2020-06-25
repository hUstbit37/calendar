<template>
  <video controls width="640px">
    <source :src="url" type="video/mp4" />
  </video>
</template>

<script>
export default {
  data() {
    return {
      url: "../../../../videos/BigBang.mp4"
    };
  }
};
</script>

<style>
</style>