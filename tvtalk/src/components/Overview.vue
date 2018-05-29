<template>
<div id="main">
  <div class="inner">
    <h1>Overview</h1>
    <div class="filter">
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
      suggestions: []
    }
  },
  watch: {
    searchTerm: function (val, oldVal) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.getMovies(val) }, 1000)
    }
  },
  methods: {
    getMovies (search) {
      if (search !== null && search.length > 0) {
        axios
          .get(
            `https://api.themoviedb.org/3/search/keyword?api_key=09767dbf40d373b1e78aa80db4deefc9&query=${search}&page=1`
          )
          .then(response => {
            console.log(response.data.results)
            if (response.data.results.length > 0) {
              this.suggestions = response.data.results
            } else {
              this.suggestions[0] = 'No suggestions'
            }
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    updateSearch (search) {
      this.searchTerm = search.name
    }
  }
}
</script>

<style scoped>
.filter p {
  font-weight: bold;
  margin: 0;
}

.filter {
  width: 250px;
  margin: 0;
}
</style>
