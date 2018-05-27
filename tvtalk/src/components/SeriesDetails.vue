<template>
  <div id="main">
    <div class="inner">
      <a @click.stop.prevent="returnToPreviousPage">&lt; back</a>
      <h1>{{serie.name}}</h1>
      <span class="image main"><img src="images/pic13.jpg" alt="" /></span>
      {{serie}}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// als film tot collectie behoort laten doorverwijzen naar overview-pagina met deze data: https://api.themoviedb.org/3/collection/344830?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US
export default {
  props: ['auth', 'id'],
  data () {
    return {
      serie: {}
    }
  },
  created () {
    axios
      .get(
        'https://api.themoviedb.org/3/tv/' + this.id + '?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US'
      )
      .then(response => {
        this.serie = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    returnToPreviousPage () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
a {
    cursor: pointer;
}
</style>
