<script lang="ts" setup>
import { useRouter } from 'vue-router'

// 使用props定义标题、右侧文字等属性
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()

// 自定义事件
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
// 使用emit触发事件
const onClickRight = () => {
  emit('click-right')
}

// 回退，用history.state 信息
console.log(history.state)
const router = useRouter()
const onClickLeft = () => {
  if (props.back) return props.back()
  if (history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div>
    <van-nav-bar
      :title="title"
      :right-text="rightText"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
    ></van-nav-bar>
  </div>
</template>

<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    border-bottom: 1px solid var(--cp-bg);
    &__arrow {
      color: var(--cp-text1) !important;
      font-size: 18px;
    }
    &__title {
      font-size: 15px !important;
    }
  }
}
</style>
