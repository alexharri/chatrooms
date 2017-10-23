import store from "../store";
import { joinNamespace } from "../socket";

export default function joinRoom(room) {
  if (store.getters.isInRoom(room)) {
    throw new Error(`User is already in room '${room}'`);
  }

  store.commit("JOIN_ROOM", { room });

  const socket = joinNamespace(room);
  socket.emit("login", store.state.auth);
  socket.on("msg", ({ username, text }) => store.commit("NEW_MESSAGE", { room, text, username }));
}
