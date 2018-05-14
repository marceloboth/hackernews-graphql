import Vue from 'vue'
import Router from 'vue-router'

import CreateLink from '../components/CreateLink'
import LinkList from '../components/LinkList'
import AppLogin from '../components/AppLogin'
import Search from '../components/Search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: LinkList
    },
    {
      path: '/create',
      component: CreateLink
    },
    {
      path: '/login',
      component: AppLogin
    },
    {
      path: '/search',
      component: Search
    }
  ],
  mode: 'history'
})
