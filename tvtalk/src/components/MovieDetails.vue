<template>
  <div id="main" v-if="movie">
    <div class="inner">
      <a @click.stop.prevent="test">&lt; back</a>
      <h1>{{ movie.title }} ({{ movie.release_date.substring(0,4) }})</h1>
      <div class="subtitles">
        <p><span class="icon-subtitle"><i class="material-icons">access_time</i></span>{{ getTimeFromMins(movie.runtime)  }}</p>
        <p><span class="icon-subtitle"><i class="material-icons">movie</i></span>{{ getGenres() }}</p>
      </div>
      <div class="overview">
        <div class="picture">
          <img :src=baseUrlPoster+movie.poster_path alt="" />
        </div>
        <div class="info">
          <p class="subtitle">Rating</p>
          <p>{{ movie.overview }}</p>
          <p class="subtitle">Overview</p>
          <p>{{ movie.overview }}</p>
          <p class="subtitle">Spoken languages</p>
          <p>test</p>
        </div>
      </div>
      {{movie}}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
// als film tot collectie behoort laten doorverwijzen naar overview-pagina met deze data: https://api.themoviedb.org/3/collection/344830?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US
export default {
  props: ['auth', 'id'],
  data () {
    return {
      movie: {},
      baseUrlPoster: 'https://image.tmdb.org/t/p/w342',
      testArray: ['testa', 'testb', 'testc']
    }
  },
  created () {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/' + this.id + '?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US'
      )
      .then(response => {
        this.movie = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    test () {
      this.$router.go(-1)
    },
    getTimeFromMins (mins) {
      const h = mins / 60 | 0
      const m = mins % 60 | 0
      const hoursAndMinutes = moment.utc().hours(h).minutes(m).format('hh:mm')
      return hoursAndMinutes.replace(':', 'h')
    },
    getGenres () {
      let genresString = ''
      for (let i = 0; i < this.movie.genres.length; i++) {
        genresString += this.movie.genres[i].name
        if (i !== this.movie.genres.length - 1) {
          genresString += ', '
        }
      }
      return genresString
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" type="text/less" scoped>
a {
    cursor: pointer;
}

.picture {
  margin: 0 20px 0 0;
}

img {
  width: 342px;
}

h1 {
  margin: 0;
}

.overview {
  display: flex;
}

.info {
  margin: 0;
}

.subtitle {
  font-weight: bold;
  margin-bottom: 8px;
}

.icon-subtitle i {
  vertical-align: text-bottom;
  margin-right: 5px;
}

.subtitles {
  display: flex;

  p {
    margin-right: 1em;
  }
}
</style>
