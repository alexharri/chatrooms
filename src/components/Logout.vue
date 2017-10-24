<template>
  <button class="logout-button" v-on:click="logout">Log out</button>
</template>

<script>
import store from "../store";

import { LOCAL_AUTH_KEY as localAuthKey } from "../constants";

export default {
  name: "Logout",
  methods: {
    logout() {
      store.commit("LOGOUT");
      localStorage.removeItem(localAuthKey);
    },
  },
};
</script>

<style scoped>

.logout-button {
  display: block;
  width: 100%;
  padding: 8px 0;
}

</style>