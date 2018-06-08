<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <h1>List</h1>
        <section v-if="movies.length > 0">
          <h2>Movies</h2>
          <section class="tiles" v-if="movies && movies.length">
            <article v-for="movie of movies" :key="movie.id">
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
          </section>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['id'],
  data () {
    return {
      baseUrlPoster: 'https://image.tmdb.org/t/p/original',
      movies: [],
      series: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      axios.get(`http://localhost:3001/list/movies?list_id=${this.id}`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.movies = response.data
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
