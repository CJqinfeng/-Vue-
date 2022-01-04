<template>
  <div class="mv">
        <div class="mvTitle" ref="mv">
          <div class="title">全部MV</div>
          <div class="category">
              <div class="genre">
                  <div class="genreTitle">地区：</div>
                  <div class="genreContent center" v-for="(areas,index) in areaList" :key="index" >
                      <span class="genreName center" :class="{'genreActive':area === areas.name}" @click="genre(areas.name,areas.type)">{{areas.name}}</span>
                      <span class="span" v-show="index != areaList.length-1">|</span>
                  </div>
              </div>
              <div class="genre">
                  <div class="genreTitle">类型：</div>
                  <div class="genreContent center" v-for="(types,index) in typeList" :key="index" >
                      <span class="genreName center" :class="{'genreActive':type === types.name}" @click="genre(types.name,types.type)">{{types.name}}</span>
                      <span class="span" v-show="index != areaList.length-1">|</span>
                  </div>
              </div>
              <div class="genre">
                  <div class="genreTitle">排序：</div>
                  <div class="genreContent center"  v-for="(orders,index) in orderList" :key="index" >
                      <span class="genreName center" :class="{'genreActive':order === orders.name}" @click="genre(orders.name,orders.type)">{{orders.name}}</span>
                      <span class="span" v-show="index != areaList.length-1">|</span>
                  </div>
              </div>
          </div>
        </div>
        <div class="mvContent">
            <router-link :to="`/mvmessage?id=${item.id}`" class="mvlist" v-for="item in MVlist" :key="item.id">
                <img :src="`${item.cover}?param=240y136`"  @mouseover="mvIndex = item.id" @mouseleave="mvIndex = 0">
                <div class="mvCount">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bofang1"></use>
                    </svg>
                    <div class="count">{{changeValue(item.playCount)}}</div>
                </div>
                <svg class="mvIcon" aria-hidden="true" v-show="mvIndex === item.id">
                    <use xlink:href="#icon-bofang"></use>
                </svg>
                <div class="mvName line-limit-length" :title="item.name" >{{item.name}}</div>
                <router-link :to="`/singermessage?id=${item.artistId}`" class="mvAuthor">{{item.artistName}}</router-link>
            </router-link>
        </div>
        <counter v-if="flag" :total="totalPages" :li="limit" :off="offset" @transmit="transmit"></counter>
        <div class="clear"></div>
    </div>
</template>

<script>
import {getMvAll} from '@/api/index'
import Counter from '@/views/reuse/Counter'

export default {
    name: "MV",
    components:{
        Counter
    },
    data(){
        return {
            cookie:'',
            area:'全部',
            type:'全部',
            order:'上升最快',
            MVlist:[],
            mvIndex:0,
            //页数
            flag:false,
            totalPages:0,
            limit:36,
            offset:0,
            //地区
            areaList:[
                {name:'全部',type:1},
                {name:'内地',type:1},
                {name:'港台',type:1},
                {name:'欧美',type:1},
                {name:'韩国',type:1},
                {name:'日本',type:1}
            ],
            //类型
            typeList:[
                {name:'全部',type:2},
                {name:'官方版',type:2},
                {name:'原声',type:2},
                {name:'现场版',type:2},
                {name:'网易出品',type:2}
            ],
            //排序
            orderList:[
                {name:'上升最快',type:3},
                {name:'最热',type:3},
                {name:'最新',type:3}
            ]
        }
    },
    methods: {
        async MV(){
            let mvValue = await getMvAll(this.area,this.type,this.order,this.offset)
            this.MVlist = mvValue.data.data
        },
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
        genre(name,id) {
            if(id === 1){
                this.area = name
            } else if(id === 2) {
                this.type = name
            } else if(id === 3) {
                this.order =name
            }
            this.$nextTick(function(){
                this.MV()
            })
        },
        transmit(num){
            this.offset = num
            this.$nextTick(function(){
                this.MV()
                this.$refs.mv.scrollIntoView()
            })
        },
        commentContent() {//等待获取到完整数据在传递
            this.flag = true
        },
    },
    async mounted() {
        let mvValue = await getMvAll(this.area,this.type,this.order,this.offset)
        this.totalPages = Math.ceil(mvValue.data.count/36)
        this.MVlist = mvValue.data.data
        this.commentContent()
    },
}
</script>

<style lang="less" scoped>
    .mv {
        width: 60%;
        margin: 2% 20%;
        background: #fff;
        border: 1px solid #ccc;
        .line-limit-length {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
        }
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .mvTitle {
            width: 90%;
            margin: 3% 5%;
            .title {
                font-size: 1.3em;
                font-weight: 700;
                padding: 7px 0;
            }
            .category {
                width: 100%;
                margin: 15px 0;
                .genre {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                    .genreTitle {
                        color: #333;
                        font-size: 0.8em;
                        width: 50px;
                    }
                    .genreContent {
                        width: 120px;
                        height: 25px;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        color: #999;
                        .genreName {
                            width: 100px;
                            height: 22px;
                            margin: 0 10px;
                            font-size: 0.8em;
                            cursor: pointer;
                            user-select: none;
                        }
                        .genreActive {
                            border-radius: 15px;
                            background: rgb(255, 211, 211);
                            color: rgb(247, 28, 28);
                        }
                        .span {
                            width: 20px;
                            font-size: 0.6em;
                            color: #ccc;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                        }
                    }
                }
            }
        }
        .mvContent {
            width: 90%;
            margin: 3% 5%;
            .mvlist {
                width: 240px;
                margin: 15px 16px;
                display: inline-block;
                position: relative;
                text-decoration: none;
                color: #333;
                img {
                    width: 240px;
                    height: 136px;
                    border-radius: 10px;
                }
                .mvCount {
                    display: flex;
                    align-items: center;
                    width: auto;
                    height: 10px;
                    position: absolute;
                    right: 5px;
                    top: 7px;
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
                    right: 15px;
                    bottom: 60px;
                    width: 40px;
                    height: 40px;
                    fill: #fff;
                }
                .mvName {
                    margin: 3px 0;
                    font-size: 0.9em;
                }
                .mvAuthor {
                    font-size: 0.8em;
                    text-decoration: none;
                    color: #777;
                }
                .mvAuthor:hover {
                    text-decoration: underline;
                    color: #666;
                }
            }
        }
        .clear {
            clear:both;
            height: 100px;
        }
    }
</style>