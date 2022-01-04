<template>
  <div class="app">
    <MusicHeader></MusicHeader>
    <router-view v-if="isFeng"></router-view>
    <MusicConsole></MusicConsole>
    <div class="clear"></div>
  </div>
</template>

<script>
import MusicHeader from '@/components/MusicHeader'
import MusicConsole from '@/components/MusicConsole'

export default {
  name:"App",
  components:{
    MusicHeader,
    MusicConsole
  },
  data(){
    return {
      isFeng:false
    }
  },
  created(){
    setTimeout(() => {
      this.isFeng = true
    },0)
  }
}
</script>

<style lang="less">
    .clear {
        clear:both;
        height: 100px;
    }
</style>


