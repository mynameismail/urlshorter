const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  mode: 'history',
  base: '/app',
  routes: routes
})

const app = new Vue({
  router
}).$mount('#app')
