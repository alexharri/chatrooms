<template>
  <div>
    <room :room="room" />
  </div>
</template>

<script>
import Room from "./Room.vue";

export default {
  name: "MainContainer",
  data: () => ({
    room: "general",
  }),
  components: {
    Room,
  },
};
</script>

<style>

</style>
