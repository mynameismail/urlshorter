const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: (to, from, next) => {
      let basicAuth = localStorage.getItem('basic_auth')
      if (!basicAuth) {
        next({ path: '/login' })
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/app',
  routes: routes
})

const app = new Vue({
  router
}).$mount('#app')
