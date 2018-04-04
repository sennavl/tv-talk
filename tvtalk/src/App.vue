<template>

	<div id="wrapper">
	  	<header id="header">
			<div class="inner">
				<!-- Logo -->
				<a href="index.html" class="logo">
					<span class="symbol"><img src="images/logo.svg" alt="" /></span><span class="title">Phantom</span>
				</a>
				<!-- Nav -->
				<nav>
					<ul>
						<li><a href="#menu">Menu</a></li>
					</ul>
				</nav>
			</div>
		</header>

		<!-- Menu -->
		<nav id="menu">
			<h2>Menu</h2>
			<ul>
				<li><a href="index.html">Home</a></li>
				<li><a v-if="!authenticated" @click.stop.prevent="login()">Log in</a></li>
				<li><a v-if="authenticated" @click.stop.prevent="logout()">Log out</a></li>
				<li><a href="generic.html">Tempus etiam</a></li>
				<li><a href="generic.html">Consequat dolor</a></li>
				<li><a href="elements.html">Elements</a></li>
			</ul>
		</nav>

		<router-view
        :auth="auth"
        :authenticated="authenticated"
        :admin="admin">
      	</router-view>

		<!-- Footer -->
		<footer id="footer">
			<div class="inner">
				<section>
					<h2>Get in touch</h2>
					<form method="post" action="#">
						<div class="field half first">
							<input type="text" name="name" id="name" placeholder="Name" />
						</div>
						<div class="field half">
							<input type="email" name="email" id="email" placeholder="Email" />
						</div>
						<div class="field">
							<textarea name="message" id="message" placeholder="Message"></textarea>
						</div>
						<ul class="actions">
							<li><input type="submit" value="Send" class="special" /></li>
						</ul>
					</form>
				</section>
				<section>
					<h2>Follow</h2>
					<ul class="icons">
						<li><a href="#" class="icon style2 fa-twitter"><span class="label">Twitter</span></a></li>
						<li><a href="#" class="icon style2 fa-facebook"><span class="label">Facebook</span></a></li>
						<li><a href="#" class="icon style2 fa-instagram"><span class="label">Instagram</span></a></li>
						<li><a href="#" class="icon style2 fa-dribbble"><span class="label">Dribbble</span></a></li>
						<li><a href="#" class="icon style2 fa-github"><span class="label">GitHub</span></a></li>
						<li><a href="#" class="icon style2 fa-500px"><span class="label">500px</span></a></li>
						<li><a href="#" class="icon style2 fa-phone"><span class="label">Phone</span></a></li>
						<li><a href="#" class="icon style2 fa-envelope-o"><span class="label">Email</span></a></li>
					</ul>
				</section>
				<ul class="copyright">
					<li>&copy; Untitled. All rights reserved</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
				</ul>
			</div>
		</footer>
  </div>
</template>

<script>
import AuthService from './auth/AuthService'
import axios from "axios";

const auth = new AuthService()

const { login, logout, authenticated, admin, authNotifier } = auth

export default {
  name: 'app',
  data () {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
      this.admin = authState.admin
    })
    return {
      auth,
      authenticated,
	  admin,
	  popularMovies: [],
      errors: [],
      baseUrlPoster: "https://image.tmdb.org/t/p/original"
    }
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
  },
  methods: {
    login,
    logout
  }
}
</script>

<style>

.btn-margin {
  margin-top: 7px
}

img {
  width: 200px;
}
</style>
