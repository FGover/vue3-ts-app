<script lang="ts" setup>
import { evaluateConsultOrder } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import type { EvaluateDoc } from '@/types/room'
import { showToast } from 'vant'
import type { Ref } from 'vue'
import { ref, computed, inject } from 'vue'

defineProps<{ evaluateDoc?: EvaluateDoc }>()

// 接收问诊订单数据
const consult = inject<Ref<ConsultOrderItem>>('consult')
const completeEva = inject<(score: number) => void>('completeEva')

const score = ref(0)
const content = ref('')
const anonymousFlag = ref(false)
const disabled = computed(() => !score.value || !content.value)
// 提交评价
const onSubmit = async () => {
  // 调用接口提交评价
  if (!score.value) return showToast('请选择评分')
  if (!content.value) return showToast('请输入评价')
  if (!consult?.value) return showToast('问诊信息不存在')
  if (consult.value.docInfo) {
    await evaluateConsultOrder({
      docId: consult.value?.docInfo?.id,
      orderId: consult.value?.id,
      score: score.value,
      content: content.value,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    })
    completeEva?.(score.value)
  }
}
</script>

<template>
  <div class="evaluate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0, 0, 0, 0.04)"
    />
  </div>
  <div class="evaluate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0, 0, 0, 0.04)"
    />
    <van-field
      v-model="content"
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button type="primary" size="small" round :class="{ disabled }" @click="onSubmit"
        >提交评价</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evaluate-card {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: 550;
  }
  .desc {
    text-align: center;
    margin-top: 8px;
    color: var(--cp-tip);
  }
  .van-rate {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .van-field {
    background-color: var(--cp-bg);
    border-radius: 8px;
    margin-top: 20px;
  }
  .footer {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .disabled {
      background-color: var(--cp-bg);
      color: var(--cp-tip);
      border: 1px solid var(--cp-bg);
    }
  }
}
</style>
