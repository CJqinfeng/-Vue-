<template>
  <div class="me">
      <div class="content">
          <div class="mypage">
              <div class="left">
                  <img :src="myImg">
                  <div class="quit center" @click="Quit">退出登录</div>
                  <div class="message ">
                      <div class="name center">{{myName}}</div>
                      <div class="lv">Lv：<span>{{lv}}</span></div>
                      <div class="day">您来到网易云已有<span>{{days}}</span>天</div>
                      <div class="listenSongs">累计听歌<span>{{listenSongs}}</span>首</div>
                  </div>
              </div>
              <div class="right">
                  <div class="title">
                      <div class="name">歌单<span>（{{playlists.length}}）</span></div>
                  </div>
                  <div class="content">
                      <router-link :to="`/playlist?id=${item.id}&cookie=${cookie}`" class="playlist" v-for="item in playlists.slice(0,3)" :key="item.id">
                          <img :src="item.coverImgUrl">
                          <div class="song">
                              <div class="name">{{item.name}}</div>
                              <div class="number">
                                  <div class="track">{{item.trackCount}}首</div>
                                  <div class="count">播放{{item.playCount}}次</div>
                              </div>
                          </div>
                      </router-link>
                  </div>
              </div>
          </div>
      </div>
      <div class="playlist">
          <div class="listTitle">
                全部歌单
              <span>（{{playlists.length}}）</span>
          </div>
          <div class="listContent">
                <router-link :to="`/playlist?id=${item.id}&cookie=${cookie}`"
                    class="listSong" :class="{'active': (index+1)%2 }" 
                    v-for="(item,index) in playlists" 
                    :key="item.id"
                >
                    <div class="index">{{index+1}}</div>
                    <img :src="`${item.coverImgUrl}?param=70y70`">
                    <div class="name">{{item.name}}</div>
                    <div class="author">{{item.creator.nickname}}</div>
                    <div class="track">共{{item.trackCount}}首</div>
                    <div class="count">共播放{{changeValue(item.playCount)}}次</div>
                </router-link>
          </div>
      </div>
      <div class="clear"></div>
  </div>
</template>

<script>
import {getUserplaylist,getLogout} from '@/api/index'

export default {
    name: "Me",
    data(){
        return {
            mymessage:{},//个人信息
            myImg:'',//照片
            myName:'',//名字
            lv:'',//等级
            days:'',//时间
            listenSongs:'',//累计听歌数
            playlists:[],//歌单列表
            user:{},
            cookie:'',
        }
    },
    methods:{
        async Quit(){
            await getLogout()
            localStorage.clear()
            this.$router.push('/recommend')
            this.$store.state.user = {
                isLogin:false,
                account:{},//账号信息
                cookie:{},
                profile:{},//个人信息
                getDetail:{},//用户详情
            }
        },
        changeValue(num) {//简化数字
            let res = 0
            if(num>=10000) {
                res = num/10000
                res = res.toFixed(2) + '万'//取小数点后两位

            } else if(num>=100000000) {
                res = num/100000000
                res = res.toFixed(2) + '亿'//取小数点后两位
            } else { res = num }
            return res//返回函数
        },
    },
    async mounted(){
        let playlistValue = await getUserplaylist(this.$store.state.user.getDetail.profile.userId)
        this.playlists = playlistValue.data.playlist
        this.user = JSON.parse(localStorage.getItem('feng'))
        this.cookie = encodeURIComponent(this.user.cookie)
        this.mymessage = this.$store.state.user.getDetail
        this.myImg = this.mymessage.profile.avatarUrl
        this.myName = this.mymessage.profile.nickname
        this.lv = this.mymessage.level
        this.days = this.mymessage.createDays
        this.listenSongs = this.mymessage.listenSongs
    }
}
</script>

<style lang="less" scoped>
    .me {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .content {
            width: 90%;
            margin: 8% 5%;
            .mypage {
                width: 100%;
                display: flex;
                .left {
                    width: 40%;
                    img {
                        width: 100px;
                        height: 100px;
                        position: absolute;
                        left: 472px;
                        top: 120px;
                        border: 2px solid #eee;
                        border-radius: 50px;
                        box-shadow: 0 0 7px #ccc;
                    }
                    .quit {
                        width: 90px;
                        height: 35px;
                        position: absolute;
                        left: 1110px;
                        top: 120px;
                        border: 1px solid #fff;
                        box-shadow: 0 0 5px #ccc;
                        border-radius: 5px;
                        background: rgb(221, 7, 7);
                        color: #fff;
                        font-size: 0.85em;
                        font-weight: 700;
                        user-select: none;
                    }
                    .quit:hover {
                        cursor: pointer;
                        background: rgb(255, 0, 0);
                        box-shadow: inset 0 0 5px #fff;
                    }
                    .message {
                        width: 96%;
                        height: 200px;
                        margin: 0 2%;
                        border: 3px solid #fff;
                        border-radius: 10px;
                        background: rgb(248, 247, 247);
                        box-shadow: 0 0 5px #ccc;
                        padding: 50px 10px 0px 10px;
                        .name {
                            width: 100%;
                            font-size: 1.3em;
                            font-weight: 700;
                            color: #333;
                        }
                        .lv {
                            width: 70%;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            padding-left: 50px;
                            font-size: 1.1em;
                            span {
                                color: rgb(231, 53, 53);
                            }
                        }
                        .day {
                            width: 70%;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            padding-left: 50px;
                            font-size: 1.1em;
                            font-weight: 600;
                            color: #444;
                            span {
                                color: rgb(231, 53, 53);;
                            }
                        }
                        .listenSongs {
                            width: 70%;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            padding-left: 50px;
                            font-size: 1.1em;
                            font-weight: 600;
                            color: #444;
                            span {
                                color: rgb(231, 53, 53);;
                            }
                        }
                    }
                }
                .right {
                    width: 53%;
                    margin: 0 2% 0 5%;
                    height: 250px;
                    border: 3px solid #fff;
                    border-radius: 10px;
                    background: rgb(248, 247, 247);
                    box-shadow: 0 0 5px #ccc;
                    .title {
                        width: 90%;
                        margin: 10px 5%;
                        display: flex;
                        align-items: center;
                        padding-left: 20px;
                        .name {
                            font-size: 1.2em;
                            font-weight: 600;
                            color: #444;
                            span {
                                font-size: 0.85em;
                                font-weight: 500;
                                color: #777;
                            }
                        }
                    }
                    .content {
                        width: 100%;
                        margin: 0;
                        .playlist {
                            width: 90%;
                            height: 60px;
                            margin: 5px 5%;
                            border-radius: 10px;
                            background: #eee;
                            display: flex;
                            align-items: center;
                            text-decoration: none;
                            img {
                                margin-left: 20px;
                                width: 50px;
                                height: 50px;
                                border-radius: 10px;
                            }
                            .song {
                                width: 250px;
                                margin-left: 10px;
                                .name {
                                    font-size: 0.85em;
                                    color: #333;
                                }
                                .number {
                                    width: 250px;
                                    display: flex;
                                    align-items: center;
                                    padding: 5px 10px;
                                    color: #777;
                                    font-size: 0.6em;
                                    .track {
                                        width: 40px;
                                    }
                                }
                            }
                        }
                        .playlist:hover {
                            cursor: pointer;
                            .name { 
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
        }
        .playlist {
            width: 88%;
            margin: 30px 6%;
            .listTitle {
                width: 100%;
                font-size: 1.4em;
                font-weight: 700;
                color: #333;
                padding-bottom: 10px;
                border-bottom: 3px solid rgb(201, 8, 8);
                span {
                    font-size: 0.85em;
                    color: #777;
                }
            }
            .listContent {
                width: 96%;
                margin: 10px 2%;
                .listSong {
                    width: 100%;
                    height: 90px;
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    .index {
                        width: 30px;
                        font-size: 0.9em;
                        padding-left: 15px;
                        color: #777;
                    }
                    img {
                        width: 70px;
                        height: 70px;
                        border-radius: 10px;
                    }
                    .name {
                        width: 250px;
                        font-size: 1em;
                        color: #333;
                        padding-left: 20px;
                    }
                    .author {
                        width: 150px;
                        font-size: 0.9em;
                        color: #444;
                    }
                    .track {
                        width: 120px;
                        font-size: 0.85em;
                        color: #777;
                    }
                    .count {
                        font-size: 0.85em;
                        color: #777;
                    }
                }
                .listSong:hover {
                    background: #ccc;
                }
                .active {
                    background: rgb(248, 248, 248);
                }
            }
        }
        .clear {
            clear:both;
            height: 100px;
        }
    }
</style>