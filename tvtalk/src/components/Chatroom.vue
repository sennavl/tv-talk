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
                {{`${formatTime(message.date)} ${message.name}: ${message.message}`}}
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
import moment from 'moment'
var socket

export default {
  props: ['auth', 'id'],
  data () {
    return {
      messages: [],
      message: '',
      profile: {}
    }
  },
  created () {
    const io = require('socket.io-client')
    socket = io.connect('http://localhost:4113', { query: `chatroom_id=${this.id}` })
    socket.emit('subscribe', this.id)

    socket.on('output', (data) => {
      if (typeof data !== 'undefined') {
        this.messages.push(data)
      }
    })
    socket.on('initialOutput', (data) => {
      if (data.length) {
        this.messages = data
      }
    })
    this.getProfile()
  },
  methods: {
    formatTime (date) {
      const dateConverted = new Date(date)
      return moment(dateConverted).format('HH:mm:ss')
    },
    sendMessage () {
      if (Object.keys(this.profile).length === 0 && this.profile.constructor === Object) {
        this.getProfile()
      }
      socket.emit('input', {
        message: this.message,
        name: this.profile.nickname,
        chatroom_id: this.id
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
    socket.emit('unsubscribe', this.id)
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
