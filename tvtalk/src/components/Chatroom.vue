<template>
  <div>
	  <div id="chat">
            <h2>Chat</h2>
            <div id="chat-window">
                <div id="output"></div>
            </div>
            <input id="handle" type="text" placeholder="Handle" />
            <input id="message" type="text" placeholder="Message" />
            <button id="send" @click.prevent="sendMessage">Send</button>
        </div>
  </div>
</template>

<script type="text/ecmascript-6">
const io = require('socket.io-client');
var socket = io.connect('http://localhost:4113');

export default {

  data() {
    return {
      isConnected: false,
      socketMessage: ''
    }
  },
  methods: {
	  sendMessage() {
		  socket.emit('chat', {
			  message: 'hallo',
			  handle: 'senna'
		  })
	  }
  }
}
</script>

<style>

</style>
