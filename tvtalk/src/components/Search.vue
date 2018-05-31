<template>
<div id="main">
  <div class="inner" v-if="movies">
    <h1>Search results - {{ searchTerm }}</h1>
    <div class="content">
      <div class="filter">
        <h2>Filter</h2>
        <ul>
          <li>Movies - {{ total_results }}</li>
          <li>Tv series</li>
        </ul>
      </div>
      <div class="movies-overview">
        <h2>{{ total_results }} results</h2>
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
            <p><span class="subtitle-overview">Genres: </span>{{ getGenres(movie) || 'No genres available yet' }}</p>
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
            <li><router-link :to="{ name: 'search', query: { page: getTotalPages, q: searchTerm }}" :class="currentPage === getTotalPages ? 'not-active' : ''">{{ getTotalPages }}</router-link></li>
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
      errors: [],
      searchTerm: '',
      timeout: null,
      suggestions: [],
      baseUrlPoster: 'https://image.tmdb.org/t/p/w342',
      total_results: 0,
      genres: [],
      currentPage: 1,
      total_pages: 0,
      other_pages: [2, 3, 4]
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
        this.searchTerm = refreshPage.query.q
        this.searchMovies()
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
    this.getGenresFromDatabase()
    if (this.$route.query.q) {
      this.searchTerm = this.$route.query.q
      this.searchMovies()
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
    getGenresFromDatabase () {
      axios
        .get(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US'
        )
        .then(response => {
          this.genres = response.data.genres
        })
    },
    updateSearch (search) {
      this.searchTerm = search.name
    },
    getGenres (movie) {
      let genresString = ''
      for (let i = 0; i < movie.genre_ids.length; i++) {
        genresString += this.genres.find(e => e.id === movie.genre_ids[i]).name
        if (i !== movie.genre_ids.length - 1) {
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
          this.total_results = response.data.total_results
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
