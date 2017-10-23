<template>
  <div id="app">
    <login v-if="!loggedIn" :onLogin="onLogin" />
    <tabs v-else />
  </div>
</template>

<script>
import Tabs from "./components/Tabs.vue";
import Login from "./components/Login.vue";

export default {
  name: "app",
  data: () => ({
    loggedIn: false,
  }),
  methods: {
    onLogin() {
      this.loggedIn = true;
    },
  },
  components: {
    Tabs,
    Login,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
