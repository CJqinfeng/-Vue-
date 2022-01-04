<template>
    <div class="mvmessage">
        <div class="mv">
            <div class="left">
                <div class="leftTitle">
                    <div class="mvTitle line-limit-length" :title="detail.name">{{detail.name}}</div>
                    <router-link :to="`/singermessage?id=${detail.artistId}`" class="mvAuthor center">{{detail.artistName}}</router-link>
                </div>
                <div class="mvContent">
                    <div class="mvVideo">
                        <mvVideo v-if="flag" :Url="mvUrl.url"></mvVideo>
                    </div>
                    <div class="info">
                        <div class="button">
                            <svg class="icon" aria-hidden="true" v-show="!info.liked" @click="setLike(1)">
                                <use xlink:href="#icon-dianzan"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" v-show="info.liked" @click="setLike(2)" >
                                <use xlink:href="#icon-dianzan_kuai"></use>
                            </svg>
                            <span>点赞({{info.likedCount}})</span>
                        </div>
                        <div class="button" @click="setSub(1)">
                             <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tianjiaqiyedangan"></use>
                            </svg>
                            <span>{{subed ? '已收藏' : '收藏' }}</span>
                            <span>({{detail.subCount}})</span>
                        </div>
                        <div class="button" @click="shar = !shar">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-fenxiang"></use>
                            </svg>
                            <span>分享({{detail.shareCount}})</span>
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
                    <div class="mvCount">发布时间：{{detail.publishTime}}</div>
                    <div class="mvCount">播放次数：{{changeValue(detail.playCount)}}次</div>
                </div>
            </div>
            <div class="right">
                <div class="rightTitle">相关MV</div>
                <div class="rightContent">
                    <router-link :to="`/mvmessage?id=${item.id}`" class="simiMV" v-for="item in simi" :key="item.id">
                        <img :src="`${item.cover}?param=110y62`">
                        <div class="simiCount center">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-bofang1"></use>
                            </svg>
                            <div class="count">{{changeValue(item.playCount)}}</div>
                        </div>
                        <div class="simiTitle">
                            <div class="simiName" :title="item.name">{{item.name}}</div>
                            <div class="simiAuthor">
                                by
                                <router-link :to="`/singermessage?id=${item.artistId}`" class="artis">{{item.artistName}}</router-link>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <comment v-if="flag" :content="content" :off="offset" :number="sum" :id="mvId" :ty="1" @refresh="refresh"></comment>
        <counter v-if="flag" :total="totalPages" :li="limit" :off="offset" @transmit="transmit"></counter>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getMvDetail,getMvDetailInfo,getMvUrl,getMvSimi,getMvComment,getMvSub} from '@/api/index'
import mvVideo from '@/views/reuse/Video.vue'
import Comment from '@/views/reuse/Comment'
import Counter from '@/views/reuse/Counter'

export default {
    name: "MvMessage",
    components: {
        mvVideo,
        Comment,
        Counter
    },
    data(){
        return {
            mvId:this.$route.query.id,
            user:[],
            cookie: '',
            detail:{},//mv详情
            info:{},//mv点赞评论转发数
            mvUrl:{},//mv地址
            simi:[],//相关mv
            comment:[],//mv评论
            content:[],
            sum:0,
            subed:false,
            shar:false,//是否分享
            sharkey:'',
            //分页器
            totalPages:0,
            offset:0,
            limit:20,
            flag:false,
        }
    },
    watch:{
        '$route' (to,from) {
            this.$router.go(0)
        }
    },
    methods: {
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
        commentContent() {//等待获取到完整数据在传递
            this.content = this.comment
            this.flag = true
        },
        async refresh(){//评论
            let time = new Date().valueOf()
            let commentValue = await getMvComment(this.$route.query.id,this.offset,this.cookie,time)
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
            let commentValue = await getMvComment(this.$route.query.id,num,this.cookie,time)
            this.comment = commentValue.data
            this.commentContent()
        },
        async setLike(t){//点赞
            if(localStorage.getItem('feng')){
                this.$store.dispatch('setResourceLike',{t:t,type:1,id:this.mvId,cookie:this.cookie})
                let infoValue = await getMvDetailInfo(this.mvId)
                this.$nextTick(function(){
                    this.info = infoValue.data
                    this.info.liked = true
                })
            } else {
                alert("请登录，登录后才可点赞！")
            }
        },
        async setSub(t){//收藏MV
            let sub =  await getMvSub(t,this.mvId,this.cookie)
            if(sub.data.code === 200){
                alert(sub.data.message)
                this.subed = true
            } else {
                alert(sub.data.message)
            }
        },
        sharcontent(){//分享
            this.$store.dispatch('getShare',{type:'mv',id:this.mvId,msg:this.sharkey,cookie:this.cookie})
            this.shar = false
        },
    },
    async mounted() {
        let mvId = this.$route.query.id
        if(localStorage.getItem('feng')){
            this.user = JSON.parse(localStorage.getItem('feng'))
            this.cookie = encodeURIComponent(this.user.cookie)
        }
        let detailValue = await getMvDetail(mvId)
        let infoValue = await getMvDetailInfo(mvId)
        let mvUrlValue = await getMvUrl(mvId,1080)
        let simiValue = await getMvSimi(mvId)
        let time = new Date().valueOf()
        let commentValue = await getMvComment(mvId,this.offset,this.cookie,time)
        this.detail = detailValue.data.data
        console.log(this.detail);
        this.info = infoValue.data
        this.mvUrl = mvUrlValue.data.data
        this.simi = simiValue.data.mvs
        this.comment = commentValue.data
        this.totalPages = Math.ceil(this.comment.total/20)
        this.sum = this.comment.total
        this.commentContent()
    },
}
</script>

<style lang="less" scoped>
    .mvmessage {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .line-limit-length {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
        }
        .mv {
            width: 90%;
            margin: 50px 5%;
            display: flex;
            .left {
                width: 75%;
                .leftTitle {
                    width: 70%;
                    display: flex;
                    .mvTitle {
                        width: 220px;
                        font-size: 1.5em;
                    }
                    .mvAuthor {
                        width: 120px;
                        text-decoration: none;
                        font-size: 1.1em;
                        margin-top: 7px;
                        color: rgb(67, 100, 207);
                    }
                    .mvAuthor:hover {
                        text-decoration: underline;
                        color: rgb(85, 57, 243);
                    }
                }
                .mvContent {
                    width: 100%;
                    .mvVideo {
                        width: 600px;
                        margin-top: 20px;
                    }
                    .info {
                        display: flex;
                        margin: 30px 0 30px 0;
                        position: relative;
                        .button{
                            cursor: pointer;
                            user-select: none;
                            display: flex;
                            align-items: center;
                            margin-right: 20px;
                            width: auto;
                            height: 30px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            padding: 0px 7px;
                            box-shadow: inset 0 0 10px #eee;
                            .icon {
                                width: 15px;
                                height: 15px;
                                fill: #333;
                                padding-right: 2px;
                            }
                            span {
                                font-size: 0.6em;
                                color: #444;
                            }
                        }
                        .button:hover {
                            box-shadow: inset 0 0 10px #fff;
                        }
                        .sharbox {
                            width: 360px;
                            height: 120px;
                            position: absolute;
                            left: 240px;
                            top: 40px;
                            border: 1px solid rgb(155, 155, 155);
                            border-radius: 5px;
                            background: #ff4d4d;
                            .sharInput {
                                width: 340px;
                                height: 100px;
                                outline:none;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                background: rgb(248, 248, 248);
                            }
                        }
                    }
                    .mvCount {
                        font-size: 0.85em;
                        padding-bottom: 10px;
                        color: #666;
                    }
                }
            }
            .right {
                width: 25%;
                border-left: 1px solid #ccc;
                .rightTitle {
                    width: 100%;
                    margin: 10px 0 10px 5%;
                    font-size: 1em;
                    color: #333;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #999;
                }
                .rightContent {
                    width: 90%;
                    margin: 20px 5%;
                    .simiMV {
                        width: 100%;
                        display: flex;
                        position: relative;
                        margin: 25px 0;
                        text-decoration: none;
                        color: #333;
                        img {
                            width:110px;
                            height: 62px;
                        }
                        .simiCount {
                            position: absolute;
                            right: 77px;
                            top: 2px;
                            .icon {
                                width: 12px;
                                height: 12px;
                                fill: #fff;
                            }
                            .count {
                                font-size: 0.3em;
                                color: #fff;
                            }
                        }
                        .simiTitle {
                            width: 100px;
                            float: left;
                            .simiName {
                                width: 100px;
                                height: 34px;
                                font-size: 0.7em;
                                padding-left: 5px;
                                color: #333;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                -webkit-line-clamp: 2;//向显示多少行就给多大值
                                -webkit-box-orient: vertical;
                            }
                            .simiAuthor {
                                width: 100px;
                                height: 34px;
                                font-size: 0.3em;
                                padding: 5px 0 0 5px;
                                color: #999;
                                .artis {
                                    margin: 2px;
                                    text-decoration: none;
                                    color: #666;
                                }
                                .artis:hover {
                                    text-decoration: underline;
                                    color: #444;
                                }
                            }
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