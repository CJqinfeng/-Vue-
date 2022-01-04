<template>
    <div class="singer">
        <div class="navigation">
            <div class="all center">
                <div class="songs center" :class="{'songsActive':title === '全部歌手'}" @click="Allsinger">全部歌手</div>
            </div>
            <div class="classify" v-for="(category,index) in categorys" :key="index">
                <div class="name">{{category.name}}</div>
                <ul class="listUl">
                    <li class="listCenter" 
                        :class="[title=== category.name+item.name ? 'listActive' : 'list']"
                        v-for="(item,index) in list" 
                        :key="index" 
                        @click="getSingerlist(category.name,category.area,item.name,item.type)"
                    >{{category.name+item.name}}</li>
                </ul>
            </div>
        </div>
        <div class="content">
            <div class="title">
                <div class="titleName">{{title}}</div>
            </div>
            <div class="contentList">
                <router-link :to="`/singermessage?id=${item.id}`" class="singerMessage"  v-for="item in songlist" :key="item.id">
                    <img :src="`${item.picUrl}?param=130y120`">
                    <div class="singername center" :title="item.name">{{item.name}}</div>
                </router-link>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getArtistList} from '../api/index'

export default {
    name:"Singer",
    data(){
        return {
            categorys:[
                {name:'华语',area:7},
                {name:'欧美',area:96},
                {name:'日本',area:8},
                {name:'韩国',area:16},
                {name:'其他',area:0}
            ],
            list:[
                {name:'男歌手',type:1},
                {name:'女歌手',type:2},
                {name:'组合/乐队',type:3}
            ],
            songlist:[],//歌手列表
            title:'全部歌手',
        }
    },
    methods:{
        async Allsinger(){
            if(this.title === '全部歌手') return
            let songlistValue = await getArtistList(-1,-1)
            this.songlist = songlistValue.data.artists
            this.title = '全部歌手'
        },
        async getSingerlist(firstName,firstArea,secondName,secondType){
            if(this.title === firstName + secondName) return
            let songlistValue = await getArtistList(firstArea,secondType)
            this.songlist = songlistValue.data.artists
            this.title = firstName + secondName
        }
    },
    async mounted(){
        let songlistValue = await getArtistList(-1,-1)
        this.songlist = songlistValue.data.artists
    }
}
</script>

<style lang="less" scoped>
    .singer {
        width: 60%;
        margin: 2% 20%;
        display: flex;
        background: #fff;
        border: 1px solid #ccc;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .navigation {
            width: 23%;
            border-right: 1px solid #ccc;
            background: rgb(250, 250, 250);
            float: left;
            font-size: 0.85em;
            color: #333;
            .all {
                width: 90%;
                margin: 0 5%;
                padding: 20px 0;
                height: 50px;
                .songs {
                    width: 120px;
                    height: 30px;
                    user-select: none;
                }
                .songsActive {
                    cursor: pointer;
                    color: rgb(211, 19, 19);
                    border: 1px solid #999;
                    border-radius: 5px;
                    background: #fff;
                }
                .songs:hover {
                    cursor: pointer;
                    color: rgb(211, 19, 19);
                    border: 1px solid #999;
                    border-radius: 5px;
                    background: #fff;
                }
            }
            ul,li {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            .classify {
                width: 90%;
                margin: 0 5%;
                padding: 10px 0;
                border-top: 1px solid #aaa;
                .name {
                    font-size: 1.2em;
                    font-weight: 600;
                    color: #444;
                    padding-left: 30px;
                    margin-bottom: 10px;
                }
                .listUl {
                   padding-left: 10px;
                    user-select: none;
                    .listCenter {
                        display: flex;
                        align-items: center;
                        margin: 10px 0;
                        padding: 3px 0px 3px 15px;
                    }
                    .list {
                        width: 85.5%;
                        height: 27px;
                        font-size: 0.6em;
                        margin: 5px 0;
                        color: #444;
                    }
                    .list:hover {
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    .listActive {
                        width: 85%;
                        height: 25px;
                        font-size: 0.6em;
                        border: 1px solid #999;
                        color: rgb(211, 19, 19);
                        background: #fff;
                        border-radius: 5px;
                    }
                    .listActive:hover {
                        cursor: pointer;
                    }
                }
            }
        }
        .content {
            width: 77%;
            padding: 0 2%;
            .title {
                width: 95%;
                margin: 3% 2.5%;
                border-bottom: 3px solid #c20c0c;
                .titleName {
                    font-size: 1.5em;
                    padding: 10px 0 26px 0;
                    color: #333;
                }
            }
            .contentList {
                width: 100%;
                .singerMessage {
                    width: 132px;
                    float: left;
                    text-decoration: none; /* 去除默认的下划线 */
                    outline: none;
                    color: #333;
                    margin: 10px 18px;
                    img {
                        width: 130px;
                        height: 120px;
                        border: 1px solid #777;
                    }
                    .singername {
                        width: 130px;
                        font-size: 0.85em;
                        padding: 5px 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
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