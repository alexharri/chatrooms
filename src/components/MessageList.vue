<template>
  <ul>
    <li v-for="message in messages">
      {{ message.userId }}: {{ message.text }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "MessageList",
  props: ["messages"],
  created() {
    console.log(this.messages);
  },
};
</script>

<style scoped>
  ul {
    list-style-type: none;
  }
</style>