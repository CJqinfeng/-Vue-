<template>
    <div class="message">
        <div class="content">
            <div class="title">
                <div class="titleImg center">
                    <img :src="`${message.blurPicUrl}?param=210y210`" >
                </div>
                <div class="titleContent">
                    <div class="name">{{message.name}}</div>
                    <div class="alias">{{alias}}</div>
                    <div class="singer">
                        歌手：
                        <router-link :to="`/singermessage?id=${artists.id}`" class="artists">
                            {{artists.name}}
                        </router-link>
                    </div>
                    <div class="company">发行公司：{{message.company}}</div>
                    <div class="titlePlay center">
                        <div class="plays" @click="Playlist" >
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-kaishi"></use>
                            </svg>
                            <span>播放</span>
                        </div>
                        <div class="playCentent" @click="subScr">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tianjiaqiyedangan"></use>
                            </svg>
                            <span>{{isSub ? '已收藏' : '收藏'}}</span>
                        </div>
                        <div class="playCentent" @click="download">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xiazai"></use>
                            </svg>
                            <span>下载</span>
                        </div>
                        <div class="playCentent">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-pinglun"></use>
                            </svg>
                            <span>评论</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="description">
                <div class="title">专辑介绍</div>
                <div class="content">{{message.description}}</div>
            </div>
            <div class="songs">
                <div class="songsTitle">
                    <div class="Title">包含歌曲列表</div>
                    <div class="titleSum">{{songs.length}}首歌</div>
                </div>
                <div class="songsCentent">
                    <div class="listHeader">
                        <div class="header of1"></div>
                        <div class="header of2">歌曲标题</div>
                        <div class="header of3">时长</div>
                        <div class="header of4">歌手</div>
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
                            <div class="songCentent of4">
                                <span>{{item.ar[0].name}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <comment v-if="flag" :content="content" :off="offset" :number="sum" :id="messageid" :ty="3" @refresh="refresh" ></comment>
        <counter v-if="flag" :total="totalPages" :li="limit" :off="offset" @transmit="transmit"></counter>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getAlbumContent,getAlbumDynamic,getAlbumComment,getAlbumSub} from '../api/index'

import Comment from '@/views/reuse/Comment'
import Counter from '@/views/reuse/Counter'


export default {
    name: "NewsongMessage",
    components:{
        Comment,
        Counter
    },
    data(){
        return {
            user:[],
            cookie:'',
            message:[],//专辑内容
            messageid:this.$route.query.id,//专辑id
            isSub:false,//是否已收藏
            songs:[],//歌曲列表
            artists:[],//歌手
            alias:'',//副标题
            dt:[],//歌曲时长
            content:[],//传递评论
            comment:[],//评论
            flag:false,
            sum:0,
            //分页器
            totalPages:0,
            offset:0,
            limit:20,
        }
    },
    watch:{
        '$route' (to,from) {
            this.$router.go(0)
        }
    },
    methods:{
        //播放全部音乐列表
        Playlist(){
            this.$store.commit('musicList',this.songs)
        },
        Play(id) {
            this.$store.commit('musicUrl',id)
        },
        //是否收藏
        async subScr(){
            let t = 1
            if(this.isSub){
                t = 2
                this.isSub = false
            } else {
                this.isSub = true
            }
            await getAlbumSub(t,this.$route.query.id,this.cookie)
        },
        download(){
            alert("抱歉，该功能未开放！")
        },
        musictime() {
            //避免v-for陷入死循环
            for(let i = 0;i < this.songs.length; i++) {
                this.dt[i] = this.songs[i].dt 
                this.$store.commit('calculateMusic',this.dt[i])
                this.dt[i] = this.$store.state.musicTime
            }
        },
        commentContent() {//等待获取到完整数据在传递
            this.content = this.comment
            this.flag = true
        },
        async refresh(){
            let time = new Date().valueOf()
            let commentValue = await getAlbumComment(this.$route.query.id,this.offset,this.cookie,time)
            let dynamicValue = await getAlbumDynamic(this.$route.query.id)
            this.$nextTick(function(){
                this.comment = commentValue.data
                this.totalPages = Math.ceil(dynamicValue.data.commentCount/20)
                this.sum = dynamicValue.data.commentCount
                this.commentContent()
            })
        },
        async transmit(num) {
            this.offset = num
            let time = new Date().valueOf()
            let commentValue = await getAlbumComment(this.$route.query.id,num,this.cookie,time)
            this.comment = commentValue.data
            this.commentContent()
        }
    },
    async mounted() {
        if(localStorage.getItem('feng')){
            this.user = JSON.parse(localStorage.getItem('feng'))
            this.cookie = encodeURIComponent(this.user.cookie)
        }
        let messageValue = await getAlbumContent(this.$route.query.id)
        let dynamicValue = await getAlbumDynamic(this.$route.query.id)
        let commentValue = await getAlbumComment(this.$route.query.id,this.offset) 
        this.message = messageValue.data.album
        this.artists = messageValue.data.album.artists[0]
        this.alias = messageValue.data.album.alias[0]
        this.songs = messageValue.data.songs
        this.isSub = dynamicValue.data.isSub
        this.totalPages = Math.ceil(dynamicValue.data.commentCount/20)
        this.sum = dynamicValue.data.commentCount
        this.comment = commentValue.data
        this.musictime()
        this.commentContent()
    },
}
</script>

<style lang="less" scoped>
    .message {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        a {
            text-decoration: none;
            color: #333;
        }
        .of1 {
            width: 70px;
        }
        .of2 {
            flex: 1;
        }
        .of3 {
            width: 110px;
        }
        .of4 {
            width: 170px;
        }
        .content {
            width: 100%;    
            padding-left: 35px;
            .title {
                width: 100%;
                display: flex;
                padding: 50px 0 0 50px ;
                .titleImg {
                    width: 210px;
                    height: 210px;
                    margin: 0 5px;
                    border: 1px solid #ccc;
                    img {
                        width: 200px;
                        height: 200px;
                    }
                }
                .titleContent {
                    width: 100%;
                    flex: 1;
                    padding: 0 20px;
                    float: left;
                    .name {
                        font-size: 1.4em;
                        font-weight: 500;
                    }
                    .alias {
                        padding: 5px 0 5px 15px;
                        font-size: 0.9em;
                        color: #aaa;
                    }
                    .singer {
                        margin: 20px 0 0 0;
                        font-size: 0.85em;
                        .artists {
                            color: #333;
                        }
                        .artists:hover {
                            text-decoration: underline;
                            color: #777;
                        }
                    }
                    .company {
                        margin: 8px 0;
                        font-size: 0.85em;
                    }
                    .titlePlay {
                        width: 500px;
                        margin: 50px 0 0 -20px;
                        .plays {
                            width: 70px;
                            height: 30px;
                            border: 1px solid #fff;
                            display: flex;
                            align-items: center;
                            padding-left: 12px;
                            background: skyblue;
                            border-radius: 5px;
                            box-shadow: 0px 1px 4px #777;
                            user-select: none;
                            .icon {
                                width: 20px;
                                height: 20px;
                                fill: #fff;
                            }
                            span {
                                padding: 0 2px;
                                font-size: 0.9em;
                                color: #fff;
                                font-weight: 500;
                            }
                        }
                        .plays:hover {
                            cursor: pointer;
                            box-shadow: inset 0px 0px 4px #777;
                        }
                        .playCentent {
                            width: auto;
                            height: 25px;
                            border: 1px solid #333;
                            display: flex;
                            align-items: center;
                            padding: 0 5px;
                            border-radius: 5px;
                            box-shadow: 0px 1px 2px #000;
                            user-select: none;
                            .icon {
                                width: 15px;
                                height: 15px;
                                fill: #777;
                            }
                            span {
                                padding: 0 2px;
                                font-size: 0.6em;
                                color: #333;
                            }
                        }
                        .playCentent:hover {
                            cursor: pointer;
                            box-shadow: inset 0px 0px 2px #777;
                        }
                    }
                }
            }
            .description {
                padding: 5px;
                .title {
                    font-size: 0.9em;
                    font-weight: 700;
                }
                .content {
                    width: 650px;
                    margin: 5px 45px;
                    font-size: 0.8em;
                    line-height: 20px;
                    white-space: pre-wrap;
                }
            }
            .songs {
                width: 100%;
                padding: 50px 0 0 50px ;
                .songsTitle {
                    width: 80%;
                    padding-bottom: 10px;
                    border-bottom: 3px solid #c20c0c;
                    display: flex;
                    align-items: center;
                    .Title {
                        width: 150px;
                        font-size: 1.4em;
                        font-weight: 500;
                    }
                    .titleSum {
                        width: 50px;
                        text-align: right;
                        margin-bottom: -10px;
                        font-size: 0.8em;
                        color: #333;
                    }
                }
                .songsCentent {
                    width: 80%;
                    .listHeader {
                        width: 99.8%;
                        display: flex;
                        border: 1px solid #ccc;
                        font-size: 0.85em;
                        color: #999;
                        align-items: center;
                        box-shadow: inset 0px 0px 10px #eee;
                        .header {
                            height: 36px;
                            border-left: 1px solid #ccc;
                            border-right: 2px solid #fff;
                            display: flex;
                            padding-left: 5px;
                            align-items: center;
                            user-select: none;
                        }
                    }
                    .songlist {
                        width: 99.8%;
                        border: 1px solid #ccc;
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
            }
        }
        .clear {
            clear:both;
            height: 100px;
        }   
    }
</style>