<script lang="ts" setup>
import { useFollow } from '@/composables'
import type { Doctor } from '@/types/consult'

defineProps<{
  item: Doctor
}>()

// 关注
const { loading, follow } = useFollow()
</script>

<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">{{ item.hosiptalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button round size="small" type="primary" @click="follow(item)" :loading="loading">{{
      item.likeFlag === 1 ? '已关注' : '+ 关注'
    }}</van-button>
  </div>
</template>

<style lang="scss" scoped>
.doctor-card {
  width: 135px;
  height: 190px;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  .van-image {
    width: 58px;
    height: 58px;
    margin: 5px;
    vertical-align: top;
  }
  p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
