import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      username: null,
      password: null,
    },
    _openRooms: ["general", "random"],
    general: {
      messages: [{ text: "General", username: "username" }],
      unread: 0,
    },
    random: {
      messages: [{ text: "Random", username: "username" }],
      unread: 0,
    },
  },
  mutations: {
    NEW_MESSAGE(state, payload) {
      const { namespace, text, username } = payload;
      state[namespace].messages.push({ text, username });
      state[namespace].unread += 1;
    },
    CHANGED_ROOM(state, roomId) {
      state[roomId].unread = 0;
    },
    LOGIN(state, payload) {
      const { username, password } = payload;
      state.auth.username = username;
      state.auth.password = password;
    },
  },
  getters: {
    unread: state => roomId => state[roomId].unread,
    totalUnread: state =>
      state._openRooms
        .reduce((total, roomId) => total + state[roomId].unread, 0),
    rooms: state =>
      state._openRooms
        .map(roomId => ({ roomId, unread: state[roomId].unread })),
    messages: state => roomId => state[roomId].messages,
  },
});

export default store;
