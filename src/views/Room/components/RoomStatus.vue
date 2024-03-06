<script lang="ts" setup>
import { OrderStatus } from '@/enum'

defineProps<{
  status?: OrderStatus
  countdown?: number
}>()
</script>

<template>
  <div class="room-status">
    <div class="wait" v-if="OrderStatus.ConsultWait === status">
      <van-icon name="volume-o" /> 已通知医生尽快接诊，24小时内医生未回复将自动退款，请耐心等待 ^_^
    </div>
    <div class="chat" v-if="OrderStatus.ConsultChat === status">
      <span>咨询中</span>
      <div class="time">
        <span>剩余时间：</span>
        <van-count-down :time="`${countdown ? countdown * 1000 : 0}`" />
      </div>
    </div>
    <div
      class="end"
      v-if="OrderStatus.ConsultComplete === status || OrderStatus.ConsultCancel === status"
    >
      <van-icon name="passed" />已结束
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room-status {
  position: fixed;
  top: 46px;
  left: 0;
  width: 100%;
  min-height: 44px;
  background-color: #fff;
  font-size: 13px;
  .wait {
    padding: 2px 10px;
    background-color: var(--cp-plain);
    height: 100%;
    text-align: center;
    line-height: 22px;
    color: var(--cp-primary);
  }
  .chat {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 15px;
    span {
      color: var(--cp-primary);
    }
    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      span {
        color: var(--cp-text2);
      }
    }
  }
  .end {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0px 15px;
    font-weight: 500;
    .van-icon {
      font-size: 14px;
      margin-right: 4px;
    }
  }
}
</style>
