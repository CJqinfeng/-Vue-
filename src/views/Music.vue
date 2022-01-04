<template>
    <div class="music" ref="songMusic">
        <div class="song">
            <div class="Img">
                <img src="../assets/images/record.png" class="record">
                <img :src="`${al.picUrl}?param=160y160`" class="songImg">
            </div>
            <div class="content">
                <div class="songName">{{song.name}}</div>
                <div class="author">歌手：<router-link :to="`/singermessage?id=${ar.id}`" class="link"><span>{{ar.name}}</span></router-link></div>
                <div class="author">专辑：<router-link :to="`/NewsongMessage?id=${al.id}`" class="link"><span>{{al.name}}</span></router-link></div>
                <div class="collection" v-show="al.name === false">专辑：<span>{{al.name}}</span></div>
                <div class="Play center">
                    <div class="plays" @click="Play">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-kaishi"></use>
                        </svg>
                        <span>播放</span>
                    </div>
                    <div class="playCentent" @click="addSong">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tianjiaqiyedangan"></use>
                        </svg>
                        <span>收藏</span>
                    </div>
                    <div class="playCentent" @click="shar = !shar">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-fenxiang"></use>
                        </svg>
                        <span>分享</span>
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
                        <span>评论{{'('+ sum +')'}}</span>
                    </div>
                    <div class="sharbox center" v-show="shar">
                        <textarea 
                            placeholder="想说点什么？@你想分享的人" 
                            cols="30" 
                            rows="10" class="sharInput"
                            v-model="sharkey"
                            onfocus="if(placeholder=='想说点什么？@你想分享的人')placeholder=''" 
                            onblur="if(!placeholder)placeholder='想说点什么？@你想分享的人'"
                            @keyup.enter="sharcontent">
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="lyric">
            <ul class="content">
                <li class="list center" v-show="!isMore" v-for="(item,index) in lyric" :key="index" v-if="index < 3">{{item}}</li>
            </ul>
            <ul class="content" v-show="isMore">
                <li class="list center" v-for="(item,index) in lyric" :key="index">{{item}}</li>
            </ul>
            <div class="more center" @click="listMore">{{isMore ? '收起' : '查看更多'}}</div>
        </div>
        <comment v-if="flag" :content="content" :off="offset" :number="sum" :id="songid" :ty="0" @refresh="refresh" ></comment>
        <counter v-if="flag" :total="totalPages" :li="limit" :off="offset" @transmit="transmit"></counter>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getSong,getLyric,getMusicComment,getSongTracks} from '../api/index'

import Comment from '@/views/reuse/Comment'
import Counter from '@/views/reuse/Counter'

export default {
    name:"Music",
    components:{
        Comment,
        Counter
    },
    data(){
        return {
            user:[],
            cookie:'',
            song:[],
            songid:this.$route.query.id,
            al:[],
            ar:[],
            lyric:[],
            isMore:false,
            subscribed:false,//是否已收藏
            shar:false,//是否分享
            sharkey:'',//分享内容
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
        Play() {//播放
            this.$store.commit('musicUrl',this.$route.query.id)
        },
        lyricTime(word){//歌词
            this.$store.commit('lyricTime',word)
            this.lyric = this.$store.state.lyricGroup
        },
        listMore() {//返回顶部
            this.$refs.songMusic.scrollIntoView()
            this.isMore = !this.isMore
        },
        commentContent() {//等待获取到完整数据在传递
            this.content = this.comment
            this.flag = true
        },
        async addSong(){//收藏
            let pid = this.$store.state.user.playlist[0].id
            await getSongTracks('add',pid,this.$route.query.id,this.cookie)
            alert("您已将"+this.song.name+"添加到"+this.$store.state.user.playlist[0].name)
        },
        sharcontent(){//分享
            this.$store.dispatch('getShare',{type:'song',id:this.$route.query.id,msg:this.sharkey,cookie:this.cookie})
            this.shar = false
        },
        download(){//下载
            alert("抱歉，该功能未开放！")
        },
        async refresh(){//评论
            let time = new Date().valueOf()
            let commentValue = await getMusicComment(this.$route.query.id,this.offset,this.cookie,time)
            this.$nextTick(function(){
                this.comment = commentValue.data
                this.totalPages = Math.ceil(this.comment.total/20)
                this.sum = this.comment.total
                this.commentContent()
            })
        },
        async transmit(num) {//评论翻页
            this.offset = num
            let time = new Date().valueOf()
            let commentValue = await getMusicComment(this.$route.query.id,num,this.cookie,time)
            this.comment = commentValue.data
            this.commentContent()
        }
    },
    async mounted(){//初始化
        if(localStorage.getItem('feng')){
            this.user = JSON.parse(localStorage.getItem('feng'))
            this.cookie = encodeURIComponent(this.user.cookie)
        }
        let songValue = await getSong(this.$route.query.id)
        console.log(songValue);
        let lyricValue = await getLyric(this.$route.query.id)
        let time = new Date().valueOf()
        let commentValue = await getMusicComment(this.$route.query.id,this.offset,this.cookie,time)
        this.comment = commentValue.data
        this.totalPages = Math.ceil(this.comment.total/20)
        this.sum = this.comment.total
        this.song = songValue.data.songs[0]
        this.al = songValue.data.songs[0].al
        this.ar = songValue.data.songs[0].ar[0]
        this.lyricTime(lyricValue.data.lrc.lyric)
        this.commentContent()
    }
}
</script>

<style lang="less" scoped>
    .music {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .song {
            width: 100%;
            display: flex;
            margin: 5%;
            .Img {
                .record {
                    width: 250px;
                    height: 250px;
                    z-index: 99;
                }
                .songImg {
                    position: absolute;
                    left: 395px;
                    top: 192px;
                    width: 160px;
                    height: 160px;
                    border-radius: 80px;
                }
            }
            .content {
                width: 100%;
                flex: 1;
                padding: 0 20px;
                .songName {
                    font-size: 1.6em;
                    font-weight: 500;
                    padding: 10px 0 20px 0;
                }
                .author {
                    width: 200px;
                    margin: 10px -10px;
                    padding: 5px 10px;
                    font-size: 0.8em;
                    color: #777;
                    .link {
                        text-decoration: none;
                        span {
                            color: rgb(71, 165, 202);
                        }
                    }
                    .link:hover {
                        cursor: pointer;
                        text-decoration: underline;
                        span {
                            color: rgb(14, 166, 226);
                        }
                    }
                }
                .collection {
                    width: 200px;
                    margin: 10px -10px;
                    padding: 5px 10px;
                    font-size: 0.8em;
                    color: #777;
                    span {
                        color: rgb(71, 165, 202);
                    }
                }
                .Play {
                    width: 500px;
                    margin: 50px -15px;
                    .plays {
                        width: 70px;
                        height: 30px;
                        border: 1px solid #fff;
                        display: flex;
                        align-items: center;
                        padding-left: 12px;
                        background: rgb(0, 168, 235);
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
                    .sharbox {
                        width: 320px;
                        height: 120px;
                        position: absolute;
                        left: 700px;
                        top: 300px;
                        border: 1px solid rgb(155, 155, 155);
                        border-radius: 5px;
                        background: #ff4d4d;
                        .sharInput {
                            width: 300px;
                            height: 100px;
                            outline:none;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            background: rgb(248, 248, 248);
                        }
                    }
                }
            }
        }
        .lyric {
            width: 80%;
            margin: 2% 5% 2% 7%;
            overflow: hidden;
            .content {
                list-style: none;
                .list {
                    font-size: 1.2em;
                    color: #333;
                    padding: 5px 0;
                }
            }
            .more {
                width: 200px;
                font-size: 1em;
                color: rgb(67, 149, 226);
                padding: 5px 0;
                border-top: 3px solid #ccc;
                margin-left: 39%;
            }
            .more:hover {
                cursor: pointer;
                color: rgb(0, 183, 255);
            }
        }
        .clear {
            clear:both;
            height: 100px;
        }
    }
</style>