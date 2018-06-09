<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <header>
          <h1>Events</h1>
        </header>

        <section>
          <h2>Upcoming events</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start date</th>
                  <th>End date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="events.length > 0" v-for="event of events" :key="event.id">
                  <td width="73%"><router-link :to="{ name: 'subEvents', params: { id: event._id }}">{{ event.title }}</router-link></td>
                  <td width="10%">{{ convertDate(event.start) }}</td>
                  <td width="10%">{{ convertDate(event.end) }}</td>
                  <td width="7%"><router-link :to="{ name: 'subEvents', params: { id: event._id }}" style="color: green; border-bottom: none;">View</router-link></td>
                </tr>
                <tr v-if="events.length === 0">
                  <td>There are no events</td>
                </tr>
              </tbody>
            </table>
          </div>
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
