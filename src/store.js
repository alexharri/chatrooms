import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";

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
      });
    },
    NEW_MESSAGE(state, payload) {
      const { room, text, username } = payload;
      state[room].messages.push({ text, username, read: false, id: shortid() });
    },
    READ_MESSAGE(state, payload) {
      const { messageId, room } = payload;
      const messageIndex = state[room].messages.map(m => m.id).indexOf(messageId);

      if (messageIndex < 0) {
        throw new Error(`Message by id '${messageId}' in room '${room}'`);
      }

      state[room].messages[messageIndex].read = true;
    },
    LOGIN(state, payload) {
      const { username, password } = payload;
      state.auth.username = username;
      state.auth.password = password;
    },
    LOGOUT(state) {
      state.auth.username = null;
      state.auth.password = null;
    },
  },
  getters: {
    unread: state => roomId =>
      state[roomId].messages.reduce((total, message) => (message.read ? total : total + 1), 0),
    totalUnread: (state, getters) =>
      state._openRooms
        .reduce((total, roomId) => (total + getters.unread(roomId)), 0),
    rooms: (state, getters) =>
      state._openRooms
        .map(roomId => ({ roomId, unread: getters.unread(roomId) })),
    messages: state => (roomId) => {
      if (!state[roomId]) {
        throw new Error(`Could not find room '${roomId}' in store.`);
      }
      return state[roomId].messages;
    },
    isInRoom: state => roomId => (state[roomId] && typeof state[roomId] === "object"),
    isLoggedIn: state => !!state.auth.username,
  },
});

export default store;
