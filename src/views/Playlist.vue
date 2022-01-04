<template>
    <div class="playlist">
        <div class="centent" ref="content">
            <div class="title">
                <div class="titleImg center">
                    <img :src="`${headline.coverImgUrl}?param=210y210`" >
                </div>
                <div class="titleCentent">
                    <div class="titleName">{{headline.name}}</div>
                    <div class="titleFramer">
                        <img :src="creator.avatarUrl" >
                        <div class="framerName center">{{creator.nickname}}</div>
                    </div>
                    <div class="titlePlay center" >
                        <div class="plays" @click="Playlist">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-kaishi"></use>
                            </svg>
                            <span>播放</span>
                        </div>
                        <div class="playCentent" @click="subScr">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tianjiaqiyedangan"></use>
                            </svg>
                            <span v-cloak>{{subscribed ? '已收藏' : '收藏'}}{{'('+ dynamic.playCount +')'}}</span>
                        </div>
                        <div class="playCentent" @click="shar = !shar">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-fenxiang"></use>
                            </svg>
                            <span v-cloak>分享{{'('+ dynamic.shareCount +')'}}</span>
                        </div>
                        <div class="playCentent" @click="download">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xiazai"></use>
                            </svg>
                            <span>下载</span>
                        </div>
                        <div class="playCentent" @click="Commentbox">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-pinglun"></use>
                            </svg>
                            <span v-cloak>评论{{'('+ dynamic.commentCount +')'}}</span>
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
                    <div class="titleTabel" v-show="tags.length != 0">
                        <div class="tabelTitle ">标签：</div>
                        <router-link 
                            :to="`/songlist?cat=${item}`" 
                            class="tabelTag center" 
                            v-for="(item,index) in tags" 
                            :key="index"
                        >
                            {{item}}
                        </router-link>
                    </div>
                    <div class="titleIntroduce" v-show="headline.discription">
                        <div class="introduceTitle">介绍：</div>
                        <div class="introduceDescription">{{headline.description}}</div>
                    </div>
                </div>
            </div>
            <div class="songs">
                <div class="songsTitle">
                    <div class="Title">歌曲列表</div>
                    <div class="titleSum">{{headline.trackCount}}首歌</div>
                    <div class="titleTime">播放：<span>{{headline.playCount}}</span> 次</div>
                </div>
                <div class="songsCentent">
                    <div class="listHeader">
                        <div class="header of1"></div>
                        <div class="header of2">歌曲标题</div>
                        <div class="header of3">时长</div>
                        <div class="header of4">歌手</div>
                        <div class="header of5">专辑</div>
                    </div>
                    <div class="songlist">
                        <div class="song" :class="{'active':(index+1)%2}" v-for="(item,index) in songlist" :key="item.id">
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
                            <router-link :to="`/singermessage?id=${item.ar[0].id}`" class="songCentent of4 songName">
                                <span>{{item.ar[0].name}}</span>
                            </router-link>
                            <router-link :to="`/newsongmessage?id=${item.al.id}`" class="songCentent of5 songName"><span>{{item.al.name}}</span></router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <comment v-if="flag" :content="content" :off="offset" :number="sum" :id="listId" :ty="2" @refresh="refresh"></comment>
        <counter v-if="flag" :total="totalPages" :li="limit" :off="offset" @transmit="transmit"></counter>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getComment, getDetail,getDynamic,getPlaylistSubscribe} from '../api/index'
import Comment from '@/views/reuse/Comment'
import Counter from '@/views/reuse/Counter'

export default {
    name:"Playlist",
    components:{
        Comment,
        Counter
    },
    data(){
        return {
            headline:[],//歌单
            listId:this.$route.query.id,//歌单id
            dynamic:{},//动态信息
            subscribed:false,//是否已收藏
            shar:false,//是否分享
            sharkey:'',//分享内容
            songlist:[],//歌曲列表
            creator:[],//创建者信息
            tags:[],//标签
            al:[],//歌曲专辑
            ar:[],//歌手
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
            this.$store.commit('musicList',this.songlist)
        },
        Play(id) {
            this.$store.commit('musicUrl',id)
        },
        //是否收藏
        async subScr(){
            let t = 1
            if(this.subscribed){
                t = 2
                this.subscribed = false
            } else {
                this.subscribed = true
            }
            let time = new Date().valueOf()
            await getPlaylistSubscribe(t,this.$route.query.id,this.$route.query.cookie,time)
        },
        sharcontent(){
            this.$store.dispatch('getShare',{type:'playlist',id:this.$route.query.id,msg:this.sharkey,cookie:this.$route.query.cookie})
            this.shar = false
        },
        download(){
            alert("抱歉，该功能未开放！")
        },
        Commentbox(){
            this.$refs.content.scrollBy()
        },
        musictime() {
            //避免v-for陷入死循环
            for(let i = 0;i < this.songlist.length; i++) {
                this.dt[i] = this.songlist[i].dt 
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
            let commentValue = await getComment(this.$route.query.id,this.offset,this.$route.query.cookie,time)
            let dynamicValue = await getDynamic(this.$route.query.id)
            this.$nextTick(function(){
                this.comment = commentValue.data
                this.sum = dynamicValue.data.commentCount
                this.commentContent()
            })
        },
        async transmit(num) {
            this.offset = num
            let commentValue = await getComment(this.$route.query.id,num,this.$route.query.cookie)
            this.comment = commentValue.data
            this.commentContent()
        }
    },
    async mounted() {
        let listValue = await getDetail(this.$route.query.id,this.$route.query.cookie)
        let time = new Date().valueOf()
        let commentValue = await getComment(this.$route.query.id,this.offset,this.$route.query.cookie,time)
        let dynamicValue = await getDynamic(this.$route.query.id)
        this.totalPages = Math.ceil(dynamicValue.data.commentCount/20)
        this.sum = dynamicValue.data.commentCount
        this.dynamic = dynamicValue.data
        this.headline = listValue.data.playlist
        this.subscribed = this.headline.subscribed
        this.songlist = listValue.data.playlist.tracks
        this.comment = commentValue.data
        this.musictime()
        this.commentContent()
        this.creator = listValue.data.playlist.creator
        this.tags = listValue.data.playlist.tags
    }
}
</script>

<style lang="less" scoped>
    .playlist {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
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
            width: 90px;
        }
        .of5 {
            width: 130px;
        }
        a {
            text-decoration: none; /* 去除默认的下划线 */
            outline: none;	/* 去除旧版浏览器的点击后的外虚线框 */
        }
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .centent {
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
                .titleCentent {
                    width: 100%;
                    flex: 1;
                    padding: 0 20px;
                    float: left;
                    .titleName {
                        font-size: 1.4em;
                        font-weight: 500;
                    }
                    .titleFramer {
                        width: 200px;
                        padding: 20px;
                        display: flex;
                           img {
                               width: 40px;
                               height: 40px;
                           }
                           .framerName {
                               padding: 0 10px;
                               font-size: 0.8em;
                               color: #777;
                           }
                    }
                    .titlePlay {
                        width: 500px;
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
                    .titleTabel {
                        width: 400px;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        .tabelTitle {
                            font-size: 0.85em;
                            color: #333;
                        }
                        .tabelTag {
                            width: 60px;
                            height: 25px;
                            border: 1px solid #ccc;
                            border-radius: 12px;
                            margin: 0 5px;
                            float: left;
                            font-size: 0.7em;
                            color: #777;
                            box-shadow: inset 0px 0px 3px #ccc;
                            user-select: none;
                            white-space:nowrap;/* 不换行 */
                            overflow:hidden;
                            text-overflow:ellipsis;
                        }
                        .tabelTag:hover {
                            cursor: pointer;
                            box-shadow: inset 0px 0px 3px #fff;
                        }
                    }
                    .titleIntroduce {
                        width: 550px;
                        padding: 10px 20px;
                        display: flex;
                        
                        .introduceTitle {
                            width: 50px;
                            font-size: 0.85em;
                            color: #333;
                        }
                        .introduceDescription {
                            width: 420px;
                            font-size: 0.85em;
                            color: #333;
                        }
                    }
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
                        width: 100px;
                        font-size: 1.5em;
                        font-weight: 700;
                    }
                    .titleSum {
                        width: 50px;
                        text-align: right;
                        font-size: 0.8em;
                        color: #333;
                    }
                    .titleTime {
                        flex: 1;
                        text-align: right;
                        font-size: 0.8em;
                        color: #333;
                        span {
                            font-weight: 600;
                            color: #c20c0c;
                        }
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