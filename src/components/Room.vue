<template>
  <div>
    <message-list :messages="messages[room]" />
    <message-form :room="room" />
  </div>
</template>

<script>
import socket from "../../socket/socket";

import MessageForm from "./MessageForm.vue";
import MessageList from "./MessageList.vue";

export default {
  name: "Room",
  props: ["room"],
  data: () => ({
    messages: {
      general: [{ userId: "abc", text: "Hello" }],
    },
  }),
  created() {
    socket.on(`${this.room}:msg`, (data) => {
      console.log(data);
      this.messages[this.room].push(data);
    });
  },
  components: {
    MessageList,
    MessageForm,
  },
};

</script>

<style scoped></style>
