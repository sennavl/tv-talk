import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Test from '@/components/Test'
import Profile from '@/components/Profile'
import Details from '@/components/Details'
import Chatroom from '@/components/Chatroom'
import Overview from '@/components/Overview'
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
      component: Chatroom
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
      component: Details,
      props: true
    },
    {
      path: '/movies/:id/details',
      name: 'seriesDetails',
      component: Details,
      props: true
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview,
      props: true
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

export default router
