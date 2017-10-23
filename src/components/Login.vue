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

export default {
  name: "Login",
  props: ["onLogin"],
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
      this.onLogin();
    },
  },
};
</script>

<style scoped>
  
</style>