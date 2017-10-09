<template>
  <form v-on:submit="onSubmit">
    <input type="text" id="message-input" v-model="message">
    <button type="submit">Send</button>
  </form>
</template>

<script>
import socket from "../../socket/socket";

export default {
  name: "MessageForm",
  props: ["room"],
  data: () => ({
    message: "",
  }),
  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();

      socket.emit("msg", { room: this.room, text: this.message });
      this.message = "";
    },
  },
};
</script>

<style scoped>

form {
  display: flex;
  height: 50px;
}

input {
  flex-grow: 1;
  font-size: 1.25em;
  padding: 8px;
}

</style>