<template>
  <div class="some-container">
    <message-list :messages="messages(room)" />
    <message-form :room="room" />
  </div>
</template>

<script>
/**
 * A room consists of a few things.
 *  - The message form
 *  - The message list
 *  - List of people in the room.
 */
import { mapGetters } from "vuex";

import MessageForm from "./MessageForm.vue";
import MessageList from "./MessageList.vue";

export default {
  name: "Room",
  props: ["room"],
  computed: {
    ...mapGetters({
      messages: "messages",
    }),
  },
  components: {
    MessageList,
    MessageForm,
  },
};

</script>

<style scoped>
  
.some-container {
  display: flex;
  flex-direction: column;

  flex-grow: 1;
}

</style>
