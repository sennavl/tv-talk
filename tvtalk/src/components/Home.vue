<template>
  	<div id="wrapper">
		<!-- Main -->
		<div id="main">
			<div class="inner">
				<header>
					<h1>TvTalk is a tv platform where you can find movies, series and discuss live event</h1>
				</header>
				<h2>Popular movies</h2>
				<section class="tiles" v-if="popularMovies && popularMovies.length">
					<article v-for="movie of popularMovies" :key="movie.id">
						<span class="image">
							<img :src=baseUrlPoster+movie.poster_path alt="" />
						</span>
						<router-link :to="{ name: 'details', params: { id: movie.id }}">
							<h2>{{movie.title}}</h2>
							<div class="content">
								<p>{{movie.overview.substring(0, 75) + "..."}}</p>
							</div>
						</router-link>
					</article>
				</section>
			</div>
		</div>
  	</div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  props: ["auth", "authenticated"],
  data() {
    return {
      popularMovies: [],
      errors: [],
      baseUrlPoster: "https://image.tmdb.org/t/p/original"
    };
  },
  created() {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/popular?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US&page=1"
      )
      .then(response => {
        //console.log(response.data.results);
        this.popularMovies = response.data.results.splice(0, 3);
      })
      .catch(e => {
        this.errors.push(e);
	  });
  }
};
</script>

<style>
a {
  cursor: pointer;
}
</style>

