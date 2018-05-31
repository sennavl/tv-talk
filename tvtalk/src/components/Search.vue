<template>
<div id="main">
  <div class="inner" v-if="movies || tvSeries">
    <h1>Search results - {{ searchTerm }}</h1>
    <div class="content">
      <div class="filter">
        <h2>Filter</h2>
        <ul>
          <li><router-link :to="{ name: 'search', query: { page: 1, q: searchTerm, content: 'movies' } }">Movies - {{ total_results_movies }}</router-link></li>
          <li><router-link :to="{ name: 'search', query: { page: 1, q: searchTerm, content: 'tv' } }">Tv series - {{ total_results_series }}</router-link></li>
        </ul>
      </div>
      <div class="movies-overview" v-if="showMovies">
        <h2>{{ total_results_movies }} results</h2>
        <div class="movie-overview" v-for="movie of movies" :key="movie.id">
          <router-link :to="{ name: 'movieDetails', params: { id: movie.id }}"><img :src=baseUrlPoster+movie.poster_path alt=""></router-link>
          <div class="movie-content">
            <div class="title-rating">
              <h3>{{ movie.title }}</h3>
              <p>7.9 <span class="icon-subtitle"><i class="material-icons">start_rate</i></span></p>
            </div>
            <p v-if="movie.overview.length > 177">{{ movie.overview.substring(0, 177) + '...' }}</p>
            <p v-else>{{ movie.overview || 'No description available yet' }}</p>
            <p><span class="subtitle-overview">Release date: </span>{{ movie.release_date || 'No release date available yet' }}</p>
            <p><span class="subtitle-overview">Genres: </span>{{ getGenresMovies(movie) || 'No genres available yet' }}</p>
            <router-link class="button" :to="{ name: 'movieDetails', params: { id: movie.id }}">See more</router-link>
          </div>
        </div>
        <div class="pagination">
          <ul>
            <li><router-link :to="{ name: 'search', query: { page: 1, q: searchTerm }}" :class="currentPage === 1 ? 'not-active' : ''">1</router-link></li>
            <li v-if="total_pages > 4">...</li>
            <li v-if="total_pages > 4" v-for="page of other_pages" :key="page.id"><router-link :to="{ name: 'search', query: { page, q: searchTerm } }" :class="currentPage === page ? 'not-active' : ''">{{ page }}</router-link></li>
            <li v-if="total_pages === 3"><router-link :to="{ name: 'search', query: { page: 2, q: searchTerm } }" :class="currentPage === 2 ? 'not-active' : ''">{{ 2 }}</router-link></li>
            <li v-if="total_pages === 4"><router-link :to="{ name: 'search', query: { page: 2, q: searchTerm } }" :class="currentPage === 2 ? 'not-active' : ''">{{ 2 }}</router-link></li>
            <li v-if="total_pages === 4"><router-link :to="{ name: 'search', query: { page: 3, q: searchTerm } }" :class="currentPage === 3 ? 'not-active' : ''">{{ 3 }}</router-link></li>
            <li v-if="total_pages > 4">...</li>
            <li><router-link v-if="getTotalPages > 1" :to="{ name: 'search', query: { page: getTotalPages, q: searchTerm }}" :class="currentPage === getTotalPages ? 'not-active' : ''">{{ getTotalPages }}</router-link></li>
          </ul>
        </div>
      </div>

      <div class="movies-overview" v-if="!showMovies">
        <h2>{{ total_results_series }} results</h2>
        <div class="movie-overview" v-for="tvSerie of tvSeries" :key="tvSerie.id">
          <router-link :to="{ name: 'seriesDetails', params: { id: tvSerie.id }}"><img :src=baseUrlPoster+tvSerie.poster_path alt=""></router-link>
          <div class="movie-content">
            <div class="title-rating">
              <h3>{{ tvSerie.name }}</h3>
              <p>7.9 <span class="icon-subtitle"><i class="material-icons">start_rate</i></span></p>
            </div>
            <p v-if="tvSerie.overview.length > 177">{{ tvSerie.overview.substring(0, 177) + '...' }}</p>
            <p v-else>{{ tvSerie.overview || 'No description available yet' }}</p>
            <p><span class="subtitle-overview">Release date: </span>{{ tvSerie.release_date || 'No release date available yet' }}</p>
            <p><span class="subtitle-overview">Genres: </span>{{ getGenresTvSeries(tvSerie) || 'No genres available yet' }}</p>
            <router-link class="button" :to="{ name: 'seriesDetails', params: { id: tvSerie.id }}">See more</router-link>
          </div>
        </div>
        <div class="pagination">
          <ul>
            <li><router-link :to="{ name: 'search', query: { page: 1, q: searchTerm }}" :class="currentPage === 1 ? 'not-active' : ''">1</router-link></li>
            <li v-if="total_pages > 4">...</li>
            <li v-if="total_pages > 4" v-for="page of other_pages" :key="page.id"><router-link :to="{ name: 'search', query: { page, q: searchTerm } }" :class="currentPage === page ? 'not-active' : ''">{{ page }}</router-link></li>
            <li v-if="total_pages === 3"><router-link :to="{ name: 'search', query: { page: 2, q: searchTerm } }" :class="currentPage === 2 ? 'not-active' : ''">{{ 2 }}</router-link></li>
            <li v-if="total_pages === 4"><router-link :to="{ name: 'search', query: { page: 2, q: searchTerm } }" :class="currentPage === 2 ? 'not-active' : ''">{{ 2 }}</router-link></li>
            <li v-if="total_pages === 4"><router-link :to="{ name: 'search', query: { page: 3, q: searchTerm } }" :class="currentPage === 3 ? 'not-active' : ''">{{ 3 }}</router-link></li>
            <li v-if="total_pages > 4">...</li>
            <li><router-link v-if="getTotalPages > 1" :to="{ name: 'search', query: { page: getTotalPages, q: searchTerm }}" :class="currentPage === getTotalPages ? 'not-active' : ''">{{ getTotalPages }}</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
// overviewpagina gebruiken om alles weer te geven, zowel films, series, collectie van films, ...
// alhoewel films en series soms wel andere data properties hebben dus er zal wrs met een v-if gewerkt moeten worden om een van de twee te tonen ofzo
export default {
  props: ['auth'],
  data () {
    return {
      movies: [],
      tvSeries: [],
      errors: [],
      searchTerm: '',
      timeout: null,
      suggestions: [],
      baseUrlPoster: 'https://image.tmdb.org/t/p/w342',
      total_results_movies: 0,
      total_results_series: 0,
      genres: [],
      tvGenres: [],
      currentPage: 1,
      total_pages: 0,
      other_pages: [2, 3, 4],
      showMovies: true
    }
  },
  computed: {
    getTotalPages () {
      return this.total_pages >= 1000 ? 1000 : this.total_pages
    }
  },
  watch: {
    '$route': {
      deep: true,
      handler: function (refreshPage) {
        this.currentPage = parseInt(refreshPage.query.page)
        if (this.currentPage - 1 > 2 && this.currentPage - 1 < this.total_pages) {
          this.other_pages = [this.currentPage - 1, this.currentPage, parseInt(this.currentPage) + 1]
        }

        if (this.$route.query.content) {
          if (this.$route.query.content === 'movies') {
            this.showMovies = true
          } else if (this.$route.query.content === 'tv') {
            this.showMovies = false
          }
        }

        this.searchTerm = refreshPage.query.q
        this.searchMovies()
        this.searchTvSeries()
      }
    }
  },
  created () {
    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page)
    }
    if (this.currentPage - 1 > 2 && this.currentPage - 1 < this.total_pages) {
      this.other_pages = [this.currentPage - 1, this.currentPage, parseInt(this.currentPage) + 1]
    }
    this.getMovieGenresFromDatabase()
    this.getTvGenresFromDatabase()
    if (this.$route.query.q) {
      this.searchTerm = this.$route.query.q
      this.searchMovies()
      this.searchTvSeries()
    }
    if (this.$route.query.content) {
      if (this.$route.query.content === 'movies') {
        this.showMovies = true
      } else if (this.$route.query.content === 'tv') {
        this.showMovies = false
      }
    }
  },
  methods: {
    checkCurrentPage (num) {
      let tempNumber = 0
      if ((this.currentPage - 1) < 3) {
        tempNumber = num
      } else {
        tempNumber = this.currentPage - 1
      }
      const test = this.currentPage === tempNumber
      return test
    },
    getMovieGenresFromDatabase () {
      axios
        .get(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US'
        )
        .then(response => {
          this.genres = response.data.genres
        })
    },
    getTvGenresFromDatabase () {
      axios
        .get(
          'https://api.themoviedb.org/3/genre/tv/list?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US'
        )
        .then(response => {
          this.tvGenres = response.data.genres
        })
    },
    getGenresMovies (movie) {
      let genresString = ''
      for (let i = 0; i < movie.genre_ids.length; i++) {
        genresString += this.genres.find(e => e.id === movie.genre_ids[i]).name
        if (i !== movie.genre_ids.length - 1) {
          genresString += ', '
        }
      }
      return genresString
    },
    getGenresTvSeries (tvSerie) {
      let genresString = ''
      for (let i = 0; i < tvSerie.genre_ids.length; i++) {
        genresString += this.tvGenres.find(e => e.id === tvSerie.genre_ids[i]).name
        if (i !== tvSerie.genre_ids.length - 1) {
          genresString += ', '
        }
      }
      return genresString
    },
    searchMovies () {
      const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&query=${this.searchTerm}&page=${this.currentPage}`
      axios
        .get(
          searchMoviesUrl
        )
        .then(response => {
          this.movies = response.data.results
          this.total_results_movies = response.data.total_results
          this.total_pages = response.data.total_pages
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    searchTvSeries () {
      const searchTvSeriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&query=${this.searchTerm}&page=${this.currentPage}`
      axios
        .get(
          searchTvSeriesUrl
        )
        .then(response => {
          this.tvSeries = response.data.results
          this.total_results_series = response.data.total_results
          this.total_pages = response.data.total_pages
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.filter p {
  font-weight: bold;
  margin: 0;
}

.filter {
  width: 20%;
  margin: 0;
}

.content {
  display: flex;
  justify-content: space-between;
}

.movies-overview {
  width: 75%;
  margin: 0;

  .pagination {

    ul {
      list-style: none;
      display: flex;
    }
  }
}

.movie-overview {
  display: flex;
  padding: 10px;
  border: 1px solid rgb(201, 201, 201);
  border-radius: 15px;
  margin-bottom: 20px;
  background-color: rgb(240, 240, 240);

  a {
    margin: 0;
  }

  img {
    margin: 0;
    height: 350px;
    width: 233px;
  }

  .movie-content {
    margin: 0 0 0 12px;
    width: 100%;
    position: relative;

    .title-rating {
      display: flex;
      justify-content: space-between;

      .icon-subtitle i {
        vertical-align: text-bottom;
        width: 20px;
        color: #FFD700;
      }
    }

    .subtitle-overview {
      font-weight: bold;
    }

    a {
      font-size: 0.7em;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}

.not-active {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  color: black;
  padding: 0px 10px 0px 10px;
  background-color: rgb(201, 201, 201);
}
</style>
