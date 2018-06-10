<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <h1>Chatrooms overview</h1>

        <section>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th v-if="chatrooms.length > 0">Name</th>
                  <th v-if="chatrooms.length > 0">Room count</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="chatrooms.length > 0" v-for="chatroom in chatrooms" :key="chatroom.id">
                  <td width="73%"><router-link :to="{ name: 'Chatroom', params: { id: chatroom._id, subEventId: id } }" :class="typeof rooms[chatroom._id] !== 'undefined' && rooms[chatroom._id].length > 2 ? 'not-active': ''">{{ chatroom.name }}</router-link></td>
                  <td width="27%">{{ typeof rooms[chatroom._id] !== 'undefined' ? rooms[chatroom._id].length : 0 }}</td>
                </tr>
                <tr v-if="chatrooms.length === 0">
                  <td>There are no chatrooms available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
var socket

export default {
  props: ['id'],
  data () {
    return {
      chatrooms: [],
      errors: [],
      rooms: {}
    }
  },
  created () {
    const io = require('socket.io-client')
    socket = io.connect('http://localhost:4113')

    socket.on('rooms', (data) => {
      this.rooms = data
    })
    this.getChatrooms()
  },
  methods: {
    getChatrooms () {
      axios.get(`http://localhost:3001/chatrooms/${this.id}`)
        .then((response) => {
          this.chatrooms = response.data
        })
        .catch(err => this.errors.push(err))
    },
    getRoomCount (id) {
      if (this.rooms.length > 0 && typeof this.rooms[id] !== 'undefined') {
        return this.rooms[id].length
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.not-active {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  color: black;
}
</style>
