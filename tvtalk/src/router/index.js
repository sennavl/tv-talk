import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Test from '@/components/Test'
import Profile from '@/components/Profile'
import MovieDetails from '@/components/MovieDetails'
import SeriesDetails from '@/components/SeriesDetails'
import Chatroom from '@/components/Chatroom'
import Overview from '@/components/Overview'
import OverviewTv from '@/components/OverviewTv'
import Search from '@/components/Search'
import Events from '@/components/Events'
import SubEvents from '@/components/SubEvents'
import AuthService from './../auth/AuthService'

Vue.use(Router)

const auth = new AuthService()

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/chatroom',
      name: 'Chatroom',
      component: Chatroom,
      beforeEnter: (to, from, next) => {
        if (!auth.isAuthenticated()) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: (to, from, next) => {
        if (!auth.isAuthenticated()) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/movies/:id/details',
      name: 'movieDetails',
      component: MovieDetails,
      props: true
    },
    {
      path: '/series/:id/details',
      name: 'seriesDetails',
      component: SeriesDetails,
      props: true
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview,
      props: true
    },
    {
      path: '/overviewTv',
      name: 'overviewTv',
      component: OverviewTv,
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      props: true
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
      props: true
    },
    {
      path: '/subEvents/:id',
      name: 'subEvents',
      component: SubEvents,
      props: true
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

export default router
