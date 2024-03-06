<script lang="ts" setup>
import { uploadImage } from '@/services/consult'
import type { Image } from '@/types/consult'
import { showLoadingToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref } from 'vue'

defineProps<{
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', image: Image): void
}>()

const text = ref('')
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}
// 上传图片
const sendImage: UploaderAfterRead = async (item) => {
  if (Array.isArray(item)) return
  if (!item.file) return
  const load = showLoadingToast({
    message: '上传中...',
    duration: 0
  })
  const { data: res } = await uploadImage(item.file)
  load.close()
  emit('send-image', res)
}
</script>

<template>
  <div class="room-action">
    <van-field
      class="input"
      type="text"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
      :border="false"
      v-model="text"
      @keyup.enter="sendText"
    ></van-field>
    <van-uploader :after-read="sendImage" :preview-image="false" :disabled="disabled">
      <cp-icon name="consult-img"></cp-icon>
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 0 16px;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
