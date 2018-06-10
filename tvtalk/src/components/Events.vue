<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <header>
          <h1>Events</h1>
        </header>

        <section>
          <h2>Events in progress</h2>
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
                <tr v-if="runningEvents.length > 0" v-for="event of runningEvents" :key="event.id">
                  <td class="nameEvent"><router-link :to="{ name: 'subEvents', params: { id: event._id }}">{{ event.title }}</router-link></td>
                  <td class="startDateEvent">{{ convertDate(event.start) }}</td>
                  <td class="endDateEvent">{{ convertDate(event.end) }}</td>
                  <td class="viewEvent"><router-link :to="{ name: 'subEvents', params: { id: event._id }}" style="color: green; border-bottom: none;">View</router-link></td>
                </tr>
                <tr v-if="runningEvents.length === 0">
                  <td>There are no upcoming events</td>
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
                  <th>Name</th>
                  <th>Start date</th>
                  <th>End date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="upcomingEvents.length > 0" v-for="event of upcomingEvents" :key="event.id">
                  <td class="nameEvent">{{ event.title }}</td>
                  <td class="startDateEvent">{{ convertDate(event.start) }}</td>
                  <td class="endDateEvent">{{ convertDate(event.end) }}</td>
                </tr>
                <tr v-if="upcomingEvents.length === 0">
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
  data () {
    return {
      upcomingEvents: [],
      runningEvents: [],
      errors: []
    }
  },
  created () {
    this.getUpcomingEvents()
    this.getRunningEvents()
  },
  methods: {
    getUpcomingEvents () {
      axios.get('http://localhost:3001/events/upcoming')
        .then((response) => {
          this.upcomingEvents = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    getRunningEvents () {
      axios.get('http://localhost:3001/events/running')
        .then((response) => {
          this.runningEvents = response.data
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

.table-wrapper {
  .nameEvent {
    width: 73%;
  }

  .startDateEvent {
    width: 10%;
  }

  .endDateEvent {
    width: 10%;
  }

  .viewEvent {
    width: 7%;
  }
}

@media screen and (max-width: 966px) {
  .table-wrapper {
    .nameEvent {
      width: 69%;
    }

    .startDateEvent {
      width: 12%;
    }

    .endDateEvent {
      width: 12%;
    }

    .viewEvent {
      width: 7%;
    }
  }
}

@media screen and (max-width: 809px) {
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
}

@media screen and (max-width: 694px) {
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
