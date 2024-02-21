<script lang="ts" setup>
import { showToast } from 'vant'

const props = defineProps<{
  options: { label: string; value: number | string; msg?: string }[]
  modelValue?: number | string
}>()

// 自定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const clickUpdate = (item: { value: string | number; msg?: string }) => {
  if (item.value === props.modelValue) {
    showToast(item.msg)
    emit('update:modelValue', 5)
  } else {
    emit('update:modelValue', item.value)
  }
}
</script>

<template>
  <div class="cp-radio-btn">
    <div
      class="item"
      :class="{ active: modelValue === item.value }"
      v-for="item in options"
      :key="item.value"
      @click="clickUpdate(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  .item {
    height: 32px;
    padding: 0 14px;
    color: var(--cp-text2);
    background-color: var(--cp-bg);
    border: 1px solid var(--cp-bg);
    text-align: center;
    line-height: 32px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    transform: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
      color: var(--cp-primary);
    }
  }
}
</style>

<!-- <script lang="ts" setup>
// vue3通过v-model 解析成 modelValue 和 @update:modelValue
defineProps<{
  modelValue: number
}>()

// 自定义事件
defineEmits<{ (e: 'update:modelValue', count: number): void }>()
</script>

<template>
  <div class="cp-radio-btn">
    计数器：{{ modelValue }}
    <button @click="$emit('update:modelValue', modelValue + 1)">+1</button>
  </div>
</template>

<style lang="scss" scoped></style> -->

<!-- <script lang="ts" setup>
// vue3通过v-model 解析成 modelValue 和 @update:modelValue
defineProps<{
  count: number
}>()

// 自定义事件
defineEmits<{ (e: 'update:count', count: number): void }>()
</script>

<template>
  <div class="cp-radio-btn">
    计数器：{{ count }}
    <button @click="$emit('update:count', count + 1)">+1</button>
  </div>
</template>

<style lang="scss" scoped></style> -->
