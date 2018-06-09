<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <div class="panel-heading">
          <h3>Profile</h3>
        </div>
        <div class="panel-body">
          <img :src="profile.picture" class="avatar" alt="avatar">
          <div>
          <label><i class="glyphicon glyphicon-user"></i> Nickname</label>
          <h3 class="nickname">{{ profile.nickname }}</h3>
          </div>
          <div>
          <label><i class="glyphicon glyphicon-envelope"></i> Email</label>
          <h3 class="email">{{ profile.name }}</h3>
          </div>
        </div>

        <section>
          <h2>Favorite movies</h2>
          <section class="tiles" v-if="favoriteMovies && favoriteMovies.length > 0">
            <article v-for="(movie, index) of favoriteMovies" :key="movie.id" v-if="(!showAllFavoriteMovies && index < 3) || showAllFavoriteMovies">
              <span class="image">
                <img :src=baseUrlPoster+movie.poster_path alt="" />
              </span>
              <router-link :to="{ name: 'movieDetails', params: { id: movie.movie_id }}">
                <h2>{{movie.title}}</h2>
                <div class="content">
                  <p>Click to see more</p>
                </div>
              </router-link>
            </article>
            <article>
              <p v-if="!showAllFavoriteMovies"><a @click="showAllFavoriteMovies = true">Show all</a></p>
              <p v-if="showAllFavoriteMovies"><a @click="showAllFavoriteMovies = false">Show less</a></p>
            </article>
          </section>
          <section v-else>
            <p>You haven't added any movie to your favorites yet.</p>
          </section>
        </section>

        <section>
          <h2>Favorite tv series</h2>
          <section class="tiles" v-if="favoriteSeries && favoriteSeries.length > 0">
            <article v-for="(movie, index) of favoriteSeries" :key="movie.id" v-if="(!showAllFavoriteSeries && index < 3) || showAllFavoriteSeries">
              <span class="image">
                <img :src=baseUrlPoster+movie.poster_path alt="" />
              </span>
              <router-link :to="{ name: 'seriesDetails', params: { id: movie.serie_id }}">
                <h2>{{movie.title}}</h2>
                <div class="content">
                  <p>Click to see more</p>
                </div>
              </router-link>
            </article>
            <article>
              <p v-if="!showAllFavoriteSeries"><a @click="showAllFavoriteSeries = true">Show all</a></p>
              <p v-if="showAllFavoriteSeries"><a @click="showAllFavoriteSeries = false">Show less</a></p>
            </article>
          </section>
          <section v-else>
            <p>You haven't added any tv serie to your favorites yet.</p>
          </section>
        </section>

        <section>
          <h2>Lists</h2>
          <ul v-if="lists.length > 0">
            <li v-for="list in lists" :key="list.id">
              <router-link :to="{ name: 'List', params: { id: list._id }}">{{ list.name }}</router-link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['auth'],
  data () {
    if (this.auth.userProfile) {
      this.$nextTick(() => {
        this.profile = this.auth.userProfile
      })
    } else {
      this.auth.getProfile((err, profile) => {
        if (err) return console.log(err)
        this.profile = profile
      })
    }
    return {
      profile: {},
      favoriteMovies: [],
      baseUrlPoster: 'https://image.tmdb.org/t/p/original',
      showAllFavoriteMovies: false,
      showAllFavoriteSeries: false,
      lists: [],
      favoriteSeries: []
    }
  },
  created () {
    this.getFavoriteMovies()
    this.getFavoriteSeries()
    this.getLists()
  },
  methods: {
    getFavoriteMovies () {
      axios.get(`http://localhost:3001/favorites/movies`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.favoriteMovies = response.data
          }
        })
    },
    getFavoriteSeries () {
      axios.get(`http://localhost:3001/favorites/series`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.favoriteSeries = response.data
          }
        })
    },
    getLists () {
      axios.get(`http://localhost:3001/lists`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.lists = response.data
          }
        })
    }
  }
}
</script>

<style>
  .profile-area img {
    max-width: 150px;
    margin-bottom: 20px;
  }

  .panel-body h3 {
    margin-top: 0;
  }

  a:hover {
    cursor: pointer;
  }
</style>
