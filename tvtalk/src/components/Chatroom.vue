<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <h2>Chat</h2>
        <div id="chat-window">
          <div id="output" v-if="messages.length > 0">
            <p v-for="message in messages" :key="message.id">
              {{`${message.username}: ${message.message}`}}
            </p>
          </div>
        </div>
        <input id="message" type="text" placeholder="Message" v-model="message" @keyup.enter="sendMessage" />
        <button id="send" @click.prevent="sendMessage">Send</button>
        <button @click.prevent="test">Test</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const io = require('socket.io-client')
var socket = io.connect('http://localhost:4113')

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
    socket.on('chat', data => {
      this.messages.push(data)
    })
    this.getProfile()
  },
  methods: {
    sendMessage () {
      if (Object.keys(this.profile).length === 0 && this.profile.constructor === Object) {
        this.getProfile()
      }
      socket.emit('chat', {
        message: this.message,
        username: this.profile.nickname
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
  }
}
</script>

<style>

</style>
