<template>
  <form class="login-form" v-on:submit="onSubmit">
    <h2>Login</h2>
    <div v-if="hasError" class="error-block">{{error}}</div>
    <label for="username">
      <div>Username</div>
      <input autofocus v-model="username" type="username" id="username">
    </label>
    <label for="password">
      <div>Password</div>
      <input v-model="password" type="password" id="password">
    </label>
    <button type="submit">Login</button>
  </form>
</template>

<script>
import store from "../store";

import { LOCAL_AUTH_KEY as localAuthKey } from "../constants";

export default {
  name: "Login",
  data: () => ({
    username: "",
    password: "",
    hasError: false,
    error: "",
  }),
  methods: {
    onSubmit(e) {
      e.preventDefault();

      const { username, password } = this;

      if (!username || !password) {
        return;
      }

      store.commit("LOGIN", { username, password });
      localStorage.setItem(localAuthKey, JSON.stringify({ username, password }));
    },
  },
  created() {
    const storedAuth = localStorage.getItem(localAuthKey);
    if (storedAuth) {
      let parsed;

      try {
        parsed = JSON.parse(storedAuth);
      } catch (e) {
        // Invalid stored auth, just clear it and move on.
        localStorage.removeItem(localAuthKey);
        return;
      }

      if (!parsed || typeof parsed !== "object") {
        localStorage.removeItem(localAuthKey);
        return;
      }

      const { username, password } = parsed;

      if (
        !username ||
        !password ||
        typeof username !== "string" ||
        typeof password !== "string"
      ) {
        localStorage.removeItem(localAuthKey);
        return;
      }

      store.commit("LOGIN", { username, password });
    }
  },
};
</script>

<style scoped>
  
</style>