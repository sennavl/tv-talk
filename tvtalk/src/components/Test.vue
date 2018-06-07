<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <h2>Chat</h2>
      </div>
    </div>
  </div>
</template>

<script>
// const io = require('socket.io-client')
// var socket = io.connect('http://localhost:4113')

// export default {
//   props: ['auth', 'authenticated'],
//   data () {
//     return {
//       messages: []
//     }
//   },
//   created () {
//     console.log('start')
//     socket.on('output', (data) => {
//       if (typeof data !== 'undefined') {
//         console.log(data)
//         this.messages.push(data)
//       }
//     })
//     socket.on('initialOutput', (data) => {
//       console.log('initialOutput')
//       if (data.length) {
//         this.messages = data
//       }
//     })
//   }
// }
</script>

<style>
  a {
    cursor: pointer;
  }
</style>
