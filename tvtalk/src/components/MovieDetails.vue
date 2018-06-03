<template>
  <div id="main" v-if="movie">
    <div class="inner">
      <a @click.stop.prevent="test">&lt; back</a>
      <div class="title-rating">
        <h1>{{ movie.title }} ({{ getYear(movie.release_date) }})</h1>
        <div class="rating">
          <i class="material-icons">star_rate</i>
          <p v-if="!rated"><a @click="openRatingModal()">Add rating</a></p>
          <p v-if="rated"><a @click="openEditRatingModal()">Edit rating</a></p>
        </div>
      </div>
      <div class="subtitles">
        <p><span class="icon-subtitle"><i class="material-icons">access_time</i></span>{{ getTimeFromMins(movie.runtime)  }}</p>
        <p><span class="icon-subtitle"><i class="material-icons">movie</i></span>{{ getGenres() }}</p>
      </div>
      <div class="overview">
        <div class="picture">
          <img :src=baseUrlPoster+movie.poster_path alt="" />
        </div>
        <div class="info">
          <p class="subtitle">Overview</p>
          <p>{{ movie.overview }}</p>
          <p class="subtitle">Spoken languages</p>
          <p v-if="movie.spoken_languages.length > 0" v-for="language of movie.spoken_languages" :key="language.id">{{ language.name }}</p>
          <p v-else>Not available</p>
          <p class="subtitle">Budget</p>
          <p>{{ movie.budget | currency }}</p>
          <p class="subtitle">Homepage</p>
          <p><a :href="movie.homepage">{{ movie.homepage }}</a></p>
          <p class="subtitle">Status</p>
          <p>{{ movie.status }}</p>
          <p class="subtitle">Release date</p>
          <p>{{ movie.release_date }}</p>
          <p class="subtitle">Revenue</p>
          <p>{{ movie.revenue }}</p>
        </div>
      </div>
    </div>

    <div id="myModal" class="modal" v-if="showModal">
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <span class="close" @click="showModal = false">&times;</span>
          <h2>Add rating</h2>
        </div>
        <div class="modal-body">
          <div @mouseleave="showCurrentRating(0)" style="display:inline-block;">
            <star-rating :show-rating="false" @current-rating="showCurrentRating" @rating-selected="setCurrentSelectedRating" :increment="0.5"></star-rating>
          </div>
          <p class="error-message" v-if="ratingError">Please enter a valid rating</p>
          <div style="margin-top:10px;font-weight:bold;">{{ currentRating }}</div>
          <input type="submit" value="Submit" class="special disabled" v-if="rating === 'No rating selected'" />
          <input type="submit" value="Submit" class="special" @click="submitRating()" v-if="rating !== 'No rating selected'" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import StarRating from 'vue-star-rating'
import AuthService from '../auth/AuthService'
Vue.component('star-rating', StarRating)

const auth = new AuthService()

const { login } = auth
// als film tot collectie behoort laten doorverwijzen naar overview-pagina met deze data: https://api.themoviedb.org/3/collection/344830?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US
export default {
  props: ['auth', 'id', 'authenticated'],
  data () {
    return {
      movie: {},
      baseUrlPoster: 'https://image.tmdb.org/t/p/w342',
      showModal: false,
      rating: 'No rating selected',
      currentRating: 'No rating',
      possibleRatings: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      ratingError: false,
      rated: false,
      profile: {}
    }
  },
  watch: {
    profile: function () {
      if (this.profile.sub) {
        this.checkRating()
      }
    }
  },
  created () {
    if (this.authenticated) {
      this.auth.getProfile((err, profile) => {
        if (err) return console.log(err)
        this.profile = profile
      })
    }

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
    login,
    checkRating () {
      if (this.authenticated) {
        axios.get(`http://localhost:3001/rating?user_id=${this.profile.sub.substring(6, this.profile.sub.length)}&movie_id=${this.movie.id}`)
          .then((response) => {
            console.log(response.data)
            if (response.data !== null) {
              this.rated = true
            } else {
              this.rated = false
            }
          })
      }
    },
    openRatingModal () {
      if (this.authenticated) {
        this.showModal = true
      } else {
        if (typeof (Storage) !== 'undefined') {
          localStorage.setItem('redirectUrl', this.$route.path)
        }
        this.login()
      }
    },
    openEditRatingModal () {
      console.log('open edit')
    },
    test () {
      this.$router.go(-1)
    },
    getYear (date) {
      if (typeof date !== 'undefined') {
        return date.substring(0, 4)
      }
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
    },
    showCurrentRating (rating) {
      this.currentRating = (rating === 0) ? this.currentSelectedRating : 'Click to select ' + rating + ' stars'
    },
    setCurrentSelectedRating (rating) {
      this.currentSelectedRating = 'You have Selected: ' + rating + ' stars'
      this.rating = rating
    },
    submitRating () {
      if (this.rating !== 'No rating selected' && this.possibleRatings.indexOf(this.rating) !== -1) {
        axios.post('http://localhost:3001/rating/add', {
          user_id: this.auth.userProfile.sub.substring(6, this.auth.userProfile.sub.length),
          movie_id: this.movie.id,
          rating: this.rating
        },
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        }
        ).then((response) => {
          console.log(response)
        })
      } else {
        this.ratingError = true
      }
    }
  },
  filters: {
    currency: function (value) {
      return '$ ' + value
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

  .subtitle {
    font-weight: bold;
    margin-bottom: 0px;
  }

  p {
    margin-bottom: 12px;
  }
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

.title-rating {
  display: flex;
  justify-content: space-between;

  .rating {
    margin: 0;
    display: flex;

    i {
      margin: 0;
      width: 30px;
      margin-top: 16px;
      font-size: 32px;
      color: #FFD700;
    }

    p {
      margin: 14px 0 0 10px;
    }
  }
}

.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.modal-header {
  padding: 2px 16px;

  h2 {
    padding-top: 7px;
  }
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 300px auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 300px; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

@media screen and (max-width: 736px) {
  .rating {
    i {
      margin-top: 6px;
    }

    p {
      margin-top: 6px;
    }
  }

  .overview {
    display: block;
  }
}
</style>
