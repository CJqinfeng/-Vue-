<template>
    <div class="newsong">
        <div class="new">
            <div class="newTitle">
                <div class="title">热门新碟</div>
            </div>
            <div class="newContent">
                <router-link :to="`/newsongmessage?id=${item.id}`" class="hotsong" v-for="item in hot.slice(0,10)" :key="item.id">
                    <img :src="`${item.picUrl}?param=130y130`">
                    <div class="songname line-limit-length">{{item.name}}</div>
                    <div class="acthor line-limit-length">{{item.artists[0].name}}</div>
                </router-link>
            </div>
        </div>
        <div class="songs" ref="songs">
            <div class="songTitle">
                <div class="title">全部新碟</div>
                <div class="category">
                    <div class="sort" v-for="(item,index) in category" :key="index" @click="Area(item.area)" >
                        {{item.name}}<span v-show="index != category.length-1">|</span>
                    </div>
                </div>
            </div>
            <div class="songContent" v-cloak>
                <router-link :to="`/newsongmessage?id=${item.id}`" class="song" v-for="item in newsongs" :key="item.id">
                    <img :src="`${item.picUrl}?param=130y130`">
                    <div class="songname line-limit-length">{{item.name}}</div>
                    <div class="acthor line-limit-length">{{item.artists[0].name}}</div>
                </router-link>
            </div>
            <counter :total="totalPages" :li="limit" :off="offset" @transmit="transmit" ></counter>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getAlbum,getNewAlbum} from '../api/index'
import Counter from '@/views/reuse/Counter'

export default {
    name:"NewSong",
    components:{
        Counter
    },
    data(){
        return {
            hot:[],//热门新碟
            newsongs:[],//全部新碟
            category:[
                {name:'全部',area:'ALL'},
                {name:'华语',area:'ZH'},
                {name:'欧美',area:'EA'},
                {name:'韩国',area:'KR'},
                {name:'日本',area:'JP'}
            ],
            cat:'ALL',//类别
            offset:0,//页数
            totalPages:15,
            limit:35,
        }
    },
    methods:{
        async transmit(num) {//分页器
            let newAlbumValue = await getNewAlbum(this.cat,num)
            this.newsongs = newAlbumValue.data.albums
            this.$refs.songs.scrollIntoView()
        },
        async Area(area) {
            let newAlbumValue = await getNewAlbum(area,0)
            this.newsongs = newAlbumValue.data.albums
        }
    },
    async mounted() {
        let albumValue = await getAlbum()
        let newAlbumValue = await getNewAlbum(this.cat,this.offset)
        this.hot = albumValue.data.albums
        this.newsongs = newAlbumValue.data.albums
    },
}
</script>

<style lang="less" scoped>
    .newsong {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .line-limit-length {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
        }
        a {
            text-decoration: none; /* 去除默认的下划线 */
            color: #333;
        }
        .new {
            width: 90%;
            margin: 3% 5%;
            .newTitle {
                width: 100%;
                height: 40px;
                border-bottom: 3px solid #c20c0c;
                .title {
                    font-size: 1.5em;
                }
            }
            .newContent {
                width: 100%;
                height: 400px;
                margin: 10px 0;
                padding-left: 5px;
                .hotsong {
                    width: 130px;
                    margin: 15px;
                    float: left;
                    img {
                        width: 130px;
                        height: 130px;
                        border: 1px solid #ccc;
                    }
                    .songname {
                        width: 130px;
                        padding: 1px 3px;
                        font-size: 0.9em;
                        
                    }
                    .songname:hover {
                        text-decoration: underline;
                    }
                    .acthor {
                        width: 130px;
                        padding: 3px;
                        font-size: 0.7em;
                        color: #777;
                    }
                    .acthor:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
        .songs {
            width: 90%;
            margin: 3% 5%;
            .songTitle {
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                border-bottom: 3px solid #c20c0c;
                .title {
                    font-size: 1.5em;
                }
                .category {
                    display: flex;
                    justify-content: space-around;
                    font-size: 0.85em;
                    margin: 0 20px;
                    color: #999;
                    .sort {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        padding: 0 10px 0 0;
                    }
                    span {
                            padding-left:10px;
                            font-size: 1em;
                        }
                    .sort:hover {
                        cursor: pointer;
                        color: #333;
                        span {
                            cursor: none;
                            color: #999;
                        }
                    }
                }
            }
            .songContent {
                width: 100%;
                margin: 10px 0;
                padding-left: 5px;
                .song {
                    width: 130px;
                    padding: 15px;
                    display: inline-block;
                    img {
                        width: 130px;
                        height: 130px;
                        border: 1px solid #ccc;
                    }
                    .songname {
                        padding: 1px 3px;
                        font-size: 0.9em;
                        
                    }
                    .songname:hover {
                        text-decoration: underline;
                    }
                    .acthor {
                        padding: 3px;
                        font-size: 0.7em;
                        color: #777;
                    }
                    .acthor:hover {
                        text-decoration: underline;
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