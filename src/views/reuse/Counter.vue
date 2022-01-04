<template>
    <div class="counter" v-show="totalPages > 1" >
        <div class="content">
            <div class="uppage selet" @click="UpDown(-1)">上一页</div>
            <div class="number">
                <div class="only selet" 
                v-for="(item,index) in pages" 
                :key="index"
                :class="{'active': item === currentPage}"
                @click="countClick(item)"
            >{{item}}</div>
            </div>
            <div class="downpage selet" @click="UpDown(1)">下一页</div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Counter",
    props:[
        "total",
        "li",
        "off"
    ],
    data(){
        return {
            //分页器
            currentPage: 1,
            totalPages: this.total,
            limit:this.li,
            offset:this.off,
        }
    },
    methods:{
        //上下一页点击事件
        async UpDown(num) {
            this.currentPage += num
            if(this.currentPage < 1) {
                this.currentPage = 1
                return 
            } else if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages
                return 
            } else {
                this.offset += this.limit*num
            }
            this.transmit()
        },
        //点击数字按钮事件
        countClick(item) {
            if(item === this.currentPage) return
            if(typeof item === 'string') return
            this.currentPage = item
            this.offset = (this.limit*item)-this.limit
            this.transmit()
        },
        transmit(){
            this.$emit('transmit',this.offset)
        }
    },
    computed:{
        pages() {//分页器：省略
            const c = this.currentPage
            const f = this.totalPages
            if( c <= 5&&f>=11 ) {
                return [ 1, 2, 3, 4, 5, 6, 7, 8, 9, '...', f ]
            } else if( c >= f - 4&&f>=11) {
                return [ 1, '...', f-8, f-7, f-6, f-5, f-4, f-3, f-2, f-1, f ]
            } else if(f < 11 ) {
                return f
            } else {
                return [ 1, '...', c-3, c-2, c-1, c, c+1, c+2, c+3, '...', f ]
            } 
        }
    }
}
</script>

<style lang="less" scoped>
    .counter {
        width: 60%;
        margin: 0 20%;
        padding-top: 5%;
        padding-left: 23px;
        display: flex;
        user-select: none;
        .content {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 40px;
            .uppage,
            .downpage {
                width: 50px;
                height: 15px;
                padding: 5px;
                margin: 0 5px;
                background: #fff;
                font-size: 0.8em;
                display: flex;
                color: #777;
                justify-content: space-around;
                align-items: center;
                border-radius: 3px;
                border: 1px solid #ccc;
            }
            .uppage:hover,
            .downpage:hover {
                cursor: pointer;
                background: #c20c0c;
                border: 1px solid red;
                color: #fff;
            }
            .number {
                display: flex;
                justify-content: center;
                align-items: center;
                .only {
                    width: 25px;
                    height: 25px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 3px;
                    background: #fff;
                    color: #777;
                    border-radius: 3px;
                    border: 1px solid #ccc;
                    font-size: 0.8em;
                }
                .only:hover {
                    cursor: pointer;
                    background: #c20c0c;
                    border: 1px solid red;
                    color: #fff;
                }
                .active {
                    background: #c20c0c;
                    border: 1px solid red;
                    color: #fff;
                }
            }
        }
    }
</style>