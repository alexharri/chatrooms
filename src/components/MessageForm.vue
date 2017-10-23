<template>
  <form v-on:submit="onSubmit" autocomplete="off">
    <input type="text" id="message-input" v-model="message" autocomplete="off">
    <button type="submit">Send</button>
  </form>
</template>

<script>
import { emit } from "../socket";

export default {
  name: "MessageForm",
  props: ["room"],
  data: () => ({
    message: "",
  }),
  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();

      emit("msg", this.room, this.message);
      this.message = "";
    },
  },
  mounted() {
    document.getElementById("message-input").focus();
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