<template>
    <div class="singer">
        <div class="message">
            <div class="name">{{detail.name}}</div>
            <div class="Img">
                <img :src="detail.cover">
            </div>
            <div class="detail">
                <div class="title">&nbsp;&nbsp;{{detail.name}}简介</div>
                <div class="titleContent">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{detail.briefDesc}}</div>
            </div>
            <div class="play">
                <div class="playList" @click="Playlist">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bofang"></use>
                    </svg>
                    <span>播放全部</span>
                </div>
                <div class="collection">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-tianjiaqiyedangan"></use>
                    </svg>
                    <span>收藏全部</span>
                </div>
            </div>
            <div class="songlist">
                <div class="song" :class="{'active':(index+1)%2}" v-for="(item,index) in songs" :key="item.id">
                    <div class="songCentent of1">
                        <div class="index">{{index+1}}</div>
                        <div class="play">
                            <svg class="icon" aria-hidden="true" @click="Play(item.id)">
                                <use xlink:href="#icon-bofang"></use>
                            </svg>
                        </div>
                    </div>
                    <router-link :to="`/music?id=${item.id}`" class="songCentent of2 songName"><span>{{item.name}}</span></router-link>
                    <div class="songCentent of3"><span>{{dt[index]}}</span></div>
                    <div class="songCentent of4"><span>{{item.al.name}}</span></div>
                </div>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getArtistSongs,getArtistDetail} from '../api/index'

export default {
    name:"SingerMessage",
    data(){
        return {
            songs:[],//全部歌曲列表
            detail:[],//歌手信息
            dt:[],//歌曲时间
        }
    },
    watch:{
        '$route' (to,from) {
            this.$router.go(0)
        }
    },
    async mounted() {
        let songsValue = await getArtistSongs(this.$route.query.id)
        let detailValue = await getArtistDetail(this.$route.query.id)
        this.songs = songsValue.data.songs
        this.detail = detailValue.data.data.artist
        this.musictime()
    },
    methods:{
        //播放全部音乐列表
        Playlist(){
            this.$store.commit('musicList',this.songs)
        },
        Play(id) {
            this.$store.commit('musicUrl',id)
        },
        musictime() {
            //避免v-for陷入死循环
            for(let i = 0;i < this.songs.length; i++) {
                this.dt[i] = this.songs[i].dt 
                this.$store.commit('calculateMusic',this.dt[i])
                this.dt[i] = this.$store.state.musicTime
            }
        },
    },
}
</script>

<style lang="less" scoped>
    .singer {
        width: 60%;
        margin: 2% 20%;
        display: flex;
        background: #fff;
        border: 1px solid #ccc;
        .of1 {
            width: 70px;
        }
        .of2 {
            flex: 1;
        }
        .of3 {
            width: 150px;
        }
        .of4 {
            width: 200px;
        }
        a {
            text-decoration: none; /* 去除默认的下划线 */
            outline: none;	/* 去除旧版浏览器的点击后的外虚线框 */
        }
        .message {
            width: 80%;
            margin: 2% 10%;
            .name {
                font-size: 1.6em;
            }
            .Img {
                width: 100%;
                height: 350px;
                img {
                    position: absolute;
                    left: 397px;
                    top: 40px;
                    width: 740px;
                    height: 600px;
                    clip: rect(120px,740px,450px,0px);
                }
            }
            .detail {
                width: 100%;
                .title {
                    border-left: 4px solid #c10d0c;
                    font-size: 1.1em;
                }
                .titleContent {
                    float: left;
                    font-size: 0.8em;
                    color: #555;
                    line-height: 25px;
                    padding: 10px;
                }
            }
            .play {
                width: 100%;
                height: 50px;
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .playList {
                    width: 90px;
                    height: 34px;
                    border: 1px solid #ccc;
                    background: rgb(7, 36, 197);
                    padding-left: 13px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                    .icon {
                        width: 20px;
                        height: 20px;
                        fill: #ccc;
                        padding-right: 2px;
                    }
                    span {
                        font-size: 0.85em;
                        color: #ccc;
                    }
                }
                .playList:hover {
                    cursor: pointer;
                    border: 1px solid #eee;
                    background: rgb(6, 40, 230);
                    .icon {
                        width: 20px;
                        height: 20px;
                        fill: #fff;
                        padding-right: 2px;
                    }
                    span {
                        font-size: 0.85em;
                        color: #fff;
                    }
                }
                .collection {
                    width: 90px;
                    height: 34px;
                    border: 1px solid #ccc;
                    background: rgb(240, 240, 240);
                    padding-left: 13px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                    .icon {
                        width: 18px;
                        height: 18px;
                        fill: #333;
                        padding-right: 2px;
                    }
                    span {
                        font-size: 0.85em;
                        color: #333;
                    }
                }
                .collection:hover {
                    cursor: pointer;
                    border: 1px solid #999;
                    background: #fff;
                    .icon {
                        width: 18px;
                        height: 18px;
                        fill: #666;
                        padding-right: 2px;
                    }
                    span {
                        font-size: 0.85em;
                        color: #666;
                    }
                }
            }
            .songlist {
                width: 99.8%;
                .song {
                    width: 100%;
                    display: flex;
                    font-size: 0.6em;
                    color: #777;
                    align-items: center;
                    .icon {
                        width: 20px;
                        height: 20px;
                        fill: #aaa;
                    }
                    .songCentent {
                        height: 30px;
                        display: flex;
                        padding-left: 10px;
                        align-items: center;
                        color: #777;
                        span {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .index {
                            width: 20px;
                            padding: 10px;
                        }
                        .play {
                            width: 20px;
                            padding: 5px 0 0 0;
                            .icon:hover {
                                cursor: pointer;
                                fill: #555;
                                user-select: none;
                            }
                        }
                    }
                    .songName:hover {
                        color: #333;
                        text-decoration: underline;
                    }
                }
                .active {
                    background: #eee;
                }
            }
        }
        .clear {
            clear:both;
            height: 100px;
        }
    }
</style>