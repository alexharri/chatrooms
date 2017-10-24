<template>
  <div id="app">
    <login v-if="!isLoggedIn" />
    <tabs v-else />
  </div>
</template>

<script>

import { mapGetters } from "vuex";

import Tabs from "./components/Tabs.vue";
import Login from "./components/Login.vue";

export default {
  name: "app",
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
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
