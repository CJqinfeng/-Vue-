<template>
    <div class="songlist" @click="isSelect = false" ref="songlist">
        <div class="songlistTitle">
            <div class="songTitle">{{cat}}歌单</div>
            <div class="songSelect selet" @click.stop="isSelect = !isSelect">
                选择分类
            </div>
            <div class="selectlist" v-show="isSelect">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiangshang"></use>
                </svg>
                <div class="list">
                    <div class="listall">
                        <div class="songSelect selet" @click="catlistName('全部')">
                            选择全部
                        </div>
                    </div>
                    <div class="listclassify">
                        <span>分类选项</span>
                        <div class="listCentent">
                            <div class="centent" v-for="(item,index) in catlist" :key="index" @click="catlistName(item.name)">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="songlistCentent">
            <router-link :to="`/playlist?id=${item.id}&cookie=${cookie}`" class="songlistOnly" v-for="item in list" :key="item.id">
                <img :src="`${item.coverImgUrl}?param=130y130`" />
                <div class="songlistCount">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-headset-full"></use>
                    </svg>
                    <div class="count">{{changeValue(item.playCount)}}</div>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-kaishi"></use>
                    </svg>
                </div>
                <div class="songlistName line-limit-length" :title="item.name">{{item.name}}</div>
            </router-link>
        </div>
        <counter :total="totalPages" :li="limit" :off="offset" @transmit="transmit" ></counter>
        <div class="clear"></div>
    </div> 
</template>

<script>
import {getCatlist, getTopplaylist} from '../api/index'
import Counter from '@/views/reuse/Counter'

export default {
    name:"SongList",
    components:{
        Counter
    },
    data(){
        return {
            list: [],
            offset: 0,
            cat: "全部",
            number: [],
            user:[],
            cookie:"",
            //分类
            isSelect:false,
            catlist:[],
            //页数
            totalPages:38,
            limit:35,
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
        },
        //点击分类
        async catlistName(name) {
            this.cat = name
            this.offset= 0
            this.$refs.songlist.scrollIntoView()
            let listValue = await getTopplaylist(this.cat,this.offset)
            this.list = listValue.data.playlists
        },
        async transmit(num) {
            this.$refs.songlist.scrollIntoView()
            let listValue = await getTopplaylist(this.cat,num)
            this.list = listValue.data.playlists
        }
    },
    async mounted(){
        if(this.$route.query.cat) this.cat = this.$route.query.cat 
        let listValue = await getTopplaylist(this.cat,this.offset)
        if(localStorage.getItem('feng')){
            this.user = JSON.parse(localStorage.getItem('feng'))
            this.cookie = encodeURIComponent(this.user.cookie)
        }
        this.list = listValue.data.playlists
        let catlistValue = await getCatlist()
        this.catlist = catlistValue.data.sub
    },
}
</script>

<style lang="less" scoped>
    .songlist {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .selet {
            -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
        }
        .line-limit-length {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
        }
        a {
            text-decoration: none; /* 去除默认的下划线 */
        }
        .songlistTitle {
            width: 90%;
            margin: 3% 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #c20c0c;
            .songTitle {
                font-size: 1.3em;
                font-weight: 700;
                padding: 7px 0;
            }
            .songSelect {
                width: 60px;
                height: 25px;
                font-size: 0.8em;
                background: #fff;
                border: 1px solid #ccc;
                color: #777;
                padding: 0 5px;
                margin: 0 15px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                border-radius: 5px;
            }
            .songSelect:hover {
                cursor: pointer;
                background: Crimson;
                border: 1px solid Pink;
                color: #fff;
            }
            .selectlist {
                position: absolute;
                left: 1107px;
                top: 159px;
                .icon {
                    position: absolute;
                    top: 0px;
                    width: 30px;
                    height: 30px;
                    fill: #fff;
                    z-index: 3;
                }
                .list {
                    width: 600px;
                    height: 350px;
                    background: #fff;
                    position: absolute;
                    left: -500px;
                    top: 19px;
                    z-index: 2;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    box-shadow: 0px 0px 10px #777;
                    .listall {
                        width: 100%;
                        padding: 10px;
                        display: flex;
                        align-items: center;
                        border-bottom: 1px solid #ccc;
                    }
                    .listclassify {
                        width: 100%;
                        display: flex;
                        padding: 10px;
                        span {
                            width: 60px;
                            height: 100%;
                            display: flex;
                            padding: 5px 0 5px 20px;
                            justify-content: space-around;
                            align-items: center;
                            font-size: 0.8em;
                            color: #333;

                        }
                        .listCentent {
                            width: 520px;
                            height: 280px;
                            padding-top: 5px;
                            border-left: 1px solid #ccc;
                            .centent {
                                text-align: center;
                                float: left;
                                padding: 5px;
                                font-size: 0.5em;
                                font-size: 0.4em;
                                color: #777;
                                margin: 0 10px 5px 10px;
                            }
                            .centent:hover {
                                cursor: pointer;
                                background: #ccc;
                                border-radius: 5px;
                                color: #333;
                            }
                        }
                    }
                }
                
            }
        }
        .songlistCentent {
            width: 90%;
            margin: 3% 5%;
            .songlistOnly {
                width: 12%;
                margin: 15px 30px;
                position: relative;
                display: inline-block;
                img {
                    width: 130px;
                    height: 130px;
                }
                .songlistCount {
                    width: 130px;
                    height: 25px;
                    background: #000;
                    opacity: 0.5;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: absolute;
                    left: 0px;
                    top: 105px;
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
                .songlistName {
                    width: 130px;
                    padding: 5px 0;
                    font-size: 0.85em;
                    font-weight: 500;
                    color: #000;
                }
            }
        }
        .clear {
            clear:both;
            height: 100px;
        }
    }
</style>