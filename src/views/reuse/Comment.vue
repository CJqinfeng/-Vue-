<template>
  <div class="comment">
        <div class="Title">
            <div class="titleName">评论</div>
            <div class="titleSum">共{{number}}条评论</div>
        </div>
        <div class="Me all">
            <img class="meImg all" :src="`${meImg}?param=70y70`" :onerror="Img" />
            <textarea 
                placeholder="请评论" 
                cols="30" 
                rows="10" class="meInput" 
                v-model="keyword" 
                onfocus="if(placeholder=='请评论')placeholder=''" 
                onblur="if(!placeholder)placeholder='请评论'"></textarea>
            <div class="meComment" @click="Comment(1,keyword)">评论</div>
        </div>
        <div class="Content" v-show="offset === 0">
            <div class="contentTitle" v-show="hotcomments.length != 0" >精彩评论</div>
            <div class="floor" v-for="(item,index) in hotcomments" 
                :key="item.commentId"
                @mouseover="over(item.user.userId,index)" @mouseleave="leave(item.user.userId,index)"
            >
                <img :src="`${item.user.avatarUrl}?param=50y50`" />
                <div class="master">
                    <div class="floorComment">
                        <span>{{item.user.nickname}}</span>：{{item.content}}
                        <div class="select all" @click="Comment(0,undefind,item.commentId)" v-show="selectId&&floorIndex===index">删除</div>
                    </div>
                    <div v-for="Replied in hotcomments[index].beReplied" class="deck">
                        <span>{{Replied.user.nickname}}</span>：{{Replied.content}}
                    </div>
                    <div class="floorFooter">
                        <div class="time">{{item.timeStr}}</div>
                        <div class="praise">
                            <svg class="icon" aria-hidden="true" @click="like(1,item.commentId)" v-show="!item.liked" >
                                <use xlink:href="#icon-dianzan"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" @click="like(0,item.commentId)" v-show="item.liked" >
                                <use xlink:href="#icon-dianzan_kuai"></use>
                            </svg>
                            <span>({{item.likedCount}})</span> 
                        </div>
                        <div class="reply"  @click="getReply(item.commentId)" >回复</div>
                    </div>
                    <div class="replybox" v-show="reply === item.commentId">
                        <textarea 
                            placeholder="请评论" 
                            cols="30" 
                            rows="10" class="replyInput"
                            v-model="replykey"
                            onfocus="if(placeholder=='请评论')placeholder=''" 
                            onblur="if(!placeholder)placeholder='请评论'"></textarea>
                        <div class="meComment all" @click="Comment(2,replykey,item.commentId)">回复</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="Content">
            <div class="contentTitle" v-show="comments.length != 0">最新评论</div>
            <div class="floor" v-for="(item,index) in comments" 
                :key="item.commentId" 
                @mouseover="over(item.user.userId,index)" @mouseleave="leave(item.user.userId,index)">
                <img :src="item.user.avatarUrl" />
                <div class="master">
                    <div class="floorComment">
                        <span>{{item.user.nickname}}</span>：{{item.content}}
                        <div class="select all" @click="Comment(0,'',item.commentId)" v-show="selectId&&floorIndex===index">删除</div>
                    </div>
                    <div v-for="Replied in comments[index].beReplied" class="deck">
                        <span>{{Replied.user.nickname}}</span>：{{Replied.content}}
                    </div>
                    <div class="floorFooter">
                        <div class="time">{{item.timeStr}}</div>
                        <div class="praise">
                            <svg class="icon" aria-hidden="true" @click="like(1,item.commentId)" v-show="!item.liked">
                                <use xlink:href="#icon-dianzan"></use>
                            </svg>
                            <svg class="icon" aria-hidden="true" @click="like(0,item.commentId)" v-show="item.liked" >
                                <use xlink:href="#icon-dianzan_kuai"></use>
                            </svg>
                            <span>({{item.likedCount}})</span>
                        </div>
                        <div class="reply" @click="getReply(item.commentId)">回复</div>
                    </div>
                    <div class="replybox" v-show="reply === item.commentId">
                        <textarea 
                            placeholder="请评论" 
                            cols="30" 
                            rows="10" class="replyInput"
                            v-model="replykey"
                            onfocus="if(placeholder=='请评论')placeholder=''" 
                            onblur="if(!placeholder)placeholder='请评论'"></textarea>
                        <div class="meComment all" @click="Comment(2,replykey,item.commentId)">回复</div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getCommentContent,getCommentLike} from '@/api/index'

export default {
    name:"Comment",
    props:[
        'content',
        "off",
        "number",
        "id",
        "ty",
    ],
    data(){
        return {
            user:[],
            cookie:"",
            meImg:'',
            keyword:'',
            replykey:'',
            reply:0,
            comments:this.content.comments,
            hotcomments:this.content.hotComments,
            offset:this.off,
            Uid:this.id,
            type:this.ty,
            selectId:false,
            floorIndex:0,
        }
    },
    methods:{
        over(id,index) {
          if(this.user.profile.userId === id){
              this.selectId = true
              this.floorIndex = index 
          }  
        },
        leave(id){
            if(this.user.profile.userId === id){
              this.selectId = false
              this.floorIndex = 0 
          }  
        },
        async Comment(t,key,cid){
            if(localStorage.getItem('feng')){
                let time = new Date().valueOf()
                 await getCommentContent(t,this.type,this.Uid,key,cid,this.cookie,time)
                 this.reply = 0
                 this.$emit('refresh')
            } else {
                alert("请登录，登录后才可评论！")
            }
           
        },
        async like(t,cid){
            if(localStorage.getItem('feng')){
                let time = new Date().valueOf()
                 await getCommentLike(this.Uid,cid,t,this.type,this.cookie,time)
                 this.$emit('refresh')
            } else {
                alert("请登录，登录后才可点赞！")
            }
        },
        getReply(id){
            if(this.reply != id){
                this.reply = id
            } else {
                this.reply = 0
            }
        }
    },
    mounted(){
        if(localStorage.getItem('feng')){
            this.user = JSON.parse(localStorage.getItem('feng'))
            this.cookie = encodeURIComponent(this.user.cookie)
            this.meImg = this.user.profile.avatarUrl
        }
    },
    computed:{
      Img(){
            return 'this.src="'+ require('@/assets/images/kabi.jpg') + '"'
        },
    },
    watch:{
        content(newValue) {
            if(newValue.comments.length != 0){
                this.comments = newValue.comments
            }
            if(newValue.hotComments.length != 0){
                this.hotcomments = newValue.hotComments
            }
        },
        off(newValue) {
            this.offset = newValue
        }
    },
}
</script>

<style lang="less" scoped>
    .comment {
        width: 80%;
        margin: 4% 9.4% 2% 9.4%;
        background: #fff;
        .all {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .Title {
            width: 100%;
            padding-bottom: 10px;
            border-bottom: 3px solid #c20c0c;
            display: flex;
            align-items: center;
            .titleName{
                width: 60px;
                font-size: 1.5em;
                font-weight: 700;
            }
            .titleSum {
                width: 100px;
                text-align: right;
                font-size: 0.8em;
                color: #777;
            }
        }
        .Me {
            width: 100%;
            margin: 2%;
            height: 120px;
            .meImg {
                width: 70px;
                height: 70px;
                margin: -10px 20px 20px 20px;
            }
            .meInput {
                flex: 1;
                height: 100px;
                border: 1px solid #ccc;
                font-size: 1.2em;
                outline:none
            }
            .meInput:focus {
                border: 1px solid #999;
                box-shadow: none;
            }
            .meComment {
                width: 70px;
                height: 30px;
                margin: 20px;
                border: 3px solid rgb(250, 171, 171);
                text-align: center;
                line-height: 30px;
                font-size: 1em;
                color: #eee;
                font-weight: 700;
                background: rgb(223, 98, 115);
                border-radius: 10px;
                box-shadow: inset 0px 0px 20px rgb(136, 1, 1);
                user-select: none;
            }
            .meComment:hover {
                cursor: pointer;
                background: #d67e7e;
                color: #fff;
                box-shadow: inset 0px 0px 20px rgb(170, 35, 35);
                border: 3px solid rgb(255, 215, 215);
            }
        }
        .Content {
            width: 100%;
            .contentTitle {
                width: 100%;
                padding: 2% 0 1% 0;
                font-weight: 600;
                font-size: 0.8em;
            }
            .floor {
                width: 100%;
                display: flex;
                border-top: 1px solid #ccc;
                img {
                    width: 50px;
                    height: 50px;
                    margin: 2%;
                }
                .master {
                    font-size: 0.8em;
                    color: #333;
                    span {
                        color: rgb(69, 157, 192);
                    }
                    .floorComment {
                        margin: 12px 0;
                        display: flex;
                        position: relative;
                        height: 25px;
                        .select {
                            position: absolute;
                            left: 550px;
                            top: 0px;
                            width: 40px;
                            height: 25px;
                            padding-left: 15px;
                            border: 1px solid #ccc;
                            background: #c20c0c;
                            color: #eee;
                            border-radius: 5px;
                            user-select: none;
                        }
                        .select:hover {
                            cursor: pointer;
                            border: 1px solid #fff;
                            background: #ff2424;
                            color: #fff;
                        }
                    }
                    .deck {
                        width: 615px;
                        padding: 15px;
                        border: 1px solid #ccc;
                        background: rgb(236, 236, 236);
                        color: #777;
                    }                  
                    .floorFooter {
                        display: flex;
                        padding: 15px 0 10px 0;
                        .time {
                            width: 100px;
                            color: #333;
                        }
                        .praise {
                            display: flex;
                            position: absolute;
                            left: 1010px;
                            .icon {
                                width: 20px;
                                height: 20px;
                                fill: rgb(113, 183, 211);
                                margin: 0 5px;
                            }
                            .icon:hover {
                                fill: rgb(183, 216, 229);
                            }
                            span {
                                color: #777;
                                font-size: 0.9em;
                                padding-bottom: 10px;
                            }
                        }
                        .praise:hover {
                                cursor: pointer;
                                text-decoration:underline
                                
                        }
                        .reply {
                            position: absolute;
                            left: 1080px;
                        }
                        .reply:hover {
                            cursor: pointer;
                            text-decoration:underline
                        }
                    }
                    .replybox {
                        position: relative;
                        left: 200px;
                        display: flex;
                        margin: 10px;
                        .replyInput {
                            width: 400px;
                            height: 100px;
                            outline:none;
                            border: 1px solid #ccc;
                        }
                        .replyInput:focus {
                            border: 1px solid #777;
                            box-shadow: none;
                        }
                        .meComment {
                            width: 25px;
                            height: 105px;
                            border: 1px solid #ccc;
                            padding-left: 10px;
                            user-select: none;
                            background: #0066ff;
                            color: #eee;
                        }
                        .meComment:hover {
                            cursor: pointer;
                            border: 1px solid #fff;
                            background: #4891ff;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>