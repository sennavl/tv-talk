<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <header>
          <h1>Events</h1>
        </header>
        <section>
          <h2>Upcoming events</h2>
          <section class="tiles" v-if="events.length > 0">
            <article >
              <span class="image">
                <img src="/static/assets/images/WorldCup.png" alt="" />
              </span>
              <router-link v-for="event of events" :key="event.id" :to="{ name: 'subEvents', params: { id: event._id }}">
                <h2>{{ event.title }}</h2>
                <div class="content">
                  <p>{{ convertDate(event.start) + ' - ' + convertDate(event.end) }}</p>
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
  data () {
    return {
      events: [],
      errors: []
    }
  },
  created () {
    this.getEvents()
  },
  methods: {
    getEvents () {
      axios.get('http://localhost:3001/events')
        .then((response) => {
          this.events = response.data
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
