<script lang="ts" setup>
import MedicalItem from './components/MedicalItem.vue'
import { useOrderDetail } from '@/composables'
import { OrderStatus } from '@/enum'
import { useRoute } from 'vue-router'

const route = useRoute()
const { order } = useOrderDetail(route.params.id as string)
</script>

<template>
  <div class="order-detail" v-if="order">
    <cp-nav-bar :title="`药品订单详情-${order.statusValue}`"></cp-nav-bar>
    <div class="order-head">
      <div class="card">
        <div
          class="logistics"
          v-if="order.expressInfo"
          @click="$router.push(`/order/logistics/${order.id}`)"
        >
          <p>{{ order.expressInfo.content }}</p>
          <p>{{ order.expressInfo.time }}</p>
        </div>
        <div class="logistics" v-else>
          <p>【无相关物流信息】</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </div>
    </div>
    <medical-item :medicines="order.medicines" />
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${order.payment}`" />
        <van-cell title="运费" :value="`￥${order.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${order.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${order.actualPayment.toFixed(2)}`" class="price" />
        <van-cell title="订单编号" :value="order.orderNo" />
        <van-cell title="创建时间" :value="order.createTime" />
        <template
          v-if="
            order.status === OrderStatus.MedicineSend ||
            order.status === OrderStatus.MedicineComplete ||
            order.status === OrderStatus.MedicineTake
          "
        >
          <van-cell title="支付时间" :value="order.payTime" />
          <van-cell title="支付方式" :value="order.paymentMethod === 1 ? '支付宝' : '微信'" />
        </template>
      </van-cell-group>
    </div>
    <van-action-bar v-if="order.status === OrderStatus.MedicineCancel">
      <van-action-bar-icon icon="delete-o" text="删除" />
      <van-action-bar-button type="primary" text="沟通记录" />
    </van-action-bar>
    <van-action-bar v-if="order.status === OrderStatus.MedicineTake">
      <van-action-bar-button type="primary" text="确认收货" />
    </van-action-bar>
    <van-action-bar v-if="order.status === OrderStatus.MedicineSend">
      <van-action-bar-button type="primary" text="提醒发货" />
    </van-action-bar>
    <van-action-bar v-if="order.status === OrderStatus.MedicinePay">
      <p>
        需要支付：<span style="color: var(--cp-price)">￥{{ order.actualPayment.toFixed(2) }}</span>
      </p>
      <van-action-bar-button color="#bbb" text="取消问诊" />
      <van-action-bar-button type="primary" text="继续支付" />
    </van-action-bar>
    <van-action-bar v-if="order.status === OrderStatus.MedicineComplete">
      <van-action-bar-icon icon="delete-o" text="删除" />
      <van-action-bar-button type="primary" text="再次购买" />
    </van-action-bar>
  </div>
</template>

<style lang="scss" scoped>
.order-head {
  position: relative;
  padding: 61px 15px 15px;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 46px;
    width: 100%;
    height: 80px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }
  .card {
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    .logistics {
      flex: 1;
      p:last-child {
        font-size: 12px;
        color: #999;
      }
      p:first-child {
        font-size: 15px;
        color: var(--cp-primary);
        margin-bottom: 5px;
      }
    }
    .van-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
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
.order-detail {
  padding-bottom: 30px;
}
.van-action-bar {
  padding: 0 10px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}
</style>
