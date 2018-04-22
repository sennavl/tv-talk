<template>
<div id="main">
  <div class="inner">
    <header>
        <h1>Overview</h1>
        {{ results }}
    </header>
    <section>
      <h2>Title</h2>
      <div class="6u 12u$(xsmall)">
        <input type="text" placeholder="Search" v-model="searchTerm" />
        <div id="livesearch">
          <p v-if="suggestions.length > 0"  v-for="suggestion of suggestions" :key="suggestion.id" @click="updateSearch(suggestion)">
            {{ suggestion.name || suggestion }}
          </p>
        </div>
      </div>
      <section class="tiles">
          <article>
              <span class="image">

              </span>
              <a href="generic.html">
                  <h2>Magna</h2>
                  <div class="content">
                      <p>Sed nisl arcu euismod sit amet nisi lorem etiam dolor veroeros et feugiat.</p>
                  </div>
              </a>
          </article>
      </section>
    </section>
  </div>
</div>
</template>

<script>
import axios from 'axios'
// overviewpagina gebruiken om alles weer te geven, zowel films, series, collectie van films, ...
// alhoewel films en series soms wel andere data properties hebben dus er zal wrs met een v-if gewerkt moeten worden om een van de twee te tonen ofzo
export default {
  props: ['auth', 'results'],
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
  #livesearch {
    border: 1px solid #A5ACB2
  }

  p {
    margin: 0px;
    border-bottom: 1px solid #A5ACB2;
    cursor: pointer;
  }

  p:hover {
    background-color: #f2849e;
  }
</style>
