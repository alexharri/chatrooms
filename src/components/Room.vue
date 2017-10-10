<template>
  <div>
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
import socket from "../../socket/socket";

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
  created() {
    console.log(this.$store);
    socket.on(`${this.room}:msg`, (data) => {
      console.log(data);
      // this.messages[this.room].push(data);
    });
  },
  components: {
    MessageList,
    MessageForm,
  },
};

</script>

<style scoped></style>
