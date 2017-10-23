<template>
  <div>
    <ul class="tab-container">
      <li
        v-for="room in openRooms"
        v-on:click="changeRoom(room.roomId)"
        :class="{ tab: true, active: currentRoom === room.roomId }"
      >
        {{ room.roomId }} <span v-if="room.unread > 0 && room.roomId !== currentRoom">({{ room.unread }})</span>
      </li>
    </ul>
    <form v-on:submit="createRoom" autocomplete="off" class="new-chatroom-container">
      <label for="new-chatroom">
        <div>New chatroom</div>
        <input id="new-chatroom">
      </label>
    </form>
    <room :room="currentRoom" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import store from "../store";
import joinRoom from "../actions/joinRoom";

import Room from "./Room.vue";

export default {
  name: "Tabs",
  data: () => ({
    currentRoom: "general",
  }),
  computed: mapGetters({
    openRooms: "rooms",
  }),
  components: {
    Room,
  },
  methods: {
    changeRoom: function changeRoom(roomId) {
      this.currentRoom = roomId;
      store.commit("GO_TO_ROOM", roomId);
    },
    joinRoom: (optRoom) => {
      const room = optRoom || document.getElementById("join-chatroom").value;
      joinRoom(room);
    },
    createRoom: function createRoom(e) {
      e.preventDefault();
      const room = document.getElementById("new-chatroom").value;

      if (!room || typeof room !== "string") {
        throw new Error(`Expected ${room} to be a string.`);
      }

      axios.post("http://localhost:3333/createRoom", { room })
        .then(() => {
          this.joinRoom(room);
        })
        .catch((err) => {
          if (
            err &&
            err.response &&
            err.response.statusText === "ROOM_EXISTS"
          ) {
            console.log("Room already exists.");
            this.joinRoom(room);
          } else {
            throw err;
          }
        });
    },
  },
  created() {
    const defaultRooms = ["general", "random"];
    for (let i = 0; i < defaultRooms.length; i += 1) {
      if (store.getters.isInRoom(defaultRooms[i])) {
        return; // Because of Vue hot reloading this component can be mounted twice.
      }
      joinRoom(defaultRooms[i]);
    }
  },
};

</script>

<style scoped>

.tab-container {
  display: flex;
  list-style-type: none;
}

.tab {
  max-width: 100px;
  padding: 8px;
  border-radius: 12px 12px 0 0;
  background: rgba(0,0,0,.15);
}

.tab:hover {
  background: rgba(0,0,0,.125);
  cursor: pointer;
}

.tab.active {
  background: rgba(0,0,0,.075);
}

</style>
