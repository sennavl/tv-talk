<template>
	<div id="main">
		<div class="inner">
			<h1>{{movie.title}}</h1>
			<span class="image main"><img src="images/pic13.jpg" alt="" /></span>
			{{movie}}
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
  props: ['auth', 'id'],
  data () {
    return {
		movie: {}
    }
  },
  created() {
	axios
      .get(
        "https://api.themoviedb.org/3/movie/" + this.id + "?api_key=09767dbf40d373b1e78aa80db4deefc9&language=en-US"
      )
      .then(response => {
        this.movie = response.data;
      })
      .catch(e => {
        this.errors.push(e);
      });
  }
}
</script>

<style>

</style>
