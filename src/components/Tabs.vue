<template>
  <div class="app-container">
    <nav class="main-navigation">
      <join-room :changeRoom="changeRoom" />
      <logout />
    </nav>
    <div class="main-container">
      <nav class="tab-navigation">
        <ul class="tab-container">
          <li
            v-for="room in openRooms"
            v-on:click="changeRoom(room.roomId)"
            :class="{ tab: true, active: currentRoom === room.roomId }"
          >
            {{ room.roomId }} <span v-if="room.unread > 0 && room.roomId !== currentRoom">({{ room.unread }})</span>
          </li>
        </ul>
      </nav>
      <room :room="currentRoom" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
import joinRoom from "../actions/joinRoom";

import JoinRoom from "./JoinRoom.vue";
import Room from "./Room.vue";
import Logout from "./Logout.vue";

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
    JoinRoom,
    Logout,
  },
  methods: {
    changeRoom: function changeRoom(roomId) {
      this.currentRoom = roomId;
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

.app-container {
  display: flex;
  height: 100vh;
  align-items: stretch;
}

nav.main-navigation {
  padding: 0 16px;
  flex-basis: 200px;
  max-width: 200px;
  background: rgba(0,0,0,.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-container {
  flex-grow: 1;

  display: flex;
  flex-direction: column;
}

nav.tab-navigation {
  background: rgba(0,0,0,.05);
  border-bottom: 1px solid rgba(0,0,0,.2);
  flex-grow: 0;
}

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
