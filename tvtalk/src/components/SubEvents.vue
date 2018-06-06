<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <header>
          <h1>{{ eventTitle}}</h1>
        </header>
        <section>
          <h2>other title</h2>
          <section class="tiles" v-if="subEvents.length > 0">
            <article >
              <span class="image">
                <img src="/static/assets/images/WorldCup.png" alt="" />
              </span>
              <router-link :to="{ name: 'Chatroom'}" v-for="subEvent of subEvents" :key="subEvent.id">
                <h2>{{ subEvent.title }}</h2>
                <div class="content">
                  <p>{{ convertDate(subEvent.start) + ' - ' + convertDate(subEvent.end) }}</p>
                </div>
              </router-link>
            </article>
          </section>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  props: ['id'],
  data () {
    return {
      eventTitle: '',
      subEvents: [],
      errors: []
    }
  },
  created () {
    this.getEvent()
    this.getEvents()
  },
  methods: {
    getEvent () {
      axios.get(`http://localhost:3001/event/${this.id}`)
        .then((response) => {
          this.eventTitle = response.data.title
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    getEvents () {
      axios.get(`http://localhost:3001/subEvents/${this.id}`)
        .then((response) => {
          this.subEvents = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    convertDate (date) {
      date = moment(date)
      return date.format('DD-MM-YYYY')
    }
  }
}
</script>

<style lang="less" scoped>
.tiles h2 {
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
</style>
