<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'on-preview'): void
  (e: 'on-delete'): void
}>()
const showPopover = ref(false)
const actions = computed(() => [
  { text: '查看处方', disabled: props.disabled },
  { text: '删除订单' }
])
const onSelect = (action: { text: string }, i: number) => {
  if (i === 0) {
    // 查看处方
    emit('on-preview')
  } else {
    // 删除订单
    emit('on-delete')
  }
}
</script>

<template>
  <div class="more">
    <van-popover
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
      placement="top-start"
    >
      <template #reference>更多</template>
    </van-popover>
  </div>
</template>

<style lang="scss" scoped>
.more {
  color: var(--cp-tag);
  flex: 1;
  font-size: 13px;
}
</style>
