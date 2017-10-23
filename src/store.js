import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {
      username: null,
      password: null,
    },
    _openRooms: [],
  },
  mutations: {
    JOIN_ROOM(state, payload) {
      const { room } = payload;

      if (state._openRooms.indexOf(room) > -1) {
        throw new Error(`Already in room '${room}'`);
      }

      if (!room) {
        throw new Error("Expected 'room' to be a string.");
      }

      state._openRooms.push(room);
      Vue.set(state, room, {
        messages: [],
        unread: 0,
      });
    },
    NEW_MESSAGE(state, payload) {
      const { room, text, username } = payload;
      state[room].messages.push({ text, username });
      state[room].unread += 1;
    },
    GO_TO_ROOM(state, roomId) {
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
    messages: state => (roomId) => {
      if (!state[roomId]) {
        throw new Error(`Could not find room '${roomId}' in store.`);
      }
      return state[roomId].messages;
    },
    isInRoom: state => roomId => (state[roomId] && typeof state[roomId] === "object"),
  },
});

export default store;
