<template>
  <div>
    <form v-on:submit="createRoom" autocomplete="off" class="new-chatroom-container">
      <label for="new-chatroom">
        <div>New chatroom</div>
        <input id="new-chatroom" v-model="newRoomName">
        <span v-if="newRoomName && !/^[A-z]+$/.test(newRoomName)" class="new-chatroom-error">
          Invalid room name
        </span>
      </label>
    </form>
    <form v-on:submit="joinRoom" autocomplete="off" class="new-chatroom-container">
      <label for="join-chatroom">
        <div>Join chatroom</div>
        <input id="join-chatroom" v-model="joinRoomName">
        <span v-if="joinRoomName && !/^[A-z]+$/.test(joinRoomName)" class="join-chatroom-error">
          Invalid room name
        </span>
        <span v-if="joinRoomName === isInRoomErr" class="join-chatroom-error">
          Already in room
        </span>
      </label>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import joinRoom from "../actions/joinRoom";

const roomRegex = /^[A-z]+$/;

export default {
  name: "JoinRoom",
  props: ["changeRoom"],
  data: () => ({
    newRoomName: "",
    joinRoomName: "",
    isInRoomErr: null,
  }),
  computed: mapGetters({
    isInRoom: "isInRoom",
  }),
  methods: {
    createRoom: function createRoom(e) {
      e.preventDefault();
      const room = this.newRoomName;

      if (!roomRegex.test(room)) {
        return;
      }

      if (!room || typeof room !== "string") {
        throw new Error("Expected room to be a string.");
      }

      this.newRoomName = "";

      axios.post("http://localhost:3333/createRoom", { room })
        .then(() => {
          joinRoom(room);
          this.changeRoom(room);
        })
        .catch((err) => {
          /**
           * Can also return the error INVALID_NAME but the request
           * should not be sent from the client if that is the case.
           */
          if (err && err.response) {
            if (err.response.statusText === "ROOM_EXISTS") {
              joinRoom(room);
              this.changeRoom(room);
              return;
            }
            if (err.response.statusText === "INVALID_NAME") {
              // Should not happen, but you never know if requirements change.
              console.error("INVALID NAME"); // Handle properly
            }
          }
          throw err;
        });
    },
    joinRoom: function f(e) {
      e.preventDefault();
      const room = this.joinRoomName;

      if (!room || typeof room !== "string") {
        throw new Error("Expected room to be a string.");
      }

      if (!roomRegex.test(room)) {
        return;
      }

      if (this.isInRoom(room)) {
        this.isInRoomErr = room;
        return;
      }

      axios.post("http://localhost:3333/checkRoomExists", { room })
        .then(() => {
          joinRoom(room);
          this.changeRoom(room);
          this.joinRoomName = "";
        })
        .catch((err) => {
          /**
           * Can also return the error INVALID_NAME but the request
           * should not be sent from the client if that is the case.
           */
          if (err && err.response) {
            if (err.response.statusText === "ROOM_NO_EXIST") {
              this.noExistErr = room;
              return;
            }
            if (err.response.statusText === "INVALID_NAME") {
              // Should not happen, but you never know if requirements change.
              console.error("INVALID NAME"); // Handle properly
            }
          }
          throw err;
        });
    },
  },
};

</script>

<style scoped>

.new-chatroom-container {
  text-align: left;
}

.new-chatroom-container label {
  margin-bottom: 16px;
}

.new-chatroom-container label div {
  margin-bottom: 8px;
}

.new-chatroom-container input {
  width: 100%;
}

.join-chatroom-error,
.new-chatroom-error {
  color: rgba(255,0,0,.7);
  margin-left: 8px;
}

</style>
