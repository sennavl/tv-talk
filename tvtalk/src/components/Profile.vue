<template>
  <div id="wrapper">
    <div id="main">
      <div class="inner">
        <div class="panel-heading">
          <h1>Profile</h1>
        </div>
        <div class="panel-body">
          <img :src="profile.picture" class="avatar" alt="avatar">
          <div class="user-information">
            <div>
              <h2>Nickname</h2>
              <p class="nickname">{{ profile.nickname }}</p>
            </div>
            <div>
              <h2>Email</h2>
              <p class="email">{{ profile.name }}</p>
            </div>
          </div>
        </div>

        <section class="favoriteMovies">
          <h2>Favorite movies</h2>
          <section class="tiles" v-if="favoriteMovies && favoriteMovies.length > 0">
            <article v-for="(movie, index) of favoriteMovies" :key="movie.id" v-if="(!showAllFavoriteMovies && index < 3) || showAllFavoriteMovies">
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
            <article>
              <p v-if="!showAllFavoriteMovies && favoriteMovies.length > 3"><a @click="showAllFavoriteMovies = true">Show all</a></p>
              <p v-if="showAllFavoriteMovies && favoriteMovies.length > 3"><a @click="showAllFavoriteMovies = false">Show less</a></p>
            </article>
          </section>
          <section v-else>
            <p>You haven't added any movie to your favorites yet.</p>
          </section>
        </section>

        <section class="favoriteMovies">
          <h2>Favorite tv series</h2>
          <section class="tiles" v-if="favoriteSeries && favoriteSeries.length > 0">
            <article v-for="(movie, index) of favoriteSeries" :key="movie.id" v-if="(!showAllFavoriteSeries && index < 3) || showAllFavoriteSeries">
              <span class="image">
                <img :src=baseUrlPoster+movie.poster_path alt="" />
              </span>
              <router-link :to="{ name: 'seriesDetails', params: { id: movie.serie_id }}">
                <h2>{{movie.title}}</h2>
                <div class="content">
                  <p>Click to see more</p>
                </div>
              </router-link>
            </article>
            <article>
              <p v-if="!showAllFavoriteSeries && favoriteSeries.length > 3"><a @click="showAllFavoriteSeries = true">Show all</a></p>
              <p v-if="showAllFavoriteSeries && favoriteSeries.length > 3"><a @click="showAllFavoriteSeries = false">Show less</a></p>
            </article>
          </section>
          <section v-else>
            <p>You haven't added any tv serie to your favorites yet.</p>
          </section>
        </section>

        <section>
          <h2>Lists</h2>
          <div class="table-wrapper">
            <table>
              <tbody>
                <tr v-if="lists.length > 0" v-for="list in lists" :key="list.id">
                  <td width="86%"><router-link :to="{ name: 'List', params: { id: list._id }}">{{ list.name }}</router-link></td>
                  <td width="7%"><router-link :to="{ name: 'List', params: { id: list._id }}" style="color: green; border-bottom: none;">View</router-link></td>
                  <td width="7%"><a style="color: red; border-bottom: none;" @click="askDeleteConfirmation(list._id)">Delete</a></td>
                </tr>
                <tr v-if="lists.length === 0">
                  <td>You don't have any lists yet, go to a movie or tv serie you want to add to a list</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div id="myModal" class="modal" v-if="showDeleteConfirmationDialog">
          <!-- Modal content -->
          <div class="modal-content">
            <div class="modal-header">
              <span class="close" @click="showDeleteConfirmationDialog = false">&times;</span>
              <h2>Are you sure you want to delete this list?</h2>
            </div>
            <div class="modal-body">
              <div class="options">
                <a class="button special" @click="deleteList()">Yes</a>
                <a class="button" @click="showDeleteConfirmationDialog = false">No</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['auth'],
  data () {
    if (this.auth.userProfile) {
      this.$nextTick(() => {
        this.profile = this.auth.userProfile
      })
    } else {
      this.auth.getProfile((err, profile) => {
        if (err) return console.log(err)
        this.profile = profile
      })
    }
    return {
      profile: {},
      favoriteMovies: [],
      baseUrlPoster: 'https://image.tmdb.org/t/p/original',
      showAllFavoriteMovies: false,
      showAllFavoriteSeries: false,
      lists: [],
      favoriteSeries: [],
      showDeleteConfirmationDialog: false,
      listIdToDelete: ''
    }
  },
  created () {
    this.getFavoriteMovies()
    this.getFavoriteSeries()
    this.getLists()
  },
  methods: {
    getFavoriteMovies () {
      axios.get(`http://localhost:3001/favorites/movies`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.favoriteMovies = response.data
          }
        })
    },
    getFavoriteSeries () {
      axios.get(`http://localhost:3001/favorites/series`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.favoriteSeries = response.data
          }
        })
    },
    getLists () {
      axios.get(`http://localhost:3001/lists`,
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.lists = response.data
          } else {
            this.lists = []
          }
        })
    },
    askDeleteConfirmation (listId) {
      this.showDeleteConfirmationDialog = true
      this.listIdToDelete = listId
    },
    deleteList () {
      const listId = this.listIdToDelete
      axios.delete(`http://localhost:3001/list/delete/${listId}`, {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
      })
        .then((response) => {
          if (response.status === 200) {
            this.showDeleteConfirmationDialog = false
            this.getLists()
          }
        })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" type="text/less" scoped>
  .favoriteMovies h2 {
    margin-bottom: 0px
  }

  article p {
    margin-bottom: 0px;
  }

  .tiles {
    margin-top: 0px;
    margin-bottom: 30px;
  }
  .panel-body {
    display: flex;

    div {
      margin: 0;
    }

    img {
      border-radius: 50%;
      width: 160px;
      margin: 0;
      height: 160px;
      margin-right: 20px;
    }

    .user-information {
      h2 {
        margin-bottom: 10px;
      }
    }
  }

  .panel-body h3 {
    margin-top: 0;
  }

  a:hover {
    cursor: pointer;
  }

  .tiles h2 {
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
  }

  .modal {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .modal-header {
    padding: 2px 16px;

    h2 {
      padding-top: 7px;
    }
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: 300px auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 500px; /* Could be more or less, depending on screen size */
  }

  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
