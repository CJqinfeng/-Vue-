<template>
    <div class="video" ref="video"
        @mousemove.prevent="handleMouseMove($event)"
        @mouseup.prevent="stopDragging"
        @mouseleave="handleMouseLeave"
        @mouseenter="handleMouseEnter"
    >
        <video  class="player" preload="auto" ref="V" @timeupdate="handleTimeUpdate" @ended="handleEnd">
            <source :src="Url" type="video/mp4">
        </video>
        <div class="console" v-show="isControlVisible">
            <div class="consolePlay">
                <div class="play center">
                    <svg class="icon" aria-hidden="true" v-show="isPlay"  @click="videoPlay()" >
                        <use xlink:href="#icon-bofang2"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-show="!isPlay"  @click="videoPlay()" >
                        <use xlink:href="#icon-bofangzanting"></use>
                    </svg>
                </div>
                <div class="End center">
                    <svg class="icon" aria-hidden="true" @click="videoEnd()">
                        <use xlink:href="#icon-lujing"></use>
                    </svg>
                </div>
            </div>
            <div class="schedule">
                <div class="strip" @click="handleProgressClick($event)">
                    <div class="stripAll"  ref="A" 
                        @mousedown="startDragging($event)"
                        @mousemove="moveDragging($event)"
                        @mouseup="stopDragging($event)"
                    >
                        <div class="stripCurrent" :style="{width: current}" >
                            <div class="stripOrigin" :style="{left: current }" >
                                <div class="stripPoint"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="time center">{{videoTime}}</div>
            </div>
            <div class="consoleFun">
                <div class="volume center">
                    <svg class="icon " aria-hidden="true" v-show="isVolume" @click="videoVolume()" >
                        <use xlink:href="#icon-weibiaoti1"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-show="!isVolume" @click="videoVolume()" >
                        <use xlink:href="#icon-jingyin"></use>
                    </svg>
                </div>
                <div class="full center">
                    <svg class="icon " aria-hidden="true" v-show="isFull" @click="videoFull()" >
                        <use xlink:href="#icon-quanping"></use>
                    </svg>
                    <svg class="icon " aria-hidden="true" v-show="!isFull" @click="videoFull()" >
                        <use xlink:href="#icon-tuichuquanping"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Video",
    props:[
        'Url',
    ],
    data(){
        return {
            video: null,
            isPlay:true,
            isVolume:true,
            isFull:true,
            videoTime: '00:00 / 00:00',//时间
            isDragging: false,
            isControlVisible: false,
            hidingEvent: null,
            videoCurrent: 0,
            draggingStartx: 0,
            dotoffsetX: 0,
            progress: null, 
        }
    },
    computed:{
        current(){//进度条样式的宽度
            return `${this.videoCurrent * 100}%`
        }
    },
    methods: {
        handleMouseEnter(){//鼠标在视频内移动
            this.showControlBar()
        },
        handleMouseMove(event){//鼠标进入视频
            this.showControlBar()
            this.showCursor()
            if(this.hidingEvent !== null){
                clearInterval(this.hidingEvent)
            }
            this.hidingEvent = setInterval(this.hideControlBar,3000)
            this.moveDragging(event)
        },
        handleMouseLeave(){//鼠标离开视频
            this.hideControlBar()
            this.stopDragging()
        },
        showControlBar(){//控制台显示
            this.isControlVisible = true
        },
        hideControlBar(){//控制台隐藏
            const isFullscreen = document.webkitIsFullScreen || document.fullscreen
            if(isFullscreen) { //视频是否全屏
                this.hideCursor()
            }
            this.isControlVisible = false
        },
        hideCursor(){//鼠标隐藏
            document.body.style.cursor = 'none'
        },
        showCursor(){//鼠标显示
            document.body.style.cursor = 'default'
        },
        videoFull(){//全屏
            const isFullscreen = document.webkitIsFullScreen || document.fullscreen
            if(isFullscreen){
                const exitFunc = document.exitFullscreen || document.webkitExitFullscreen
                exitFunc.call(document)
            } else {
                const element = this.$refs.video
                const fullscreenFunc = element.requestFullscreen || element.webkitRequestFullScreen
                fullscreenFunc.call(element)
            }
            this.isFull = !this.isFull
        },
        handleTimeUpdate(){//监视视频时间
            this.videoTime = this.refreshTime()
            this.videoCurrent = this.video.currentTime / this.video.duration
        },
        refreshTime(){//进度条
            if(!this.video) {
                return `${this.secToTime(0)}:${this.secToTime(0)}`
            }
            const currTime = this.video.currentTime || 0 //获取视频当前播放时间
            const duration = this.video.duration || 0 //获取视频总时间
            return `${this.secToTime(currTime)} / ${this.secToTime(duration)}`
        },
        handleProgressClick(event){//进度条点击改变落点
            const clickX = event.clientX
            this.setProgress(clickX)
        },
        setProgress(x){//落点位置改变进度条且改变视频当前播放时间
            const progressRect = this.progress.getBoundingClientRect()
            let progressPercent = (x - progressRect.left) / progressRect.width
            if(progressRect < 0) {
                progressPercent = 0
            } else if(progressRect > 1) {
                progressPercent = 1
            }
            this.video.currentTime = this.video.duration * progressPercent
        },
        startDragging(event){//鼠标点击进行进度条拖拽
            this.isPlay = true
            this.video.pause()//暂停
            this.isDragging = true
            this.draggingStartx = event.clientX
        },
        moveDragging(event){//鼠标拖拽圆点
            if(!this.isDragging) return
            const offsetX = event.clientX - this.draggingStartx
            this.dotoffsetX = offsetX < 0 ? 0 : offsetX
            this.setProgress(event.clientX)
        },
        stopDragging(){//松开鼠标
            this.isDragging = false
            this.dotoffsetX = 0
        },
        secToTime(time){//简化时间
            const min = Math.floor(time / 60)
            const sec = Math.floor(time % 60)
            const minStr = min < 10 ? `0${min}` : String(min)
            const secStr = sec < 10 ? `0${sec}` : String(sec)
            return `${minStr}:${secStr}`
        },
        videoPlay(){
            if(this.video.paused){//视频是否暂停
                this.isPlay = false
                this.video.play()//播放
            } else {
                this.isPlay = true
                this.video.pause()//暂停
            }
        },
        handleEnd() {//播放结束改变按钮状态
            this.isPlay = true
            this.video.pause()
        },
        videoEnd(){//视频终止
            this.video.currentTime = 0
            this.isPlay = true
            this.video.pause()
        },
        videoVolume(){//静音
            this.video.muted = !this.video.muted
            this.isVolume = !this.isVolume
        }
    },
    mounted() {
        this.video = this.$refs.V
        this.progress = this.$refs.A
    }
}
</script>

<style lang="less" scoped>
    .video {
        width: 100%;
        height: 100%;
        position: relative;
        .center {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .player {
            width: 100%;
            height: 100%;
            display: flex;
        }
        .console {
            display: flex;
            height: 40px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.5);
            .consolePlay {
                position: relative;
                height: 40px;
                width: 90px;
                display: flex;
                .play {
                    width: 40px;
                    height: 40px;
                    margin-left: 10px;
                    .icon {
                        cursor: pointer;
                        transition: 0.5s;
                        width: 25px;
                        height: 25px;
                        fill: rgb(230, 230, 230);
                    }
                    .icon:hover {
                        fill: rgb(255, 255, 255);
                    }
                }
                .End {
                    width: 40px;
                    height: 40px;
                    .icon {
                        cursor: pointer;
                        transition: 0.5s;
                        width: 22px;
                        height: 22px;
                        fill: rgb(230, 230, 230);
                    }
                    .icon:hover {
                        fill: rgb(255, 255, 255);
                    }
                }
            }
            .schedule {
                flex: 1;
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .strip {
                    position: absolute;
                    left: 0;
                    top: -3px;
                    width: 100%;
                    .stripAll {
                        width: 100%;
                        height: 3px;
                        background: rgb(238, 238, 238);
                        .stripCurrent {
                            height: 3px;
                            background: rgb(194, 0, 0);
                            .stripOrigin {
                                cursor: pointer;
                                position: absolute;
                                top: -4px;
                                width: 11px;
                                height: 11px;
                                border-radius: 11px;
                                background: #fff;
                                .stripPoint {
                                    width: 5px;
                                    height: 5px;
                                    border-radius: 5px;
                                    background: rgb(194, 0, 0);
                                    position: relative;
                                    left: 3px;
                                    top: 3px;
                                }
                            }
                        }
                    }
                }
                .strip:hover {
                    top: -6px;
                    width: 100%;
                    .stripAll {
                        cursor: pointer;
                        width: 100%;
                        height: 6px;
                        .stripCurrent {
                            height: 6px;
                            background: rgb(194, 0, 0);
                            .stripOrigin {
                                cursor: pointer;
                                position: absolute;
                                top: -4px;
                                width: 14px;
                                height: 14px;
                                border-radius: 14px;
                                background: #fff;
                                .stripPoint {
                                    width: 6px;
                                    height: 6px;
                                    border-radius: 6px;
                                    background: rgb(194, 0, 0);
                                    position: relative;
                                    left: 4px;
                                    top: 4px;
                                }
                            }
                        }
                    }
                }
                .time {
                    width: 100px;
                    height: 40px;
                    font-size: 0.6em;
                    color: #fff;
                }
            }
            .consoleFun {
                position: relative;
                width: 90px;
                height: 40px;
                display: flex;
                .volume {
                    width: 40px;
                    height: 40px;
                    .icon {
                        cursor: pointer;
                        transition: 0.5s;
                        width: 22px;
                        height: 22px;
                        fill: rgb(230, 230, 230);
                    }
                    .icon:hover {
                        fill: rgb(255, 255, 255);
                    }
                }
                .full {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    .icon {
                        cursor: pointer;
                        transition: 0.5s;
                        width: 22px;
                        height: 22px;
                        fill: rgb(230, 230, 230);
                    }
                    .icon:hover {
                        fill: rgb(255, 255, 255);
                    }
                }
            }
        }
    }
</style>