<script lang="ts" setup>
import { useOrderDetail } from '@/composables'
import { OrderStatus } from '@/enum'
import { useRoute } from 'vue-router'

const route = useRoute()
const { order } = useOrderDetail(route.query.orderId as string)
</script>

<template>
  <div class="order-pay-result">
    <cp-nav-bar title="药品支付结果"></cp-nav-bar>
    <div class="result" v-if="order?.status === OrderStatus.MedicinePay">
      <van-icon name="clear" class="error"></van-icon>
      <p class="price">￥{{ order?.actualPayment.toFixed(2) }}</p>
      <p class="status">支付失败</p>
      <p class="tip">订单支付失败，可以点击订单继续支付，有疑问联系客服~</p>
    </div>
    <div class="result" v-else>
      <van-icon name="checked"></van-icon>
      <p class="price">￥{{ order?.actualPayment.toFixed(2) }}</p>
      <p class="status">支付成功</p>
      <p class="tip">订单支付成功，已通知药房尽快发出，请耐心等待~</p>
      <div class="btn">
        <van-button type="primary" :to="`/order/${order?.id}`">查看订单</van-button>
        <van-button :to="`/room?orderId=${order?.roomId}`">返回诊室</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-pay-result {
  padding-top: 46px;
  .result {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0;
    .van-icon {
      font-size: 80px;
      color: var(--cp-primary);
    }
    .price {
      margin: 5px 0 10px;
      font-size: 32px;
      color: #333;
    }
    .status {
      margin-bottom: 20px;
      font-size: 20px;
      color: #333;
    }
    .tip {
      color: var(--cp-tip);
      margin-bottom: 30px;
    }
    .van-button {
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
    }
    .error {
      color: var(--cp-price);
    }
  }
}
</style>
