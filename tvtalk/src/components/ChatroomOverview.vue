<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <h1>Chatrooms overview</h1>
        <div class="chatrooms">
          <ul>
            <li v-for="chatroom in chatrooms" :key="chatroom.id"><router-link :to="{ name: 'Test' }">{{ chatroom.name }}</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['id'],
  data () {
    return {
      chatrooms: [],
      errors: []
    }
  },
  created () {
    this.getChatrooms()
  },
  methods: {
    getChatrooms () {
      axios.get(`http://localhost:3001/chatrooms/${this.id}`)
        .then((response) => {
          this.chatrooms = response.data
        })
        .catch(err => this.errors.push(err))
    }
  }
}
</script>

<style lang="less" scoped>

</style>
