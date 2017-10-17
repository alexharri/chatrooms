import io from "socket.io-client";
import store from "../src/store";

const socketManager = {

};

export function joinNamespace(namespace) {
  if (socketManager[namespace]) {
    throw new Error(`Already in namespace '${namespace}'`);
  }

  const nsp = io("localhost:3000/" + namespace);
  socketManager[namespace] = nsp;

  nsp.on("msg", ({ username, text }) => {
    store.commit("NEW_MESSAGE", { namespace, text, username });
  });

  return nsp;
}

export function getSocket(namespace) {
  return socketManager[namespace] || null;
}

export function emit(eventName, namespace, payload) {
  const socket = getSocket(namespace);

  if (!socket) {
    throw new Error(`Not connected to namespace '${namespace}'`);
  }

  socket.emit(eventName, payload);
}
