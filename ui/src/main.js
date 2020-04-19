import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Index from './components/Index.vue'
import Console from './components/Console.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {path: '/', component: Index},
    {path: '/console/:target', component: Console}
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
