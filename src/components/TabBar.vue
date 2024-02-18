<script lang="ts" setup></script>
<template>
  <van-tabbar route>
    <van-tabbar-item replace to="/home">
      <span>首页</span>
      <template #icon="{ active }">
        <cp-icon :name="`home-index-${active ? 'active' : 'default'}`" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/article">
      <span>健康百科</span>
      <template #icon="{ active }">
        <cp-icon :name="`home-article-${active ? 'active' : 'default'}`" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/notify">
      <span>消息通知</span>
      <template #icon="{ active }">
        <cp-icon :name="`home-notice-${active ? 'active' : 'default'}`" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/user">
      <span>我的</span>
      <template #icon="{ active }">
        <cp-icon :name="`home-mine-${active ? 'active' : 'default'}`" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss" scoped>
:deep() {
  .van-tabbar-item {
    &__icon {
      font-size: 21px;
    }
    &__text {
      font-size: 11px;
    }
    &:not(.van-tabbar-item--active) {
      color: var(--cp-text3);
    }
  }
}
</style>
