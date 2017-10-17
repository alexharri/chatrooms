<template>
  <ul>
    <li v-for="message in messages">
      {{ message.username }}: {{ message.text }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "MessageList",
  props: ["messages"],
};
</script>

<style scoped>
  ul {
    list-style-type: none;
  }
</style>