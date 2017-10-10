import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    general: {
      messages: [{ text: "General", userId: "user_id" }],
      unread: 0,
    },
    something: {
      messages: [{ text: "Something", userId: "user_id" }],
      unread: 0,
    },
    other: {
      messages: [{ text: "Other", userId: "user_id" }],
      unread: 0,
    },
    random: {
      messages: [{ text: "Random", userId: "user_id" }],
      unread: 0,
    },
  },
  mutations: {
    NEW_MESSAGE(state, payload) {
      const { roomId, currentRoom, text, userId } = payload;
      state[roomId].messages.push({ text, userId });
      console.log({ currentRoom });
      if (roomId !== currentRoom) {
        state[roomId].unread += 1;
      }
    },
    CHANGED_ROOM(state, roomId) {
      state[roomId].unread = 0;
    },
  },
  getters: {
    unread: state => roomId => state[roomId].unread,
    totalUnread: state =>
      Object.keys(state)
        .reduce((total, roomId) => total + state[roomId].unread, 0),
    rooms: state =>
      Object.keys(state)
        .map(roomId => ({ roomId, unread: state[roomId].unread })),
    messages: state => roomId => state[roomId].messages,
  },
});

export default store;
