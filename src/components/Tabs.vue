<template>
  <div>
    <ul class="tab-container">
      <li
        v-for="room in openRooms"
        v-on:click="changeRoom(room.roomId)"
        :class="{ tab: true, active: currentRoom === room.roomId }"
      >
        {{ room.roomId }} <span v-if="room.unread > 0">({{ room.unread }})</span>
      </li>
    </ul>
    <room :room="currentRoom" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
import socket from "../../socket/socket";

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
      store.commit("CHANGED_ROOM", roomId);
    },
  },
  created() {
    const rooms = this.openRooms;
    const commit = roomId => data =>
      store.commit("NEW_MESSAGE", { ...data, roomId, currentRoom: this.currentRoom });

    for (let i = 0; i < rooms.length; i += 1) {
      const { roomId } = rooms[i];
      socket.on(`${roomId}:msg`, commit(roomId));
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
