<template>
    <div class="recommend">
        <div class="left">
            <!-- 歌单 -->
            <div class="songlist">
                <div class="songTitle">
                    <div class="songName">推荐歌单</div>
                    <div class="songMore">
                        <router-link to="/songlist" class="linkMore">更多</router-link>
                    </div> 
                </div>
                <div class="songCentent">
                    <router-link class="songs" :to="`/playlist?id=${item.id}&cookie=${cookie}`" v-for="item in list" :key="item.id" >
                        <img class="songsImg" :src="`${item.picUrl}?param=140y140`">
                        <div class="songlistCount">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-headset-full"></use>
                            </svg>
                            <div class="count">{{changeValue(item.playCount)}}</div>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-kaishi"></use>
                            </svg>
                        </div>
                        <span class="songName line-limit-length" :title="item.name">{{item.name}}</span>
                    </router-link>
                </div>
            </div>
            <!-- 新碟上架 -->
            <div class="newlist">
                <div class="newTitle">
                    <div class="newName">新碟上架</div>
                    <div class="newMore">
                        <router-link to="/newsong" class="linkMore">更多</router-link>
                    </div>
                </div>
                <div class="newCentent">
                   <swiper :options="swiperOption" ref="mySwiper" class="news" v-if="newsong.length >= 12">
                        <swiper-slide class="newsongs" v-for="item in newsong" :key="item.id">
                            <router-link :to="`/newsongmessage?id=${item.id}`" class="newsong">
                                <img class="newsImg" :src="`${item.blurPicUrl}?param=120y120`">
                                <span class="newsName line-limit-length">{{item.name}}</span>
                            </router-link>
                        </swiper-slide>
                        <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                    </swiper>
                </div>
            </div>
            <!-- 最新MV -->
            <div class="mv">
                <div class="mvTitle">
                    <div class="mvName">最新MV</div>
                    <div class="mvMore">
                        <router-link to="/mv" class="linkMore">更多</router-link>
                    </div> 
                </div>
                <div class="mvContent">
                    <router-link :to="`/mvmessage?id=${item.id}`" class="mvBox"  v-for="item in MV" :key="item.id" >
                        <img :src="`${item.cover}?param=190y107`" 
                            @mouseover="mvIndex = item.id"
                            @mouseleave="mvIndex = 0" 
                        >
                        <div class="mvCount">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-bofang1"></use>
                            </svg>
                            <div class="count">{{changeValue(item.playCount)}}</div>
                        </div>
                        <svg class="mvIcon" aria-hidden="true" v-show="mvIndex === item.id">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>
                        <div class="mvName">{{item.name}}</div>
                        <router-link :to="`/singermessage?id=${item.artistId}`" class="mvAuthor">{{item.artistName}}</router-link>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="singerlist">
                <div class="singerTitle">
                    <div class="singerName">歌手榜</div>
                    <router-link to="/singer" class="singerMore">查看更多</router-link>
                </div>
                <div class="singers">
                    <router-link :to="`/singermessage?id=${item.id}`" class="singerChunk" v-for="item in singers" :key="item.id">
                        <img :src="`${item.picUrl}?param=40y40`" />
                        <div class="singerMonicker">{{item.name}}</div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getAlbum, getArtist, getMusicList, getMvFirst} from '../api/index'

import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";


export default {
    name:"Recommend",
    components:{
        swiper, 
        swiperSlide,
    },
    data(){
        return {
            list:[],
            newsong:[],
            MV:[],
            mvIndex:0,
            singers:[],
            user:[],
            cookie:"",
            //swiper轮播图
            swiperOption: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                speed:1000,    
                loop:true,
                spaceBetween: 5,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                // 设置点击箭头
                navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
                }
            }
        }
    },
    computed: {
        swiper() {
        return this.$refs.mySwiper.swiper;
        }
    },
    methods:{
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
        }
    },
    async mounted(){
        //歌单
        let listresult = await getMusicList(8)
        this.list = listresult.data.result
        if(localStorage.getItem('feng')){
            this.user = JSON.parse(localStorage.getItem('feng'))
            this.cookie = encodeURIComponent(this.user.cookie)
        }
        //新碟上架
        let newsongresult = await getAlbum()
        this.newsong = newsongresult.data.albums
        //推荐MV
        let mvValue = await getMvFirst()
        this.MV = mvValue.data.data
        //歌手榜
        let singerresult = await getArtist()
        this.singers = singerresult.data.list.artists.slice(0,10)
    },
}
</script>

<style lang="less" scoped>
    .recommend {
        width: 60%;
        margin: 2% 20%;
        display: flex;
        background: #fff;
        border: 1px solid #ccc;
        .line-limit-length {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
        }
        .left {
            width: 70%;
            height: auto;
            padding: 0 2%;
            //歌单
            .songlist {
                width: 100%;
                .songTitle {
                    width: 100%;
                    height: 5%;
                    padding-top: 4%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid red;
                    .songName {
                        width: 100%;
                        height: 100%;
                        font-size: 1.2em;
                    }
                    .songMore {
                        width: 100%;
                        height: 100%;
                        font-size: 0.7em;
                        text-align: right;
                        align-items: center;
                        line-height: 300%;
                        .linkMore {
                            text-decoration: none; /* 去除默认的下划线 */
                            color: #666;
                        }
                    }
                }
                .songCentent {
                    width: 100%;
                    height: 100%;
                    .songs {
                        width: 140px;
                        position: relative;
                        float: left;
                        margin: 2% 1.5% 5% 1.5%;
                        text-decoration: none; /* 去除默认的下划线 */
                        outline: none;
                        color: #333;
                        .songsImg {
                            width: 140px;
                            height: 140px;
                        }
                        .songlistCount {
                            width: 140px;
                            height: 25px;
                            background: #000;
                            opacity: 0.5;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            position: absolute;
                            left: 0;
                            bottom: 20px;
                            z-index: 1;
                            font-size: 0.3em;
                            color: #fff;
                            .icon {
                                width: 16px;
                                height: 16px;
                                fill: #fff;
                                padding: 0 5px;
                            }
                            .count {
                                flex: 1;
                                text-align: left;
                            }
                        }
                        .songName {
                            display: block;
                            font-size: 0.85em;
                            width: 130px;
                            padding: 0 5px;
                        }

                    }
                }
            }
            //新碟上架
            .newlist {
                width: 100%;
                .newTitle {
                    width: 100%;
                    height: 5%;
                    padding-top: 4%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid red;
                    .newName {
                        width: 100%;
                        height: 100%;
                        font-size: 1.2em;
                    }
                    .newMore {
                        width: 100%;
                        height: 100%;
                        font-size: 0.7em;
                        text-align: right;
                        align-items: center;
                        line-height: 300%;
                        .linkMore {
                            text-decoration: none; /* 去除默认的下划线 */
                            color: #666;
                        }
                    }   
                }
                .newCentent {
                    width: 600px;
                    height: 200px;
                    border: 1px solid #ccc;
                    background: #f5f5f5;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    margin: 20px 20px 20px 16px;
                    .news {
                        width: 500px;
                        height: 200px;
                        margin: 5px 0 20px 0;
                        padding: 0 20px;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        .newsongs {
                            width: 480px;
                            padding-top: 30px;
                            height: 170px;
                            .newsong {
                                width: 120px;
                                height: 150px;
                                display: flex;
                                flex-flow: column;
                                font-size: 0.5em;
                                text-decoration: none; /* 去除默认的下划线 */
                                outline: none;
                                color: #333;
                                .newsImg {
                                    width: 120px;
                                    height: 120px;
                                }
                                .newsName {
                                    padding-top: 10px;
                                }
                            }
                        }
                        .swiper-button-prev,
                        .swiper-button-next{
                            width:30px;
                            height: 30px;
                           
                        }
                    }
                }
            }
            //MV
            .mv {
                width: 100%;
                .mvTitle {
                    width: 100%;
                    height: 5%;
                    padding-top: 4%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid red;
                    .mvName {
                        width: 100%;
                        height: 100%;
                        font-size: 1.2em;
                    }
                    .mvMore {
                        width: 100%;
                        height: 100%;
                        font-size: 0.7em;
                        text-align: right;
                        align-items: center;
                        line-height: 300%;
                        .linkMore {
                            text-decoration: none; /* 去除默认的下划线 */
                            color: #666;
                        }
                    }
                }
                .mvContent {
                    width: 100%;
                    .mvBox {
                        width: 190px;
                        float: left;
                        margin: 20px 11px;
                        position: relative;
                        text-decoration: none; /* 去除默认的下划线 */
                        color: #333;
                        img {
                            width: 190px;
                            height: 107px;
                            border-radius: 10px;
                        }
                        .mvCount {
                            display: flex;
                            align-items: center;
                            width: auto;
                            height: 10px;
                            position: absolute;
                            right: 5px;
                            top: 5px;
                            .icon {
                                width: 12px;
                                height: 12px;
                                padding: 2px 2px 0 0;
                                fill: #fff;
                            }
                            .count {
                                width: auto;
                                font-size: 0.7em;   
                                color: #fff;
                            }
                        }
                        .mvIcon {
                            position: absolute;
                            left: 145px;
                            top: 65px;
                            width: 35px;
                            height: 35px;
                            fill: #fff;
                        }
                        .mvName {
                            margin: 5px 0;
                            font-size: 0.9em;
                        }
                        .mvAuthor {
                            font-size: 0.8em;
                            color: #777;
                            text-decoration: none;
                        }
                        .mvAuthor:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
        .right {
            width: 30%;
            border-left: 1px solid #ccc;
            .singerlist {
                width: 80%;
                margin: 15% 10%;
                .singerTitle {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #333;
                    
                    .singerName {
                        font-size: 0.8em;
                        font-weight: 900;
                    }
                    .singerMore {
                        text-decoration: none; /* 去除默认的下划线 */
                        color: #666;
                        font-size: 0.4em;
                    }
                }
                .singers {
                    width: 100%;
                    .singerChunk {
                        width: 100%;
                        margin: 10% 0;
                        display: flex;
                        background: #f5f5f5;
                        border: 1px solid #e9e9e9;
                        text-decoration: none; /* 去除默认的下划线 */
                        color: #333;
                        img {
                            width: 40px;
                            height: 40px;
                            padding: 5px 10px;
                        }
                        .singerMonicker {
                            font-size: 0.7em;
                            font-weight: 700;
                            padding: 5px;
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