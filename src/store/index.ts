import Vue from 'vue'
import Vuex from 'vuex'

// @ts-ignore
import {getCellphone,getUserdetail,getUserplaylist,getShareresource,getResourceLike} from '@/api/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //音乐时间
    musicTime:'',
    //歌词
    lyricGroup:{},
    //歌曲ID
    musicId:0,
    //歌曲列表
    list:[],
    //登录
    user: JSON.parse(localStorage.getItem('feng') as string) || {
      isLogin:false,
      account:{},//账号信息
      cookie:{},
      profile:{},//个人信息
      getDetail:{},//用户详情
      playlist:[],//用户个人列表
    },
  },
  mutations: {
    //换算音乐时间
    calculateMusic(state,time) {
      let oal = time/1000
      let min = oal/60
      min = Math.trunc(min)
      let sec = oal-min*60
      sec = Math.trunc(sec)
      let m = ''
      let s = ''
      if(min < 10) m = '0'+ min 
      else m = JSON.stringify(min)
      if(sec < 10) s = '0' + sec  
      else s = JSON.stringify(sec)
      state.musicTime = m + ':' + s
    },
    //分解歌词
    lyricTime(state,lyric) {
      let lyricArr = lyric.split('[').slice(1)//对"["进行分割
      let lyricObj = {}
      lyricArr.forEach((item:any) => {
          let arr = item.split(']')//再对"]"进行分割
          //换算时间，单位：秒
          let m = parseInt(arr[0].split(':')[0])
          let s = parseInt(arr[0].split(':')[1])
          arr[0] = m*60 + s
          if(arr[1] != '\n') {//去除歌词中的换算符
              // @ts-ignore
              lyricObj[arr[0]] = arr[1]
          }
      })
      state.lyricGroup = lyricObj
    },
    musicUrl(state,id){
      if(state.musicId != id){
        state.musicId = id
      }
    },
    musicList(state,list){
      if(state.list != list){
        state.list = list
      }
    },
    setData(state,Value){//存储到浏览器的cookie
      localStorage.setItem('feng',JSON.stringify(Value))
      state.user = Value
    }
  },
  getters:{
    //实时刷新musicId
    getMusicUrl:state =>{
      return state.musicId
    },
    getList:state =>{
      return state.list
    },
    getLogin:state =>{
      return state.user.isLogin
    }
  },
  actions: {
    async checkout(context,phone){
      let player = await getCellphone(phone.account,phone.password)
      if(player.data.code === 200){
        context.state.user.isLogin = true
        context.state.user.cookie = player.data.cookie
        context.state.user.account = player.data.account
        context.state.user.profile = player.data.profile
        let userDeatil = await getUserdetail(player.data.account.id)
        let playlistValue = await getUserplaylist(player.data.account.id)
        context.state.user.playlist = playlistValue.data.playlist
        context.state.user.getDetail = userDeatil.data
        context.commit('setData',context.state.user)
      }
      return player
    },
    async getShare(state,content){//分享动态
      await getShareresource(content.type,content.id,content.msg,content.cookie)
    },
    async setResourceLike(state,like){
      console.log(like);
      await getResourceLike(like.t,like.type,like.id,like.cookie)      
    }
  },
  modules: {
  }
})
