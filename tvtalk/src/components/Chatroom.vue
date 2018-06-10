<template>
  <div>
    <div id="wrapper">
      <div id="main">
        <div class="inner">
          <h2>Chat</h2>
          <p>This chatroom will close at {{ convertDate(subEvent.datetime_end) }}</p>
          <div id="chat-window">
            <div id="output">
              <div class="message" v-if="messages.length < 1">
                <p>There are no messages yet</p>
              </div>
              <div class="message" v-else v-for="message in messages" :key="message.id">
                <div class="timeAndUser">
                  <p class="time">{{ formatTime(message.date) }}</p>
                  <p class="username">{{ message.name }}</p>
                </div>
                <p>{{ message.message }}</p>
              </div>
            </div>
          </div>
          <div class="user-input">
            <input id="message" type="text" placeholder="Message" v-model="message" @keyup.enter="sendMessage" />
            <button id="send" @click.prevent="sendMessage">Send</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import moment from 'moment'
var socket

export default {
  props: ['auth', 'id', 'subEventId'],
  data () {
    return {
      messages: [],
      message: '',
      profile: {},
      subEvent: {}
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
    this.getSubEvent()
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
    },
    getSubEvent () {
      axios.get(`http://localhost:3001/singleSubEvent/${this.subEventId}`)
        .then((response) => {
          this.subEvent = response.data
        })
    },
    convertDate (date) {
      var tempDate = new Date(date)
      tempDate.setMinutes(tempDate.getMinutes() + 30)
      tempDate = moment(tempDate)
      return tempDate.format('DD-MM-YYYY / HH:mm')
    }
  },
  updated () {
    const output = this.$el.querySelector('#output')
    output.scrollTop = output.scrollHeight
  },
  beforeDestroy () {
    socket.emit('unsubscribe', this.id)
    socket.disconnect()
  }
}
</script>

<style lang="less" scoped>
#output {
  max-height: 300px;
  overflow-y: auto;
  width: 70%;
  margin: 0px 0px 25px 0px;
  border: 1px solid rgb(201,201,201);

  p {
    margin: 0;
  }

  .message {
    margin-bottom: 12px;
    margin-left: 10px;

    .timeAndUser {
      display: flex;

      .time {
        font-style: italic;
        margin-right: 10px;
      }

      .username {
        font-weight: bold;
      }
    }
  }
}

.user-input {
  display: flex;
  width: 70%;
  margin: 0;

  button {
    width: 120px;
  }
}
</style>
