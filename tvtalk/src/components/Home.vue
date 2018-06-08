<template>
  <div id="wrapper">
    <!-- Main -->
    <div id="main">
      <div class="inner">
        <header>
          <h1>Find movies, series and discuss live event</h1>
        </header>
        <section>
          <h2>Popular movies</h2>
          <section class="tiles" v-if="popularMovies && popularMovies.length">
            <article v-for="movie of popularMovies" :key="movie.id">
              <span class="image">
                <img :src=baseUrlPoster+movie.poster_path alt="" />
              </span>
              <router-link :to="{ name: 'movieDetails', params: { id: movie.id }}">
                <h2>{{movie.title}}</h2>
                <div class="content">
                  <p>{{movie.overview.substring(0, 75) + "..."}}</p>
                </div>
              </router-link>
            </article>
          </section>
        </section>

        <section>
          <h2>Popular series</h2>
          <section class="tiles" v-if="popularSeries && popularSeries.length">
            <article v-for="serie of popularSeries" :key="serie.id">
              <span class="image">
                <img :src=baseUrlPoster+serie.poster_path alt="" />
              </span>
              <router-link :to="{ name: 'seriesDetails', params: { id: serie.id }}">
                <h2>{{serie.name}}</h2>
                <div class="content">
                  <p>{{serie.overview.substring(0, 75) + "..."}}</p>
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
  name: 'home',
  props: ['auth', 'authenticated'],
  data () {
    return {
      popularMovies: [],
      errors: [],
      baseUrlPoster: 'https://image.tmdb.org/t/p/original',
      popularSeries: []
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

    axios
      .get(
        'https://api.themoviedb.org/3/tv/popular?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&page=1'
      )
      .then(response => {
        this.popularSeries = response.data.results.splice(0, 3)
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
</script>

<style scoped>
a {
  cursor: pointer;
}

h2 {
  margin-bottom: 0px;
  margin-top: 64px;
}

.tiles {
  margin-top: 0px;
}

.tiles h2 {
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
</style>
