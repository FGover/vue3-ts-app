<script lang="ts" setup>
import { OrderStatus } from '@/enum'
import type { ConsultOrderItem } from '@/types/consult'
import { useShowPrescription, useCancelOrder, useDeleteOrder } from '@/composables'
import ConsultMore from './ConsultMore.vue'

const props = defineProps<{
  item: ConsultOrderItem
}>()

// 取消订单
const { loading, cancelConsultOrder } = useCancelOrder()

const emit = defineEmits<{
  (e: 'on-delete', id: string): void
}>()
// 删除订单
const { loading: deleteLoading, deleteConsultOrder } = useDeleteOrder(() => {
  console.log(1)
  emit('on-delete', props.item.id)
})

// 查看处方
const { onShowPre } = useShowPrescription()
</script>

<template>
  <div class="consult-item">
    <div class="head" van-hairline--bottom>
      <div class="left">
        <img src="@/assets/avatar-doctor.svg" alt="" />
        <span>{{ item.docInfo?.name || '暂无医生接诊' }}</span>
      </div>
      <span
        class="right"
        :class="{
          orange: item.status === OrderStatus.ConsultPay,
          green: item.status === OrderStatus.ConsultChat
        }"
        >{{ item.statusValue }}</span
      >
    </div>
    <div class="body" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="body-row">
        <div class="body-label">病情描述：</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格：</div>
        <div class="body-value">￥{{ item.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间：</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>
    <div class="foot" v-if="item.status === OrderStatus.ConsultWait">
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >取消问诊</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`"
        >继续沟通</van-button
      >
    </div>
    <div class="foot" v-if="item.status === OrderStatus.ConsultChat">
      <van-button
        @click="onShowPre(item.prescriptionId)"
        v-if="item.prescriptionId"
        class="gray"
        plain
        size="small"
        round
        >查看处方</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/room?orderId=${item.id}`"
        >继续沟通</van-button
      >
    </div>
    <div class="foot" v-if="item.status === OrderStatus.ConsultPay">
      <van-button
        :loading="loading"
        @click="cancelConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >取消问诊</van-button
      >
      <van-button type="primary" plain size="small" round :to="`/user/consult/${item.id}`"
        >去支付</van-button
      >
    </div>
    <div class="foot" v-if="item.status === OrderStatus.ConsultCancel">
      <van-button
        :loading="deleteLoading"
        @click="deleteConsultOrder(item)"
        class="gray"
        plain
        size="small"
        round
        >删除订单</van-button
      >
      <van-button type="primary" plain size="small" round to="/">咨询其他医生</van-button>
    </div>
    <div class="foot" v-if="item.status === OrderStatus.ConsultComplete">
      <!-- 更多组件 -->
      <consult-more
        :disabled="!item.prescriptionId"
        @on-preview="onShowPre(item.prescriptionId)"
        @on-delete="deleteConsultOrder(item)"
      ></consult-more>
      <van-button class="gray" plain size="small" round :to="`/room?orderId=${item.id}`"
        >问诊记录</van-button
      >
      <van-button v-if="item.evaluateId" class="gray" plain size="small" round>查看评价</van-button>
      <van-button v-else type="primary" plain size="small" round>评价</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 36px;
        height: 36px;
        margin-right: 10px;
        border-radius: 50%;
      }
      span {
        font-size: 16px;
      }
    }
    .right {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    margin-top: 30px;
    .body-row {
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-bottom: 10px;
      .body-label {
        color: var(--cp-text3);
        width: 70px;
      }
      .body-value {
        color: var(--cp-text1);
      }
      .tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    .gray {
      color: var(--cp-text3);
      background-color: var(--cp-bg);
      margin-right: 10px;
    }
  }
}
</style>
