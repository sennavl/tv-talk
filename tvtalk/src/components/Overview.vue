<template>
<div id="main">
  <div class="inner" v-if="movies && ratings">
    <h1>Overview - movies</h1>
    <div class="content">
      <div class="filter">
        <div class="filter-title" @click="toggleFilter()">
          <i class="material-icons">filter_list</i><h2>Filter</h2><i class="material-icons arrow" v-if="!open">keyboard_arrow_down</i><i class="material-icons arrow" v-if="open">keyboard_arrow_up</i>
        </div>
        <div class="filter-content">
          <div class="release-date">
            <p class="title">Release date</p>
            <p class="subtitle">From</p>
            <input type="date" class="date-input" v-model="startDate" placeholder="Name" @blur="startDateChanged()" />
            <p class="subtitle">To</p>
            <input type="date" class="date-input" v-model="endDate" placeholder="Name" @blur="endDateChanged()" />
          </div>
          <div class="genres-filter">
            <p class="title">Genres</p>
            <div v-if="genres.length > 0" v-for="genreLoop of genres" :key="genreLoop.id">
              <input type="checkbox" v-model="genre" :id="'genre_' + genreLoop.id" :value="genreLoop.id"  />
              <label :for="'genre_' + genreLoop.id">{{ genreLoop.name }}</label>
            </div>
          </div>
        </div>

      </div>
      <div class="movies-overview">
        <div class="movie-list-header">
          <h2>{{ total_results }} results</h2>
          <div class="sort">
            <p>Sort by:</p>
            <div class="select-wrapper">
              <select name="demo-category" id="demo-category" v-model="selectedSorting">
                <option value="popularity.desc">Popularity descending</option>
                <option value="popularity.asc">Popularity ascending</option>
              </select>
            </div>
          </div>
        </div>
        <div class="movie-overview" v-for="(movie, index) of movies" :key="movie.id">
          <router-link :to="{ name: 'movieDetails', params: { id: movie.id }}" class="poster"><img :src=baseUrlPoster+movie.poster_path alt=""></router-link>
          <div class="movie-content">
            <div class="title-rating">
              <h3>{{ movie.title }}</h3>
              <p>{{ ratings[index] }} <span class="icon-subtitle"><i class="material-icons">start_rate</i></span></p>
            </div>
            <p v-if="movie.overview.length > 177">{{ movie.overview.substring(0, 177) + '...' }}</p>
            <p v-else-if="movie.overview.length > 0">{{ movie.overview }}</p>
            <p v-else>No overview found.</p>
            <p><span class="subtitle-overview">Release date: </span>{{ movie.release_date.length > 0 ? movie.release_date : 'There is no release date available' }}</p>
            <p><span class="subtitle-overview">Genres: </span>{{ getGenres(movie).length > 0 ? getGenres(movie) : 'There are no genres available' }}</p>
            <router-link class="button" :to="{ name: 'movieDetails', params: { id: movie.id }}">See more</router-link>
          </div>
        </div>
        <div class="pagination">
          <ul>
            <li><a @click="changePage(1)" :class="currentPage == 1 ? 'not-active' : ''">1</a></li>
            <li v-if="total_pages > 4 && currentPage != 1">...</li>
            <li v-if="total_pages > 4" v-for="page of other_pages" :key="page.id"><a v-if="page < getTotalPages" @click="changePage(page)" :class="currentPage === page ? 'not-active' : ''">{{ page }}</a></li>
            <li v-if="total_pages === 3"><a @click="changePage(2)" :class="currentPage == 2 ? 'not-active' : ''">{{ 2 }}</a></li>
            <li v-if="total_pages === 4"><a @click="changePage(2)" :class="currentPage == 2 ? 'not-active' : ''">{{ 2 }}</a></li>
            <li v-if="total_pages === 4"><a @click="changePage(3)" :class="currentPage == 3 ? 'not-active' : ''">{{ 3 }}</a></li>
            <li v-if="total_pages > 4">...</li>
            <li><a v-if="getTotalPages > 1" @click="changePage(getTotalPages)" :class="currentPage == getTotalPages ? 'not-active' : ''">{{ getTotalPages }}</a></li>
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
      genre: [],
      genreString: '',
      currentPage: 1,
      total_pages: 0,
      other_pages: [2, 3, 4],
      startDate: '',
      endDate: '',
      selectedSorting: 'popularity.desc',
      ratings: [],
      open: false
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
        this.currentPage = refreshPage.query.page
        if (this.currentPage - 1 > 2 && this.currentPage - 1 < this.total_pages) {
          this.other_pages = [this.currentPage - 1, this.currentPage, parseInt(this.currentPage) + 1]
        } else {
          this.other_pages = [2, 3, 4]
        }
        this.getMovies()
      }
    },
    genre: function () {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { genres: this.genre })
      })
      this.getMovies()
    },
    selectedSorting: function () {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { sorted: this.selectedSorting })
      })
      this.getMovies()
    }
  },
  created () {
    if (this.$route.query.page) {
      this.currentPage = this.$route.query.page
    }
    if (this.currentPage - 1 > 2 && this.currentPage - 1 < this.total_pages) {
      this.other_pages = [this.currentPage - 1, this.currentPage, parseInt(this.currentPage) + 1]
    }
    if (this.$route.query.startDate) {
      this.startDate = this.$route.query.startDate
    }
    if (this.$route.query.endDate) {
      this.endDate = this.$route.query.endDate
    }
    if (this.$route.query.genres) {
      this.genre = []
      if (Array.isArray(this.$route.query.genres)) {
        this.$route.query.genres.forEach(element => {
          this.genre.push(parseInt(element))
        })
      } else {
        this.genre.push(parseInt(this.$route.query.genres))
      }
    }
    if (this.$route.query.sorted) {
      this.selectedSorting = this.$route.query.sorted
    }
    this.getGenresFromDatabase()
    this.getMovies()
  },
  methods: {
    changePage (page) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { page })
      })
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
    getQueryRoute (type) {
      let obj = {}
      if (this.$route.query.page) {
        obj.page = this.$route.query.page
      }
      if (this.$route.query.genres) {
        obj.genres = this.$route.query.genres
      }
      if (this.$route.query.endDate && type !== 'endDate') {
        obj.endDate = this.$route.query.endDate
      }
      if (this.$route.query.startDate && type !== 'startDate') {
        obj.startDate = this.$route.query.startDate
      }
      if (this.$route.query.sorted) {
        obj.sorted = this.$route.query.sorted
      }
      return obj
    },
    startDateChanged () {
      if (this.startDate.length > 0) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, { startDate: this.startDate })
        })
        this.getMovies()
      } else {
        const queryRoute = this.getQueryRoute('startDate')
        this.$router.push({ name: 'overview', query: queryRoute })
        this.getMovies()
      }
    },
    endDateChanged () {
      if (this.endDate.length > 0) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, { endDate: this.endDate })
        })
        this.getMovies()
      } else {
        const queryRoute = this.getQueryRoute('endDate')
        this.$router.push({ name: 'overview', query: queryRoute })
        this.getMovies()
      }
    },
    getMovies () {
      if (this.genre.length === 1) {
        this.genreString = this.genre[0]
      } else if (this.genre.length > 1) {
        this.genreString = ''
        this.genre.forEach(genreId => {
          this.genreString += genreId + ','
        })
        this.genreString = this.genreString.substring(0, this.genreString.length - 1)
      } else {
        this.genreString = ''
      }
      axios
        .get(
          `https://api.themoviedb.org/3/discover/movie?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&sort_by=${this.selectedSorting}&page=${this.currentPage}&primary_release_date.gte=${this.startDate}&primary_release_date.lte=${this.endDate}&with_genres=${this.genreString}`
        )
        .then(response => {
          this.movies = response.data.results.filter(e => e !== null)
          this.total_results = response.data.total_results
          this.total_pages = response.data.total_pages
        })
        .then(() => {
          this.getRatings()
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    getGenres (movie) {
      let genresString = ''
      for (let i = 0; i < movie.genre_ids.length; i++) {
        if (this.genres.find(e => e.id === movie.genre_ids[i])) {
          genresString += this.genres.find(e => e.id === movie.genre_ids[i]).name
          if (i !== movie.genre_ids.length - 1) {
            genresString += ', '
          }
        }
      }
      return genresString
    },
    getRatings () {
      this.movies.forEach(movie => {
        axios.get(`http://localhost:3001/averageRating?movie_id=${movie.id}`)
          .then((response) => {
            this.ratings.push(response.data)
          })
      })
    },
    toggleFilter () {
      const element = this.$el.querySelector('.filter-content')
      const style = window.getComputedStyle(element)
      const display = style.getPropertyValue('display')

      if (display === 'block') {
        this.$el.querySelector('.filter-content').style.display = 'none'
        this.open = false
      } else if (display === 'none') {
        this.$el.querySelector('.filter-content').style.display = 'block'
        this.open = true
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.filter p.title {
  font-weight: bold;
  margin: 0;
}

h2 {
  font-size: 1.1em;
}

.filter p.subtitle {
  margin: 0;
}

.filter {
  width: 20%;
  margin: 0;

  .filter-content {
    display: block;

    .release-date {
      margin-bottom: 30px;
    }

    .genres-filter {
      margin-bottom: 8px;
    }
  }

  .filter-title {
    display: flex;

    i {
      margin: 2px 10px 0px 0px;
    }

    .arrow {
      display: none;
    }
  }
}

.content {
  display: flex;
  justify-content: space-between;
}

.movies-overview {
  width: 75%;
  margin: 0;

  .movie-list-header {
    display: flex;
    justify-content: space-between;
    height: 70px;

    h2 {
      margin-top: 15px;
    }

    .sort {
      margin: 0;

      .select-wrapper {
        width: 220px;
      }

      p {
        margin: 10px 10px 0 0;
        float: left;
        font-weight: bold;
      }

      div {
        float: left;
      }
    }
  }

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

      h3 {
        font-size: 1.3em;
        margin-bottom: 1.5em;
        max-width: 77%;
      }

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

.date-input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgb(201, 201, 201);
}

@media screen and (max-width: 1280px) {
  .filter .filter-title i {
    margin: 0px 10px 0px 0px;
  }
}

@media screen and (max-width: 736px) {
  .content {
    display: block;
    width: 100%;

    .filter {
      width: 100%;

      .filter-title {
        border: 1px solid rgb(201,201,201);
        border-radius: 5px;
        height: 2em;
        cursor: pointer;

        .arrow {
          display: block;
          margin-left: auto;
        }
      }

      .filter-content {
        display: none;
      }
    }

    .movies-overview {
      width: 100%;
    }

    .movie-list-header {
      display: block;
      height: 100%;

      .sort {
        display: flex;
        margin-bottom: 20px;

        p {
          float: none;
          margin-right: 20px;
        }

        div {
          float: none;
          margin: 0;
        }
      }
    }
  }
}

@media screen and (max-width: 595px) {
  .movie-overview {
    display: block;
    .title-rating p {
      margin-right: 10px;
    }

    .movie-content {
      height: 100%;
      position: initial;

      a {
        position: initial;
      }
    }
  }
}
</style>
