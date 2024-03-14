<script lang="ts" setup>
import type { Medical } from '@/types/room'

defineProps<{
  medicines: Medical[]
}>()
</script>

<template>
  <div class="order-medical">
    <div class="head">
      <div>优医药房</div>
      <div class="txt">优质医保 假一赔十</div>
    </div>
    <div class="item van-hairline--top" v-for="i in medicines" :key="i.id">
      <img :src="i.avatar" alt="" />
      <div class="info">
        <p class="name">
          <span>{{ i.name }}</span>
          <span>x{{ i.quantity }}</span>
        </p>
        <p class="size">
          <van-tag v-if="i.prescriptionFlag === 1">处方药</van-tag>
          <span>{{ i.specs }}</span>
        </p>
        <p class="price">￥{{ i.amount }}</p>
      </div>
      <div class="desc">用法用量：{{ i.usageDosag }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-medical {
  padding: 15px;
  .head {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding-bottom: 15px;
    .txt {
      color: var(--cp-tag);
      font-size: 13px;
      margin-left: 10px;
    }
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;
    border-top: 1px solid #f5f5f5;
    img {
      width: 70px;
      height: 70px;
      border-radius: 6px;
    }
    .info {
      flex: 1;
      padding: 0 15px;
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .size {
        margin-top: 5px;
        .van-tag {
          background-color: var(--cp-primary);
          margin-right: 10px;
        }
      }
      .price {
        margin-top: 5px;
        color: var(--cp-price);
      }
    }
    .desc {
      width: 100%;
      margin-top: 10px;
      padding: 5px;
      font-size: 13px;
      background-color: var(--cp-bg);
      color: var(--cp-tip);
    }
  }
}
</style>
