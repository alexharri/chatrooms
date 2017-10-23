<template>
  <ul id="message-container">
    <li v-for="message in messages">
      {{ message.username }}: {{ message.text }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "MessageList",
  props: ["messages"],
  data: () => ({
    shouldScrollDown: false,
  }),
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