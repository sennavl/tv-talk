<template>
  <div>
    <div id="chat">
            <h2>Chat</h2>
            <div id="chat-window">
                <div id="output" v-if="messages.length > 0">{{messages}}</div>
            </div>
            <input id="handle" type="text" placeholder="Handle" />
            <input id="message" type="text" placeholder="Message" v-model="message" />
            <button id="send" @click.prevent="sendMessage">Send</button>
            <button @click.prevent="test">Test</button>
        </div>
  </div>
</template>

<script type="text/ecmascript-6">
const io = require('socket.io-client')
var socket = io.connect('http://localhost:4113')

export default {

  data () {
    return {
      messages: [],
      username: 'senna',
      message: ''
    }
  },
  created () {
    socket.on('chat', data => {
      this.messages.push(data)
    })
  },
  methods: {
    sendMessage () {
      socket.emit('chat', {
        message: this.message,
        handle: 'senna'
      })
    }
  }
}
</script>

<style>

</style>
