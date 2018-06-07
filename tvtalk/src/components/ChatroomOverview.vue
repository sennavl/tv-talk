<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <h1>Chatrooms overview</h1>
        <div class="chatrooms">
          <ul>
            <li v-if="rooms && Object.keys(rooms).length > 0" v-for="chatroom in chatrooms" :key="chatroom.id"><router-link :to="{ name: 'Chatroom', params: { id: chatroom._id } }" :class="typeof rooms[chatroom._id] !== 'undefined' && rooms[chatroom._id].length > 2 ? 'not-active': ''">{{ chatroom.name }}</router-link>Count: {{ typeof rooms[chatroom._id] !== 'undefined' ? rooms[chatroom._id].length : 0 }}</li>
            <li v-else v-for="chatroom in chatrooms" :key="chatroom.id"><router-link :to="{ name: 'Chatroom', params: { id: chatroom._id } }">{{ chatroom.name }}</router-link>Count: {{ 0 }}</li>
          </ul>
        </div>
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
        console.log(this.rooms)
        return this.rooms[id].length
      } else {
        console.log(0)
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
