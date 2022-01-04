<template>
  <div class="suggest">
    <div class="inputBox center">
      <input type="text" 
        v-model="keyword" 
        placeholder="音乐/视频/电台/用户"
        onfocus="if(placeholder ==='音乐/视频/电台/用户') placeholder=''" 
        onblur="if(!placeholder)placeholder='音乐/视频/电台/用户'"
        @blur="finishSuggest"
        @focus="beginSuggest"
        @keyup.enter="Cloud" 
      >
      <div class="suggest" v-show="isSuggest" >
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
      <div class="inquire center" @click="Cloud">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-sousuo1"></use>
        </svg>
      </div>
    </div>
    <div class="content">
      <div class="title center">
        <div class="category center" 
            :class="{'active':item.type === isCat}" 
            @click="Cattype(item.type)" v-for="(item,index) in category" 
            :key="index">{{item.name}}</div>
      </div>
      <!-- 歌曲 -->
      <div class="songs" v-show="isCat === 1">
        <div class="songlist" :class="{'bg':(index+1)%2}" v-for="(item,index) in Cloudsongs">
          <div class="song of1">
            <svg class="icon" aria-hidden="true" @click="Play(item.id)">
                <use xlink:href="#icon-kaishi"></use>
            </svg>
            <router-link :to="`/music?id=${item.id}`" class="link">{{item.name}}</router-link>
          </div>
          <div class="song of2"><router-link :to="`/singermessage?id=${item.ar[0].id}`" class="link">{{item.ar[0].name}}</router-link></div>
          <div class="song of3"><router-link :to="`/newsongmessage?id=${item.al.id}`" class="link">《{{item.al.name}}》</router-link></div>
          <div class="song of4">{{dt[index]}}</div>
        </div>
      </div>
      <!-- 歌手 -->
      <div class="singer" v-show="isCat === 100">
        <router-link :to="`/singermessage?id=${item.id}`" class="listContent" v-for="item in Cloudartists" :key="item.id">
          <img :src="`${item.img1v1Url}?param=130y130`">
          <div class="listName center">{{item.name}}</div>
        </router-link>
      </div>
      <!-- 专辑 -->
      <div class="albums" v-show="isCat === 10">
        <router-link :to="`/newsongmessage?id=${item.id}`" class="listContent" v-for="item in Cloudalbums" :key="item.id">
          <img :src="`${item.blurPicUrl}?param=130y130`">
          <div class="listName">{{item.name}}</div>
          <router-link :to="`/singermessage?id=${item.artists[0].id}`" class="acthor">{{item.artists[0].name}}</router-link>
        </router-link>
      </div>
      <!-- 歌单 -->
      <div class="playlists" v-show="isCat === 1000">
        <router-link :to="`/playlist?id=${item.id}&cookie=${cookie}`" class="listContent" v-for="item in Cloudplaylists" :key="item.id">
          <img :src="`${item.coverImgUrl}?param=130y130`">
          <div class="listName">{{item.name}}</div>
        </router-link>
      </div>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
import {getSuggest,getCloudsearch} from '../api/index'

export default {
    name: "suggest",
    data(){
      return {
        cookie:'',
        keyword:this.$route.query.key,//搜索词
        order:[],//歌曲种类数量
        songs:[],//歌曲
        songsSinger:[],//歌曲作者
        albums:[],//专辑
        albumsSinger:[],//专辑作者
        artists:[],//歌手
        playlists:[],//歌单
        isSuggest:false,//显示搜索建议
        isCat:1,//类型
        category:[//选择显示
          {name:'单曲',type:1},
          {name:'歌手',type:100},
          {name:'专辑',type:10},
          {name:'歌单',type:1000},
        ],
        Cloudsongs:[],
        Cloudalbums:[],
        Cloudartists:[],
        Cloudplaylists:[],
        dt:[],
      }
    },
    mounted() {
      if(localStorage.getItem('feng')){
          const user = JSON.parse(localStorage.getItem('feng'))
          this.cookie = encodeURIComponent(user.cookie)
      }
      this.Cloud()
    },
    methods:{
      Play(id) {
          this.$store.commit('musicUrl',id)
      },
      Cattype(type){
        this.isCat = type
        this.Cloud()
      },
      async Cloud(){
        let searchValue = await getCloudsearch(this.keyword,this.isCat)
        if(this.isCat === 1){
          this.Cloudsongs = searchValue.data.result.songs
          this.musictime()
        } else if(this.isCat === 100){
          this.Cloudartists = searchValue.data.result.artists
        } else if(this.isCat === 10){
          this.Cloudalbums = searchValue.data.result.albums
        } else if(this.isCat === 1000){
          this.Cloudplaylists = searchValue.data.result.playlists
        }
        this.isSuggest = false
      },
      //搜索
      async suggest(key){
        if(key === ''){
          this.order = []
          this.songs = []
          this.artists = []
          this.albums = []
          this.playlists = []
          this.isSuggest = false
        } else {
          let suggestValue = await getSuggest(key)
          console.log(suggestValue);
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
        this.suggest(this.keyword)
        this.isSuggest = true
      },
      musictime() {
            //避免v-for陷入死循环
            for(let i = 0;i < this.Cloudsongs.length; i++) {
                this.dt[i] = this.Cloudsongs[i].dt 
                this.$store.commit('calculateMusic',this.dt[i])
                this.dt[i] = this.$store.state.musicTime
            }
        },
    },
    watch:{
      keyword(newValue){
        this.suggest(newValue)
      }
    }
}
</script>

<style lang="less" scoped>
  .suggest {
    width: 60%;
      margin: 2% 20%;
      background: #fff;
      border: 1px solid #ccc;
      .of1 {
        flex: 1;
      }
      .of2 {
        width: 100px;
      }
      .of3 {
        width: 200px;
      }
      .of4 {
        width: 60px;
      }
      .center {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .inputBox{
        width: 60%;
        margin: 70px 20% 30px 20%;
        input {
          width: 350px;
          height: 32px;
          outline-style: none;
          border: 1px solid #ccc;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          padding-left: 20px;
          padding-top: 3px;
          font-size: 0.85em;
          box-shadow: inset 0 0 5px #ccc;
        }
        .inquire {
          margin-left: -135px;
          width: 44px;
          height: 36px;
          border: 1px solid #ccc;
          background: #eee;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          .icon {
            width: 25px;
            height: 25px;
            fill: #aaa;
          }
        }
        .inquire:hover {
          cursor: pointer;
          box-shadow: inset 0 0 10px #fff;
          .icon {
            fill: #ccc;
          }
        }
      }
      .suggest {
        position: absolute;
        left: 250px;
        top: 182px;
        width: 420px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0px 2px 5px #777;
        z-index: 99;
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
            width: 340px;
            padding: 5px 0;
            border-left: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            .content {
              float: left;
              margin: 0;
              width: 340px;
              height: 20px;
              padding: 2px 10px;
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
      .content {
        width: 80%;
        margin: 20px 10%;
        .title {
          width: 100%;
          height: 40px;
          background: #eee;
          user-select: none;
          cursor: pointer;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          .category {
            width: 100%;
            height: 40px;
            border-top: 2px solid #ccc;
            border-bottom: 1px solid #ccc;
          }
          .category:hover {
            border-top: 2px solid rgb(189, 10, 10);
          }
          .active {
            border-top: 2px solid rgb(189, 10, 10);
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            background: #fff;
            border-bottom: none;
          }
        }
        .songs {
          width: 100%;
          padding-top: 20px;
          float: left;
          .songlist {
            width: 100%;
            display: flex;
            padding: 0;
            align-items: center;
            font-size: 0.8em;
            padding: 10px 0;
            .icon {
              width: 17px;
              height: 17px;
              fill: #777;
              margin: 0 15px 0 5px;
            }
            .icon:hover {
              cursor: pointer;
              fill: #ccc;
            }
            .song {
              display: flex;
              align-items: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
              .link {
                text-decoration: none;
                color: #333;
              }
              .link:hover {
                text-decoration: underline;
                color: #777;
              }
            }
          }
          .bg {
            background: #eee;
          }
        }
        .singer {
          width: 100%;
          .listContent {
            float: left;
            padding: 15px 7.9px;
            text-decoration: none;
            img {
              width: 130px;
              height: 130px;
            }
            .listName {
              padding: 10px 0 0 0;
              color: #333;
            }
            .listName:hover {
              cursor: pointer;
              text-decoration: underline;
              color: #777;
            }
          }
        }
        .albums {
          width: 100%;
          .listContent {
            float: left;
            padding: 15px 7.9px;
            text-decoration: none;
            img {
              width: 130px;
              height: 130px;
            }
            .listName {
              width: 130px;
              padding: 5px 0;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
            }
            .listName:hover {
              cursor: pointer;
              text-decoration: underline;
              color: #777;
            }
            .acthor {
              width: 130px;
              font-size: 0.7em;
              text-decoration: none;
              color: #777;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
            }
            .acthor:hover {
              cursor: pointer;
              text-decoration: underline;
              color: #ccc;
            }
          }
        }
        .playlists {
          width: 100%;
          .listContent {
            float: left;
            padding: 15px 7.9px;
            text-decoration: none;
            img {
              width: 130px;
              height: 130px;
            }
            .listName {
              font-size: 0.7em;
              width: 130px;
              padding: 10px 0 0 0;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
            }
            .listName:hover {
              cursor: pointer;
              text-decoration: underline;
              color: #777;
            }
          }
        }
      }
      .clear {
        clear:both;
        height: 100px;
      }
  }
</style>