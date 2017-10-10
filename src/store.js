import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";

Vue.use(Vuex);

const tempId = shortid();

const store = new Vuex.Store({
  state: {
    general: {
      messages: [{ text: "General", userId: "user_id", id: tempId }],
      resolved: { [tempId]: true },
      unread: 0,
    },
    something: {
      messages: [{ text: "Something", userId: "user_id", id: tempId }],
      resolved: { [tempId]: true },
      unread: 0,
    },
    other: {
      messages: [{ text: "Other", userId: "user_id", id: tempId }],
      resolved: { [tempId]: true },
      unread: 0,
    },
    random: {
      messages: [{ text: "Random", userId: "user_id", id: tempId }],
      resolved: { [tempId]: true },
      unread: 0,
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
    messages: state => (roomId) => {
      console.log(state[roomId].messages);
      return state[roomId].messages;
    },
  },
});

export default store;