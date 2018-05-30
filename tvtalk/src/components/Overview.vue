<template>
<div id="main">
  <div class="inner" v-if="movies">
    <h1>Overview - movies</h1>
    <div class="content">
      <div class="filter">
        <h2>Filter</h2>
        <p>Release date</p>
        <input type="number" name="demo-name" id="demo-name" value="" placeholder="Name" />
        <p>Genres</p>
        <div class="select-wrapper">
          <select name="demo-category" id="demo-category">
            <option value="">- Category -</option>
            <option value="1">Manufacturing</option>
            <option value="1">Shipping</option>
            <option value="1">Administration</option>
            <option value="1">Human Resources</option>
          </select>
        </div>
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
            <p v-else>{{ movie.overview }}</p>
            <p><span class="subtitle-overview">Release date: </span>{{ movie.release_date }}</p>
            <p><span class="subtitle-overview">Genres: </span>{{ getGenres(movie) }}</p>
            <router-link class="button" :to="{ name: 'movieDetails', params: { id: movie.id }}">See more</router-link>
          </div>
        </div>
        <div class="pagination">
          <ul>
            <li><router-link :to="{ name: 'overview', query: { page: 1 }}" :class="currentPage === 1 ? 'not-active' : ''">1</router-link></li>
            <li><router-link :to="{ name: 'overview', query: { page: 2 }}" :class="currentPage === 2 ? 'not-active' : ''">2</router-link></li>
            <li><a href="">3</a></li>
            <li><a href="">4</a></li>
            <li><router-link :to="{ name: 'overview', query: { page: getTotalPages }}" :class="currentPage === getTotalPages ? 'not-active' : ''">{{ getTotalPages }}</router-link></li>
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
  props: ['auth', 'results', 'pages', 'numberResults', 'getUrl'],
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
      total_pages: 0
    }
  },
  computed: {
    getTotalPages () {
      return this.total_pages >= 1000 ? 1000 : this.total_pages
    }
  },
  watch: {
    searchTerm: function (val, oldVal) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.getMovies(val) }, 1000)
    },
    '$route': {
      deep: true,
      handler: function (refreshPage) {
        this.currentPage = refreshPage.query.page
        this.getMovies()
      }
    }
  },
  created () {
    if (this.$route.query.page) {
      this.currentPage = this.$route.query.page
    }
    this.getGenresFromDatabase()
    this.getMovies()
  },
  methods: {
    getGenresFromDatabase () {
      axios
        .get(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US'
        )
        .then(response => {
          this.genres = response.data.genres
        })
    },
    getMovies () {
      axios
        .get(
          `https://api.themoviedb.org/3/discover/movie?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&sort_by=popularity.desc&page=${this.currentPage}`
        )
        .then(response => {
          this.movies = response.data.results
          this.total_results = response.data.total_results
          this.total_pages = response.data.total_pages
        })
        .catch(e => {
          this.errors.push(e)
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
    li {
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
      float: right;
    }
  }
}

.not-active {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  color: black;
}
</style>
