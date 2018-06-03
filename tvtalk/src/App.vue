<template>

  <div id="wrapper">
    <header id="header">
      <div class="inner">
        <!-- Logo -->
        <a class="logo">
          <span class="title"><router-link to="/">TvTalk</router-link></span>
        </a>
        <!-- Nav -->
        <nav class="customNav">
          <ul>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link :to="{ name: 'overview', query: { page: 1, sorted: 'popularity.desc' }}">Movies</router-link></li>
            <li><router-link :to="{ name: 'overviewTv', query: { page: 1, sorted: 'popularity.desc' }}">Tv series</router-link></li>
            <li><router-link to="/chatroom">Live events</router-link></li>
            <li>|</li>
            <li><a v-if="!authenticated" @click.stop.prevent="login()">Log in</a></li>
            <li v-if="authenticated"><router-link to="/profile">Profile</router-link></li>
            <li><a v-if="authenticated" @click.stop.prevent="logout()">Log out</a></li>
          </ul>
        </nav>

        <nav class="hamburgerMenu">
          <ul>
            <li><a href="#menu">Menu</a></li>
          </ul>
        </nav>

        <div class="search-bar">
            <i class="material-icons">search</i>
            <input type="text" placeholder="Search for a movie or a tv serie" v-model="searchTerm" @keyup.enter="search" />
        </div>

        <div class="livesearch">
            <p v-if="searchResults.length > 0 && searchTerm.length > 0"  v-for="searchResult of searchResults" :key="searchResult.id" @click="redirect(searchResult.media_type, searchResult.id)">
              {{ searchResult.title || searchResult.name }}<span class="media-type"> in {{ searchResult.media_type === 'movie' ? 'movies' : 'TV series' }}</span>
            </p>
            <p v-if="searchResults.length === 0 && searched && searchTerm.length > 0">
              No results
            </p>
        </div>
      </div>
    </header>

    <nav id="menu">
      <h2>Menu</h2>
      <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link :to="{ name: 'overview', query: { page: 1, sorted: 'popularity.desc' }}">Movies</router-link></li>
        <li><router-link :to="{ name: 'overviewTv', query: { page: 1, sorted: 'popularity.desc' }}">Tv series</router-link></li>
        <li><router-link to="/chatroom">Live events</router-link></li>
        <li>|</li>
        <li><a v-if="!authenticated" @click.stop.prevent="login()">Log in</a></li>
        <li v-if="authenticated"><router-link to="/profile">Profile</router-link></li>
        <li><a v-if="authenticated" @click.stop.prevent="logout()">Log out</a></li>
      </ul>
    </nav>

    <router-view
        :auth="auth"
        :authenticated="authenticated"
        :admin="admin">
        </router-view>

    <!-- Footer -->
    <footer id="footer">
      <div class="inner">
        <section>
          <h2>Get in touch</h2>
          <form method="post" action="#">
            <div class="field half first">
              <input type="text" name="name" id="name" placeholder="Name" />
            </div>
            <div class="field half">
              <input type="email" name="email" id="email" placeholder="Email" />
            </div>
            <div class="field">
              <textarea name="message" id="message" placeholder="Message"></textarea>
            </div>
            <ul class="actions">
              <li><input type="submit" value="Send" class="special" /></li>
            </ul>
          </form>
        </section>
        <section>
          <h2>Follow</h2>
          <ul class="icons">
            <li><a href="#" class="icon style2 fa-twitter"><span class="label">Twitter</span></a></li>
            <li><a href="#" class="icon style2 fa-facebook"><span class="label">Facebook</span></a></li>
            <li><a href="#" class="icon style2 fa-instagram"><span class="label">Instagram</span></a></li>
            <li><a href="#" class="icon style2 fa-dribbble"><span class="label">Dribbble</span></a></li>
            <li><a href="#" class="icon style2 fa-github"><span class="label">GitHub</span></a></li>
            <li><a href="#" class="icon style2 fa-500px"><span class="label">500px</span></a></li>
            <li><a href="#" class="icon style2 fa-phone"><span class="label">Phone</span></a></li>
            <li><a href="#" class="icon style2 fa-envelope-o"><span class="label">Email</span></a></li>
          </ul>
        </section>
        <ul class="copyright">
          <li>&copy; Untitled. All rights reserved</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import AuthService from './auth/AuthService'
import axios from 'axios'

const auth = new AuthService()

const { login, logout, authenticated, admin, authNotifier } = auth

export default {
  name: 'app',
  data () {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
      this.admin = authState.admin
      if (this.authenticated === true && localStorage.getItem('redirectUrl') !== null) {
        this.$router.push({ path: localStorage.getItem('redirectUrl') })
        localStorage.removeItem('redirectUrl')
      }
    })

    return {
      auth,
      authenticated,
      admin,
      popularMovies: [],
      errors: [],
      baseUrlPoster: 'https://image.tmdb.org/t/p/original',
      profile: {},
      searchTerm: '',
      searchResults: [],
      timeout: null,
      searched: false
    }
  },
  created () {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/popular?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&page=1'
      )
      .then(response => {
        this.popularMovies = response.data.results.splice(0, 3)
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    login,
    logout,
    redirect (mediaType, id) {
      this.searchTerm = ''
      this.searchResults = []
      if (mediaType === 'movie') {
        this.$router.push({ name: 'movieDetails', params: { id } })
      } else if (mediaType === 'tv') {
        this.$router.push({ name: 'seriesDetails', params: { id } })
      }
    },
    search () {
      const tempSearch = this.searchTerm
      this.searchTerm = ''
      this.$router.push({ name: 'search',
        query: {
          q: tempSearch,
          page: 1
        }
      })
    },
    searchMoviesAndSeries (searchTerm) {
      if (searchTerm !== null && searchTerm.length > 0) {
        axios
          .get(
            `https://api.themoviedb.org/3/search/multi?api_key=09767dbf40d373b1e78aa80db4deefc9&query=${searchTerm}&page=1`
          )
          .then(response => {
            const filteredSearchResults = response.data.results.filter(e => e.media_type === 'movie' || e.media_type === 'tv')
            this.searchResults = filteredSearchResults.slice(0, 4)
            this.searched = true
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    }
  },
  watch: {
    authenticated (status) {
      if (status) {
        auth.getProfile((err, profile) => {
          if (err) return console.log(err)
          this.profile = profile
        })
      } else {
        this.profile = {}
      }
    },
    searchTerm: function (val, oldVal) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.searchMoviesAndSeries(val) }, 1000)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" type="text/less">
.btn-margin {
  margin-top: 7px;
}

img {
  width: 200px;
}

.customNav {
  float: right;
}

.logo {
  max-width: 20%;
}

li > a {
  cursor: pointer;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar i {
    margin-right: 10px;
}

.livesearch {
    margin-left: 35px;
}

.livesearch .media-type {
  color: #AAAAAA;
  font-style: italic;
}

.livesearch p {
  border-bottom: 1px solid #c9c9c9;
  padding: 0.5em 0 0 0.5em;
  margin: 0;
}

.livesearch p:hover {
  background-color: #CCCCCC;
  cursor: pointer;
  color: white;
  .media-type {
    color: white;
  }
}

@media screen and (max-width: 736px) {
    .livesearch {
        margin-top: 8px;
        margin-left: 35px;
    }
}
</style>
