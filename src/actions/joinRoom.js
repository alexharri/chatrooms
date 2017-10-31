import axios from "axios";
import store from "../store";
import { joinNamespace } from "../socket";

export default function joinRoom(room) {
  if (store.getters.isInRoom(room)) {
    throw new Error(`User is already in room '${room}'`);
  }

  store.commit("JOIN_ROOM", { room });

  const socket = joinNamespace(room);

  axios.get(`http://localhost:3333/recentMessages/${room}`)
    .then((res) => {
      console.log(res);
      store.commit("NEW_MESSAGES", { room, messages: res.data });
      socket.emit("login", store.state.auth);
      socket.on("msg", ({ username, text }) => store.commit("NEW_MESSAGE", { room, text, username }));
    })
    .catch((err) => {
      throw err;
    });
}
