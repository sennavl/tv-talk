<template>
  <div>
    <div id="wrapper">
      <div id="main">
        <div class="inner">
          <h2>Chat</h2>
          <div id="chat-window">
            <div id="output">
              <p v-if="messages.length < 1">There are no messages yet</p>
              <p v-for="message in messages" :key="message.id">
                {{`${message.name}: ${message.message}`}}
              </p>
            </div>
          </div>
          <input id="message" type="text" placeholder="Message" v-model="message" @keyup.enter="sendMessage" />
          <button id="send" @click.prevent="sendMessage">Send</button>
          <button>Test</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
var socket

export default {
  props: ['auth'],
  data () {
    return {
      messages: [],
      message: '',
      profile: {}
    }
  },
  created () {
    const io = require('socket.io-client')
    socket = io.connect('http://localhost:4113')
    console.log(socket)
    console.log('start')
    socket.on('output', (data) => {
      if (typeof data !== 'undefined') {
        console.log(data)
        this.messages.push(data)
      }
    })
    socket.on('initialOutput', (data) => {
      console.log('initialOutput')
      if (data.length) {
        this.messages = data
      }
    })
    this.getProfile()
  },
  methods: {
    sendMessage () {
      if (Object.keys(this.profile).length === 0 && this.profile.constructor === Object) {
        this.getProfile()
      }
      socket.emit('input', {
        message: this.message,
        name: this.profile.nickname
      })

      this.message = ''
    },
    getProfile () {
      if (this.auth.userProfile) {
        this.$nextTick(() => {
          this.profile = this.auth.userProfile
        })
      } else {
        this.auth.getProfile((err, profile) => {
          if (err) return console.log(err)
          this.profile = profile
        })
      }
      return {
        profile: {}
      }
    }
  },
  updated () {
    const output = this.$el.querySelector('#output')
    output.scrollTop = output.scrollHeight
  },
  beforeDestroy () {
    console.log('close chat')
    socket.disconnect()
  }
}
</script>

<style>
#output {
  max-height: 300px;
  overflow-y: auto;
}
</style>
