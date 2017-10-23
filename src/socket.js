import io from "socket.io-client";

const sockets = {};

export function joinNamespace(namespace) {
  if (sockets[namespace]) {
    throw new Error(`Already in namespace '${namespace}'`);
  }

  const nsp = io("localhost:3000/" + namespace);
  sockets[namespace] = nsp;

  return nsp;
}

export function getSocket(namespace) {
  return sockets[namespace] || null;
}

export function emit(eventName, namespace, payload) {
  const socket = getSocket(namespace);

  if (!socket) {
    throw new Error(`Not connected to namespace '${namespace}'`);
  }

  socket.emit(eventName, payload);
}
