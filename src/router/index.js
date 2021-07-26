import Vue from 'vue'
import VueRouter from 'vue-router'
import Kanban from '../views/Kanban.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Kanban',
    component: Kanban,
    beforeEnter: async (to, from, next) => {
      const token = localStorage.getItem('token');
      if(token) {
        next();
      } else {
        next({name: 'Sign In'})
      }
    }
  },
  {
    path: '/sign_in',
    name: 'Sign In',
    component: SignIn
  },
  {
    path: '/sign_up',
    name: 'Sign Up',
    component: SignUp
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
