<template>
    <div class="musicConsole" >
        <div class="Content" @mouseover="over" @mouseleave="leave">
            <div class="header" >
                <audio 
                    :src="musicUrl" 
                    autoplay ref="audio"
                    @timeupdate="getCurr"
                    @canplay="getPresent"
                    @ended="overAudio"
                >
                </audio>
                <div class="lock all">
                    <svg class="icon" aria-hidden="true" v-show="!isLock" @click="lockFuc">
                        <use xlink:href="#icon-jiesuo"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-show="isLock" @click="lockFuc">
                        <use xlink:href="#icon-suoding"></use>
                    </svg>
                </div>
            </div>
            <transition name="content">
                <div class="content" v-show="isAppear">
                    <div class="console">
                        <div class="play all">
                            <svg class="icon" aria-hidden="true" @click="PlayUp">
                                <use xlink:href="#icon-shangyishou1"></use>
                            </svg>
                            <svg class="playIcon" aria-hidden="true" v-show="isPlay" @click="Play">
                                <use xlink:href="#icon-kaishi"></use>
                            </svg>
                            <svg class="playIcon" aria-hidden="true" v-show="!isPlay" @click="Play">
                                <use xlink:href="#icon-zanting"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" @click="PlayDown">
                                <use xlink:href="#icon-xiayishou1"></use>
                            </svg>
                        </div>
                        <div class="song all">
                            <img :src="`${songImg}?param=35y35`" :onerror="Img" >
                            <div class="message">
                                <div class="songName all">
                                    <router-link :to="`/music?id=${id}`" class="name">{{songName}}</router-link>
                                    <router-link :to="`/singermessage?id=${authorId}`" class="author">{{songAuthor}}</router-link>
                                </div>
                                <div class="schedule all">
                                    <div 
                                        class="length" ref="length" 
                                        @mousedown="getDown" @mousemove="getChange($event)" 
                                        @mouseup="getUp($event)"
                                    >
                                        <div class="advance" :style="getWidth" ref="advance" >
                                            <span class="dot"></span>
                                        </div>
                                    </div>
                                    <div class="time">{{curr === duration ? '00:00' : getTime(curr)}}/{{getTime(duration)}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="module all">
                            <svg class="icon" aria-hidden="true" @click="isLyric = !isLyric">
                                <use xlink:href="#icon-danchuang_quanpinggeci_sousuogeci_"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-show="pattern === 1" @click="playPattern">
                                <use xlink:href="#icon-xunhuanbofang"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-show="pattern === 2" @click="playPattern">
                                <use xlink:href="#icon-suijibofang"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-show="pattern === 3" @click="playPattern">
                                <use xlink:href="#icon-danqubofang"></use>
                            </svg>
                            <div class="list all">
                                <svg class="icon bflb" aria-hidden="true" @click="musicList">
                                    <use xlink:href="#icon-wj-bflb"></use>
                                </svg>
                                <div class="num">{{list.length}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <div class="lyric" v-show="isLyric">
            <div class="name all">{{songName}}</div>
            <div class="lyricContent">
                <ul class="content" ref="lyric">
                    <li 
                        :class="[index===lyricIndex ? 'active' : 'list']" 
                        v-for="(item,key,index) in lyric" 
                        :key="key"
                    >{{item}}</li>
                </ul>
            </div>
        </div>
        <div class="musicList" v-show="isList">
            <div class="name">
                <div class="title all">播放列表({{list.length}})</div>
                <div class="select all" @click="list = []">删除全部</div>
            </div>
            <div class="list">
                <ul class="listUl" ref="musiclistUl">
                    <li :class="[item.id===id?'active':'listLi']" v-for="item in list" :key="item.id" @click="getListUrl(item.id)" >
                        <div class="listName">{{item.name}}</div>
                        <div class="ArName">{{item.ar[0].name}}</div>
                        <div class="listTime">{{getTime(parseInt(item.dt/1000))}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getMusicUrl,getSong,getLyric} from '../api/index'

export default {
    name:"MusicConsole",
    data(){
        return {
            list:[],//音乐列表
            isLock:false,//锁定音乐栏
            isAppear:false,//音乐栏显示与隐藏
            isPlay:true,//播放与暂停
            pattern:1,//播放模式
            id:0,//歌曲id
            musicUrl:'',//歌曲地址
            songImg:'',//歌图
            songName:'',//歌名
            songAuthor:'',//作者
            authorId:'',//作者id
            progress:0,//歌曲进度百分比
            duration:0,//歌曲总长
            curr:0,//歌曲进度，秒
            isMouse:false,//是否按下拖动
            extent:0,//当前拖动的位置
            lyric:[],//歌词
            lyricIndex:0,//歌词当前位置
            isLyric:false,//歌词是否显示
            isList:false,//歌曲列表是否显示
            isListlock:false,//防止列表与锁定冲突

        }
    },
    computed:{
        ...mapGetters(['getMusicUrl','getList']),
        Img(){
            return 'this.src="'+ require('../assets/images/kabi.jpg') + '"'
        },
        getWidth(){
            return 'width:'+ this.progress + '%'
        }
    },
    methods:{
        async getUrl(id){//获取歌曲所需的各种资源
            let UrlValue = await getMusicUrl(id)
            let songValue = await getSong(id)
            let lyricValue = await getLyric(id)
            this.list.forEach((item,index) => {
                if(id === item.id){
                    this.list.splice(index,1)
                } 
            });
            this.id = id
            this.list.unshift(songValue.data.songs[0])
            this.musicUrl = UrlValue.data.data[0].url
            this.songImg = songValue.data.songs[0].al.picUrl
            this.songName = songValue.data.songs[0].name
            this.songAuthor = songValue.data.songs[0].ar[0].name
            this.authorId = songValue.data.songs[0].ar[0].id
            this.isPlay = false
            this.lyricTime(lyricValue.data.lrc.lyric)
        },
        async getListUrl(id){
            let UrlValue = await getMusicUrl(id)
            let songValue = await getSong(id)
            let lyricValue = await getLyric(id)
            this.id = id
            this.musicUrl = UrlValue.data.data[0].url
            this.songImg = songValue.data.songs[0].al.picUrl
            this.songName = songValue.data.songs[0].name
            this.songAuthor = songValue.data.songs[0].ar[0].name
            this.authorId = songValue.data.songs[0].ar.id
            this.isPlay = false
            this.lyricTime(lyricValue.data.lrc.lyric)
            this.list.forEach((item,index) => {
                if(id === item.id){
                    if(index > 4){
                        this.$refs.musiclistUl.scrollTop = 30 * (index - 4)
                    } 
                } 
            });
            
        },
        //歌词
        lyricTime(word){
            this.$store.commit('lyricTime',word)
            this.lyric = this.$store.state.lyricGroup
        },
        //列表
        musicList(){
            if(!this.isListlock){
                this.isLock = !this.isLock
            }
            this.isAppear = true
            this.isList = !this.isList
        },
        //音频是否播放完毕
        overAudio(){
            if(this.pattern === 1){
                if(this.list.length > 1){
                    this.list.forEach((item,index,arr) => {
                        if(this.id === item.id){
                            if(index != arr.length-1){
                                this.getListUrl(arr[index+1].id)
                            } else {
                                this.getListUrl(arr[index].id)
                            }
                        }
                    })
                }
            } else if(this.pattern === 2){
                this.getListUrl(this.list[parseInt(Math.random()*this.list.length)].id)
            } else if(this.pattern === 3){
                this.isPlay = false
                this.$refs.audio.play()
            }
        },
        //播放上一首
        PlayUp(){
            if(this.list.length > 1){
                this.list.forEach((item,index,arr) => {
                    if(this.id === item.id){
                        if(index != 0){
                            this.getListUrl(arr[index-1].id)
                        } else {
                            this.getListUrl(arr[arr.length-1].id)
                        }
                    }
                })
            }
        },
        //播放下一首
        PlayDown(){
            if(this.list.length > 1){
                this.list.forEach((item,index,arr) => {
                    if(this.id === item.id){
                        if(index != arr.length-1){
                            this.getListUrl(arr[index+1].id)
                        } else {
                            this.getListUrl(arr[0].id)
                        }
                    }
                })
            }
        },
        //播放与暂停
        Play(){
            if(this.musicUrl === '') return 
            if(this.isPlay === true){
                this.isPlay = false
                this.$refs.audio.play()
            } else {
                this.isPlay = true
                this.$refs.audio.pause()
            }
        },
        //进度条
        getTime(sec){//换算时间
            let s = sec % 60 < 10 ? ('0' + sec % 60) : sec % 60
            let min = Math.floor(sec / 60) < 10 ? ('0' + Math.floor(sec / 60)) : Math.floor(sec / 60)
            return min + ':' + s
        },
        getCurr(){//音频进度改变触发此事件
            this.curr = parseInt(this.$refs.audio.currentTime)
            this.progress = this.curr/this.duration * 100
            if(this.progress === 100){
                this.isPlay = true
            }
        },
        getPresent(){//音频加载成功后获取时长
            this.duration = parseInt(this.$refs.audio.duration)
        },
        //点击进度条改变音乐当前播放时间
        getDown(){//按下
            if(this.musicUrl === '') return
            this.isMouse = true
            this.$refs.audio.pause()
        },
        getChange(e){//移动
            if(this.isMouse === false) return 
            if(e.x >= 500){
                let across = e.x - 500 
                this.extent = across / 460 * 100 
                this.progress = this.extent
            }
        },
        getUp(e){//放开
            if(this.extent != (e.x -500) / 460 * 100) this.extent = (e.x -500) / 460 * 100//检测移动的位置是否与鼠标位置相同
            let cq = this.extent * this.duration / 100
            if(!isNaN(cq)){
                this.$refs.audio.currentTime = cq
                this.progress = cq / this.duration * 100
                this.isMouse = false
            }
            if(this.isPlay === true) this.isPlay = false
            this.$refs.audio.play()
        },
        lockFuc(){
            this.isLock = !this.isLock
            this.isAppear = true
            this.isList = false
            this.isListlock = !this.isListlock
        },
        over(){
            if(this.isLock) return
            this.isAppear = true
        },
        leave(){
            if(this.isLock) return
            setTimeout(() => {
                this.isAppear = false
            },1000)
        },
        playPattern(){
            if(this.pattern === 3) {
                this.pattern = 1
            } else {
                this.pattern++
            }
        }
    },
    watch:{
        getMusicUrl(newValue){
            if(!this.isLock){
                this.isAppear = true
                setTimeout(() =>{
                    this.isAppear = false
                },3000)
            }
            this.getUrl(newValue)
            
        },
        getList(newValue){
            if(!this.isLock){
                this.isAppear = true
                setTimeout(() =>{
                    this.isAppear = false
                },3000)
            }
            this.id = newValue[0].id
            this.getUrl(newValue[0].id)
            if(this.list.length < 1){
                this.list.unshift(...newValue)
            } else {
                for(let i=0;i<newValue.length;i++){
                    for(let n=0;n<this.list.length;n++){
                        if(this.list[n].id === newValue[i].id){
                            this.list.splice(n,1)
                        }
                    }
                }
                this.list.unshift(...newValue)
            }
        },
        curr() {//使用watch监听歌曲变化以此来改变歌词
            let i = 0
            //循环歌词数组
            for(let key in this.lyric) {
                //key 表示的是歌词的时间（数组的序号），所以key值等于curr时，改变当前歌词的进度
                if(+key === this.curr) {
                    this.lyricIndex = i
                    //歌词进行到第五句开始滚动
                    if(i > 4) {
                        this.$refs.lyric.scrollTop = 36 * (i - 4)
                    }
                }
                i++
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .musicConsole {
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 999;
        background: #333;
        opacity: 0.95;
        .all {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .Content {
            z-index: 99;
            .header {
                width: 100%;
                height: 5px;
                box-shadow: 0px -1px 2px 1px #999;
                .lock {
                    position: relative;
                    left: 1430px;
                    bottom: 20px;
                    width: 30px;
                    height: 20px;
                    background: #333;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    box-shadow: 0px -2px 2px #999;
                    .icon {
                        width: 12px;
                        height: 12px;
                        fill: #ccc;
                    }
                    .icon:hover {
                        cursor: pointer;
                        fill: #fff;
                    }
                }
            }
            .content-enter-active {
                animation: fire 0.3s linear;
            }
            .content-leave-active {
                animation: fire 0.5s linear reverse;
            }
            @keyframes fire {
                from {
                    height: 0;
                }
                to {
                    height: 40px;
                }
            }
            .content {
                width: 100%;
                height: 40px;
                background: #333;
                padding-bottom: 5px;
                .console {
                    width: 60%;
                    margin: 0 20%;
                    display: flex;
                    .play {
                        width: 120px;
                        padding-right: 20px;
                        user-select: none;
                        .icon {
                            width: 28px;
                            height: 28px;
                            fill: #777;
                        }
                        .icon:hover {
                            cursor: pointer;
                            fill: #eee;
                        }
                        .playIcon {
                            width: 35px;
                            height: 35px;
                            fill: #ccc;
                        }
                        .playIcon:hover {
                            cursor: pointer;
                            fill: #fff;
                        }
                    }
                    .song {
                        img {
                            width: 35px;
                            height: 35px;
                            border-radius: 5px;
                            box-shadow: 0px 0px 2px 2px #444;
                        }
                        .message {
                            .songName {
                                height: 18px;
                                padding: 0 0 1px 0;
                                font-size: 9px;
                                .name {
                                    padding: 0 20px;
                                    color: #eee;
                                    text-decoration: none;
                                }
                                .name:hover {
                                    cursor: pointer;
                                    color: #fff;
                                    text-decoration: underline;
                                }
                                .author {
                                    flex: 1;
                                    color: #ccc;
                                    text-decoration: none;
                                }
                                .author:hover {
                                    cursor: pointer;
                                    color: #eee;
                                    text-decoration: underline;
                                }
                            }
                            .schedule {
                                width: 600px;
                                height: 22px;
                                .length {
                                    height: 3px;
                                    width: 460px;
                                    margin: 0 20px;
                                    background: #222;
                                    border-radius: 1px;
                                    .advance {
                                        height: 100%;
                                        width: 0%;
                                        background: rgb(201, 13, 13);
                                        border-radius: 5px;
                                        .dot {
                                            position: relative;
                                            left: 6px;
                                            bottom: 5px;
                                            float: right;
                                            width: 12px;
                                            height: 12px;
                                            border-radius: 100%;
                                            background: #fff;
                                        }
                                    }
                                }
                                .time {
                                    width: 100px;
                                    font-size: 9px;
                                    color: #eee;
                                    padding-top: -8px;
                                }
                            }
                            .schedule:hover {
                                .length{
                                    height: 8px;
                                    border-radius: 5px;
                                    .advance {
                                        height: 100%;
                                        width: 0%;
                                        background: rgb(214, 49, 49);
                                        border-radius: 5px;
                                        .dot {
                                            cursor: pointer;
                                            position: relative;
                                            left: 8px;
                                            bottom: 4px;
                                            float: right;
                                            width: 16px;
                                            height: 16px;
                                            border-radius: 100%;
                                            background: #fff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .module {
                        flex: 1;
                        user-select: none;
                        .icon {
                            width: 20px;
                            height: 20px;
                            fill: #999;
                        }
                        .icon:hover {
                            cursor: pointer;
                            fill: #fff;
                        }
                        .list {
                            display: flex;
                            padding-left: 3px;
                            .bflb {
                                position: absolute;
                                left: 1160px;
                            }
                            .num {
                                width: 40px;
                                height: 17px;
                                background: #222;
                                border-radius: 10px;
                                color: #777;
                                font-size: 13px;
                                text-align: center;
                                user-select: none;
                            }
                        }
                    }
                }
            }
        }
        .lyric{
            position: absolute;
            left: 20px;
            bottom: 100px;
            width: 250px;
            height: 500px;
            background: #eee;
            opacity: 0.9;
            .name {
                width: 100%;
                height: 30px;
                background: #eee;
                font-size: 0.8em;
                font-weight: 700;
                color: #333;   
            }
            .lyricContent {
                width: 100%;
                padding-top: 20px;
                ul,li {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .content {
                    width: 250px;
                    height: calc(420px);
                    overflow-y: scroll;
                    list-style-type: none;
                    .list {
                        font-size: 0.6em;
                        color: #777;
                        padding: 10px 5px;
                        text-align: center;
                    }
                    .active {
                        font-size: 1em;
                        font-weight: 700;
                        color: #444;
                        padding: 12px 5px;
                        text-align: center;
                    }
                }
                ::-webkit-scrollbar {
                    width: 0 !important;
                }
            }
            
        }
        .musicList {
            position: absolute;
            left: 800px;
            bottom: 50px;
            width: 550px;
            height: 250px;
            .name {
                width: 100%;
                height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgb(15, 15, 15);
                color: #eee;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                .title {
                    width: 120px;
                    font-weight: 600;
                }
                .select {
                    cursor: pointer;
                    user-select: none;
                    width: 60px;
                    font-size: 0.3em;
                    margin: 5px 15px 0px 15px;
                    padding: 2px 0;
                    border: 1px solid #ccc;
                    background: #333;
                    border-radius: 7px;
                    box-shadow: inset 0px 0px 5px #444;
                }
                .select:hover {
                    background: rgb(216, 24, 24);
                    color: #fff;
                    box-shadow: inset 0px 0px 5px #777;
                }
            }
            .list {
                width: 540px;
                height: 210px;
                background: #333;
                border: 5px solid #111;
                ul,li {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .listUl {
                    width: 100%;
                    height: calc(210px);
                    overflow-y: scroll;
                    list-style-type: none;
                    .listLi {
                        font-size: 0.8em;
                        color: #ccc;
                        display: flex;
                        align-items: center;
                        padding: 7px;
                        .listName {
                            width: 60%;
                        }
                        .ArName {
                            width: 30%;
                            color: #999;
                        }
                        .listTime {
                            width: 10%;
                            text-align: right;
                            color: #777;
                        }
                    }
                    .active {
                        background: rgb(12, 12, 12);
                        font-size: 0.8em;
                        display: flex;
                        align-items: center;
                        padding: 7px;
                        .listName {
                            width: 60%;
                            color: #fff;
                        }
                        .ArName {
                            width: 30%;
                            color: #fff;
                        }
                        .listTime {
                            width: 10%;
                            text-align: right;
                            color: #fff;
                        }
                    }
                    .listLi:hover {
                        cursor: pointer;
                        background: rgb(12, 12, 12);
                        .listName {
                            width: 60%;
                            color: #fff;
                        }
                        .ArName {
                            width: 30%;
                            color: #fff;
                        }
                        .listTime {
                            width: 10%;
                            text-align: right;
                            color: #fff;
                        }
                        
                    }
                }
                ::-webkit-scrollbar {
                    width: 0 !important;
                }
            }
        }
    }
</style>