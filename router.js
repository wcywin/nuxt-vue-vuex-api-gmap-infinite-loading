import Vue from 'vue'
import Router from 'vue-router'
import RoutesDictionary from '@/assets/javascript/dictionaries/routes'

Vue.use(Router)

const HOME = () => import('~/pages/home/index.vue').then(m => m.default || m)

export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    routes: [
      {
        path: '/',
        component: HOME,
        name: RoutesDictionary.HOME
      }
    ]
  })
}
