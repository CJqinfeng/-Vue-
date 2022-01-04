<template>
  <div class="header">
      <div class="left all">
        <div class="Myimg">
          <router-link :to="Login ? '/me' : '/login'" ><img :src="Meimg" :onerror="Img"></router-link>
          <router-link :to="Login ? '/me' : '/login'" ><span class="all">{{ Login ? name : '请登录'}}</span></router-link>
        </div>
      </div>
      <div class="centent all">
        <router-link class="all hove link " to="/recommend" exact >推荐</router-link>
        <router-link class="all hove link " to="/songlist" >歌单</router-link>
        <router-link class="all hove link " to="/singer" >歌手</router-link>
        <router-link class="all hove link " to="/newsong" >新碟上架</router-link>
        <router-link class="all hove link " to="/mv" >MV</router-link>
      </div>
      <div class="right all">
        <div class="search">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo1"></use>
          </svg>
        <input type="text"
          v-model:value="keyword" 
          placeholder="音乐/视频/电台/用户"
          onfocus="if(placeholder==='音乐/视频/电台/用户')placeholder=''" 
          onblur="if(!placeholder)placeholder='音乐/视频/电台/用户'"
          @blur="finishSuggest"
          @focus="beginSuggest"
          @keyup.enter="InputValue(keyword)"
        >
        </div>
        <div class="suggest" v-show="isSuggest">
          <div class="order" v-show="songs.length != 0">
            <div class="title">单曲</div>
            <div class="list">
              <router-link :to="`/music?id=${item.id}`" 
                class="content" v-for="(item,index) in songs" 
                :key="item.id">{{item.name + '-' + songsSinger[index].name}}</router-link>
            </div>
          </div>
          <div class="order" v-show="artists.length != 0">
            <div class="title">歌手</div>
            <div class="list">
              <router-link :to="`/singermessage?id=${item.id}`" class="content" v-for="item in artists" :key="item.id">{{item.name}}</router-link>
            </div>
          </div>
          <div class="order" v-show="albums.length != 0">
            <div class="title">专辑</div>
            <div class="list">
              <router-link :to="`/newsongmessage?id=${item.id}`" 
                class="content" v-for="(item,index) in albums" 
                :key="item.id">{{item.name + '-' + albumsSinger[index].name}}</router-link>
            </div>
          </div>
          <div class="order" v-show="playlists.length != 0">
            <div class="title">歌单</div>
            <div class="list">
              <router-link :to="`/playlist?id=${item.id}`" class="content" v-for="item in playlists" :key="item.id">{{item.name}}</router-link>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import {getSuggest} from '../api/index'
import {mapGetters} from 'vuex'

export default {
    name:"MusicHeader",
    data(){
      return {
        Meimg: this.$store.state.user.profile.avatarUrl || '',
        Login: this.$store.state.user.isLogin || '',
        name: this.$store.state.user.profile.nickname || '',
        //搜索
        keyword:"",
        order:[],
        songs:[],
        songsSinger:[],
        albums:[],
        albumsSinger:[],
        artists:[],
        playlists:[],
        isSuggest:true,
      }
    },
    computed:{
      Img(){
            return 'this.src="'+ require('../assets/images/kabi.jpg') + '"'
        },
      ...mapGetters(['getLogin'])
    },
    methods:{
      //搜索
      async suggest(key){
        if(key === ''){
          this.songs = []
          this.artists = []
          this.albums = []
          this.playlists = []
          this.isSuggest = false
        } else {
          let suggestValue = await getSuggest(key)
          this.order = suggestValue.data.result.order
          this.order.forEach(item => {
              if(item === 'songs') {
                this.songs = suggestValue.data.result.songs
              } else if(item === 'artists') {
                this.artists = suggestValue.data.result.artists
              } else if(item === 'albums') {
                this.albums = suggestValue.data.result.albums
              } else if(item === 'playlists') {
                this.playlists = suggestValue.data.result.playlists
              }
          })
          this.Message()
          this.isSuggest = true
        }
      },
      Message(){
        this.songs.forEach((item,index) => {
          this.songsSinger[index] = item.artists[0]
        })
        this.albums.forEach((item,index) => {
          this.albumsSinger[index] = item.artist
        })
      },
      finishSuggest(){
        setTimeout(() => {
          this.isSuggest = false  
        },200)
      },
      beginSuggest(){
        if(this.keyword === '') return
        this.isSuggest = true
      },
      InputValue(key) {
        this.isSuggest = false
        this.$router.push({
          path:'/suggest',
          query:{
            key:key
          }
        })
      }
    },
    watch:{
      keyword(newValue){
        this.suggest(newValue)
      },
      getLogin(){
        this.Meimg = this.$store.state.user.profile.avatarUrl || '',
        this.Login = this.$store.state.user.isLogin,
        this.name = this.$store.state.user.profile.nickname,
        this.$forceUpdate()
      }
    }
}
</script>

<style lang="less" scoped>
  .header {
    width: 70%;
    height: 70px;
    padding: 0 15%;
    background: #242424;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .all {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .hove {
            cursor: pointer;
        }
    .left {
      width: 15%;
      height: 70px;
      .Myimg {
        width: 150px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        img {
          width: 56px;
          height: 56px;
          margin-top: 5px;
          border-radius: 28px;
        }
        img:hover {
          cursor: pointer;
          box-shadow: 0px 0px 10px #eee;
        }
        span {
          padding: 0 20px;
          color: #fff;
          font-size: 0.85em;
          text-decoration: none;
        }
        span:hover {
          cursor: pointer;
          color: #eee;
          text-decoration: underline;
        }
      }
    }
    .centent {
      flex: 1;
      height: 70px;
      .router-link-active {
        background: #000;
        color: #fff;
      }
      .link {
        width: 100%;
        height: 70px;
        color: #ccc;
        text-decoration: none;
      }
      .link:hover {
        background-color: #000;
        color: #fff;
      }
      

    }
    .right {
      width: 25%;
      height: 70px;
      .search {
        width: 80%;
        height: 40%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: #fff;
        border-radius: 15px;
        .icon {
          width: 10%;
          height: 70;
          margin-right: -7%;
        }
        input {
          width: 80%;
          height: 80%;
          border: none;
          outline: none;
          color: #999;
        }
      }
      .suggest {
        position: absolute;
        left: 1052px;
        top: 55px;
        width: 250px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0px 0px 5px #333;
        .order {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 0.85em;
          .title {
            width: 60px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #333;
            font-weight: 700;
          }
          .list {
            width: 190px;
            padding: 5px 0;
            border-left: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            .content {
              float: left;
              width: 170px;
              padding: 7px 10px;
              font-size: 0.85em;
              color: #777;
              text-decoration: none;
              background: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
            }
            .content:hover {
              cursor: pointer;
              background: #eee;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
</style>