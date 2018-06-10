<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <header>
          <h1>{{ eventTitle}}</h1>
        </header>

        <section>
          <h2>Events in progress</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th v-if="runningSubEvents.length > 0">Name</th>
                  <th v-if="runningSubEvents.length > 0">Start date</th>
                  <th v-if="runningSubEvents.length > 0">End date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="runningSubEvents.length > 0" v-for="event of runningSubEvents" :key="event.id">
                  <td width="63%"><router-link :to="{ name: 'ChatroomOverview', params: { id: event._id }}">{{ event.title }}</router-link></td>
                  <td width="15%">{{ convertDate(event.datetime_start) }}</td>
                  <td width="15%">{{ convertDate(event.datetime_end) }}</td>
                  <td width="7%"><router-link :to="{ name: 'ChatroomOverview', params: { id: event._id }}" style="color: green; border-bottom: none;">View</router-link></td>
                </tr>
                <tr v-if="runningSubEvents.length === 0">
                  <td>There are no events currently in progress</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Upcoming events</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th v-if="upcomingSubEvents.length > 0">Name</th>
                  <th v-if="upcomingSubEvents.length > 0">Start date</th>
                  <th v-if="upcomingSubEvents.length > 0">End date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="upcomingSubEvents.length > 0" v-for="event of upcomingSubEvents" :key="event.id">
                  <td width="63%">{{ event.title }}</td>
                  <td width="15%">{{ convertDate(event.datetime_start) }}</td>
                  <td width="15%">{{ convertDate(event.datetime_end) }}</td>
                </tr>
                <tr v-if="upcomingSubEvents.length === 0">
                  <td>There are no upcoming events</td>
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
  props: ['id'],
  data () {
    return {
      eventTitle: '',
      upcomingSubEvents: [],
      runningSubEvents: [],
      errors: []
    }
  },
  created () {
    this.getEvent()
    this.getUpcomingEvents()
    this.getRunningEvents()
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
    getUpcomingEvents () {
      axios.get(`http://localhost:3001/subEvents/upcoming/${this.id}`)
        .then((response) => {
          this.upcomingSubEvents = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    getRunningEvents () {
      axios.get(`http://localhost:3001/subEvents/running/${this.id}`)
        .then((response) => {
          this.runningSubEvents = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    convertDate (date) {
      date = moment(date)
      return date.format('DD-MM-YYYY / HH:mm')
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
