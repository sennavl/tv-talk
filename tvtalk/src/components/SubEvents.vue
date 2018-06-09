<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <header>
          <h1>{{ eventTitle}}</h1>
        </header>

        <section>
          <h2>Sub events</h2>
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
                <tr v-if="subEvents.length > 0" v-for="event of subEvents" :key="event.id">
                  <td width="63%"><router-link :to="{ name: 'ChatroomOverview', params: { id: event._id }}">{{ event.title }}</router-link></td>
                  <td width="15%">{{ convertDate(event.datetime_start) }}</td>
                  <td width="15%">{{ convertDate(event.datetime_end) }}</td>
                  <td width="7%"><router-link :to="{ name: 'ChatroomOverview', params: { id: event._id }}" style="color: green; border-bottom: none;">View</router-link></td>
                </tr>
                <tr v-if="subEvents.length === 0">
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
