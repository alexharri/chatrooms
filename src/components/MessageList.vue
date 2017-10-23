<template>
  <ul id="message-container">
    <li v-for="message in messages" :id="`message:${message.id}`">
      {{ message.username }}: {{ message.text }}
    </li>
  </ul>
</template>

<script>

import store from "../store";

export default {
  name: "MessageList",
  props: ["messages", "room"],
  data: () => ({
    shouldScrollDown: false,
  }),
  methods: {
    readMessages() {
      if (!store.getters.unread(this.room)) { return; }

      // Credit goes to https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
      function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
          rect.top  >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight  || document.documentElement.clientHeight) &&
          rect.right  <= (window.innerWidth   || document.documentElement.clientWidth)
        );
      }

      const unread = this.messages.filter(message => !message.read);
      for (let i = 0; i < unread.length; i += 1) {
        const el = document.getElementById(`message:${unread[i].id}`);
        if (isElementInViewport(el)) {
          store.commit("READ_MESSAGE", { messageId: unread[i].id, room: this.room });
        }
      }
    },
  },
  beforeUpdate() {
    /**
     * We only want to scroll down one message if the user is already
     * at the bottom of the message list.
     */
    const el = document.getElementById("message-container");
    this.shouldScrollDown = (el.scrollTop + el.clientHeight) === el.scrollHeight;
  },
  updated() {
    /**
     * Bumps down so that the new message is shown.
     */
    if (this.shouldScrollDown) {
      const el = document.getElementById("message-container");
      el.scrollTop = el.scrollHeight;
    }
    this.readMessages();
  },
  mounted() {
    document.getElementById("message-container").addEventListener("scroll", this.readMessages);
  },
  beforeDestroy() {
    document.getElementById("message-container").removeEventListener("scroll", this.readMessages);
  },
};
</script>

<style scoped>

ul {
  list-style-type: none;
  padding: 16px;
  overflow-y: scroll;
}

li {
  margin-bottom: 8px;
}

</style>