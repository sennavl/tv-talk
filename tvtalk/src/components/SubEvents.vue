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
                  <td class="nameEvent"><router-link :to="{ name: 'ChatroomOverview', params: { id: event._id }}">{{ event.title }}</router-link></td>
                  <td class="startDateEvent">{{ convertDate(event.datetime_start) }}</td>
                  <td class="endDateEvent">{{ convertDate(event.datetime_end) }}</td>
                  <td class="viewEvent"><router-link :to="{ name: 'ChatroomOverview', params: { id: event._id }}" style="color: green; border-bottom: none;">View</router-link></td>
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
                  <td class="nameEvent">{{ event.title }}</td>
                  <td class="startDateEvent">{{ convertDate(event.datetime_start) }}</td>
                  <td class="endDateEvent">{{ convertDate(event.datetime_end) }}</td>
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

.table-wrapper {
  .nameEvent {
    width: 63%;
  }

  .startDateEvent {
    width: 15%;
  }

  .endDateEvent {
    width: 15%;
  }

  .viewEvent {
    width: 7%;
  }
}

@media screen and (max-width: 966px) {
  .table-wrapper {
    .nameEvent {
      width: 59%;
    }

    .startDateEvent {
      width: 17%;
    }

    .endDateEvent {
      width: 17%;
    }

    .viewEvent {
      width: 7%;
    }
  }
}

@media screen and (max-width: 809px) {
  .table-wrapper {
    .nameEvent {
      width: 53%;
    }

    .startDateEvent {
      width: 20%;
    }

    .endDateEvent {
      width: 20%;
    }

    .viewEvent {
      width: 7%;
    }
  }
}

@media screen and (max-width: 694px) {
  .table-wrapper {
    .nameEvent {
      width: 43%;
    }

    .startDateEvent {
      width: 25%;
    }

    .endDateEvent {
      width: 25%;
    }

    .viewEvent {
      width: 7%;
    }
  }
}

@media screen and (max-width: 548px) {
  .table-wrapper {
    .nameEvent {
      width: 43%;
    }

    .startDateEvent {
      width: 25%;
    }

    .endDateEvent {
      width: 25%;
    }

    .viewEvent {
      width: 7%;
    }
  }
}

@media screen and (max-width: 461px) {
  .table-wrapper {
    .nameEvent {
      width: 33%;
    }

    .startDateEvent {
      width: 30%;
    }

    .endDateEvent {
      width: 30%;
    }

    .viewEvent {
      width: 7%;
    }
  }
}
</style>
