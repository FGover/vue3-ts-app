<script lang="ts" setup>
import DoctorCard from './DoctorCard.vue'
import { ref, onMounted } from 'vue'

// @vueuse库获取设备的宽度
import { useWindowSize } from '@vueuse/core'
import type { DoctorList } from '@/types/consult'
import { getDoctorList } from '@/services/consult'
const { width } = useWindowSize()

const list = ref<DoctorList>([])
const getDocList = async () => {
  // 获取 1到48 的随机整数
  const current = Math.floor(Math.random() * 48) + 1
  const { data: res } = await getDoctorList({ current: current, pageSize: 8 })
  list.value = res.rows
}
onMounted(() => {
  getDocList()
})

// 原生js方法实现设备宽度
// import { ref, onMounted, onUnmounted } from 'vue'
// const width = ref(0)
// const setWidth = () => {
//   width.value = document.documentElement.clientWidth
//   console.log(width.value)
// }
// onMounted(() => {
//   setWidth()
//   window.addEventListener('resize', setWidth)
// })
// onUnmounted(() => {
//   window.removeEventListener('resize', setWidth)
// })
</script>

<template>
  <div class="like-doctor">
    <div class="head">
      <p>推荐关注</p>
      <a href="javascript:;">查看更多<i class="van-icon van-icon-arrow"></i></a>
    </div>
    <div class="body">
      <van-swipe :width="(150 / 375) * width" :loop="false" :show-indicators="false">
        <van-swipe-item v-for="item in list" :key="item.id">
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.like-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 15px;
    font-size: 13px;
    a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
