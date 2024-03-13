<script lang="ts" setup>
import { getConsultPayOrderUrl } from '@/services/consult'
import { ref } from 'vue'
import { showLoadingToast, showToast } from 'vant'

const props = defineProps<{
  show: boolean
  orderId: string
  actualPayment: number
  onClickOverlay?: () => void
}>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const payMethod = ref<0 | 1>()
// 支付
const pay = async () => {
  if (payMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({ message: '跳转支付', duration: 0 })
  const { data: res } = await getConsultPayOrderUrl({
    orderId: props.orderId,
    paymentMethod: payMethod.value,
    payCallback: 'http://localhost:5173/room'
  })
  window.location.href = res.payUrl
}
</script>

<template>
  <van-popup
    :show="show"
    @update:show="emit('update:show', $event)"
    position="bottom"
    round
    :close-on-popstate="false"
    :close-on-click-overlay="false"
    @click-overlay="onClickOverlay"
  >
    <div class="pay-type">
      <p class="title">选择支付方式</p>
      <span class="icon" @click="onClickOverlay"><van-icon name="cross" /></span>
      <p class="amount">￥{{ actualPayment.toFixed(2) }}元</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="payMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="payMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="payMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="payMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" round block @click="pay">立即支付</van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.pay-type {
  .title {
    text-align: center;
    font-size: 17px;
    margin-top: 10px;
  }
  .icon {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 18px;
  }
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
  .btn {
    padding: 15px;
  }
}
</style>
