import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'

//引入组件
import Recommend from '../views/Recommend.vue'
import Comment from '../views/reuse/Comment.vue'
import Counter from '../views/reuse/Counter.vue'
import Video from '../views/reuse/Video.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path: '/music',
    name: 'Music',
    component: () => import('../views/Music.vue')
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/newsong',
    name: 'NewSong',
    component: () => import('../views/NewSong.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import('../views/Singer.vue')
  },
  {
    path: '/songlist',
    name: 'SongList',
    component: () => import('../views/SongList.vue')
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import('../views/Playlist.vue')
  },
  {
    path: '/singermessage',
    name: 'SingerMessage',
    component: () => import('../views/SingerMessage.vue')
  },
  {
    path: '/newsongmessage',
    name: 'NewsongMessage',
    component: () => import('../views/NewsongMessage.vue')
  },
  {
    path: '/suggest',
    name: 'Suggest',
    component: () => import('../views/Suggest.vue')
  },
  {
    path: '/me',
    name: 'Me',
    beforeEnter(to,from,next){
      if(store.state.user.isLogin){
        next()
      } else {
        next('/login')
      }
    },
    component: () => import('../views/homepage/Me.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/homepage/Login.vue')
  },
  {
    path: '/mv',
    name: 'MV',
    component: () => import('../views/MV.vue')
  },
  {
    path: '/mvmessage',
    name: 'MvMessage',
    component: () => import('../views/MvMessage.vue')
  },
  {
    path: '/comment',
    name: 'Comment',
    component: Comment
  },
  {
    path: '/counter',
    name: 'Counter',
    component: Counter
  },
  {
    path: '/video',
    name: 'video',
    component: Video
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router
