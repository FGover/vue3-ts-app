<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { ref, onMounted } from 'vue'
import { getConsultOrderDetail } from '@/services/consult'
import { useRoute, useRouter } from 'vue-router'
import { OrderStatus } from '@/enum'
import { getIllnessTimeText, getFlagText } from '@/utils/consult'
import ConsultMore from './components/ConsultMore.vue'
import { useCancelOrder, useDeleteOrder, useShowPrescription } from '@/composables'
import { useClipboard } from '@vueuse/core'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const item = ref<ConsultOrderItem>()
onMounted(async () => {
  const { data: res } = await getConsultOrderDetail(route.params.id as string)
  item.value = res
})

const { loading, cancelConsultOrder } = useCancelOrder()
const router = useRouter()
const { loading: deleteLoading, deleteConsultOrder } = useDeleteOrder(() => {
  router.push('/user/consult')
})
const { onShowPre } = useShowPrescription()

// 复制订单号
const { copy, isSupported } = useClipboard()
const onCopy = async () => {
  if (!isSupported) {
    return showToast('浏览器不支持')
  }
  await copy(item.value?.orderNo || '')
  showToast('复制成功')
}

const show = ref(false)
const onClickOverlay = () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认取消？',
    confirmButtonText: '继续支付',
    cancelButtonText: '狠心离开'
  })
    .then(() => {
      show.value = true
    })
    .catch(() => {
      show.value = false
      router.push('/user/consult')
    })
}
</script>

<template>
  <cp-nav-bar title="问诊详情"></cp-nav-bar>
  <div class="consult-detail-page" v-if="item">
    <div class="detail-head">
      <div class="text">
        <h3>图文问诊 {{ item.payment }}元</h3>
        <span
          class="sta"
          :class="{
            orange: item.status === OrderStatus.ConsultPay,
            green: item.status === OrderStatus.ConsultChat
          }"
          >{{ item.statusValue }}</span
        >
        <p class="tip">服务医生信息</p>
      </div>
      <div class="card">
        <img src="@/assets/avatar-doctor.svg" alt="" />
        <p class="doc">
          <span>极速问诊</span>
          <span>{{ item.docInfo?.name || '暂未接诊' }}</span>
        </p>
        <van-icon name="arrow"></van-icon>
      </div>
    </div>
    <div class="detail-patient">
      <van-cell-group>
        <van-cell
          title="患者信息"
          :value="`${item.patientInfo.name} | ${item.patientInfo.genderValue} | ${item.patientInfo.age}岁`"
        />
        <van-cell title="患病时长" :value="getIllnessTimeText(item.illnessTime)" />
        <van-cell title="就诊情况" :value="getFlagText(item.consultFlag)" />
        <van-cell title="病情描述" :label="item.illnessDesc" />
      </van-cell-group>
    </div>
    <div class="detail-order">
      <h3>订单信息</h3>
      <van-cell-group>
        <van-cell title="订单编号">
          <template #value>
            <span class="copy" @click="onCopy">复制</span>
            {{ item.orderNo }}
          </template>
        </van-cell>
        <van-cell title="创建时间" :value="item.createTime" />
        <van-cell title="应付款" :value="`￥${item.payment}`" />
        <van-cell title="优惠券" :value="`-￥${item.couponDeduction}`" />
        <van-cell title="积分抵扣" :value="`-￥${item.pointDeduction}`" />
        <van-cell title="实付款" :value="`￥${item.actualPayment.toFixed(2)}`" class="price" />
      </van-cell-group>
    </div>
    <!-- 待支付 -->
    <div class="detail-time" v-if="item.status === OrderStatus.ConsultPay">
      请在 <van-count-down :time="item.countdown * 1000" /> 内完成支付，超时订单将取消
    </div>
    <div class="detail-action van-hairline--top" v-if="item.status === OrderStatus.ConsultPay">
      <div class="price">
        <span>需付款</span>
        <span>￥ {{ item.actualPayment.toFixed(2) }}</span>
      </div>
      <van-button type="default" round :loading="loading" @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button type="primary" round @click="show = true">继续支付</van-button>
    </div>
    <!-- 待接诊 -->
    <div class="detail-action van-hairline--top" v-if="item.status === OrderStatus.ConsultWait">
      <van-button type="default" round :loading="loading" @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button type="primary" round :to="`/room?orderId=${item.id}`">继续沟通</van-button>
    </div>
    <!-- 接诊中 -->
    <div class="detail-action van-hairline--top" v-if="item.status === OrderStatus.ConsultChat">
      <van-button
        type="default"
        round
        v-if="item.prescriptionId"
        @click="onShowPre(item.prescriptionId)"
        >查看处方</van-button
      >
      <van-button type="primary" round :to="`/room?orderId=${item.id}`">继续沟通</van-button>
    </div>
    <!-- 已完成 -->
    <div class="detail-action van-hairline--top" v-if="item.status === OrderStatus.ConsultComplete">
      <consult-more
        @on-delete="deleteConsultOrder(item)"
        :disabled="!item.prescriptionId"
        @on-preview="onShowPre(item.prescriptionId)"
      ></consult-more>
      <van-button type="default" round :to="`/room?orderId=${item.id}`">问诊记录</van-button>
      <van-button type="default" round v-if="item.evaluateId">查看评价</van-button>
      <van-button type="primary" round v-else>写评价</van-button>
    </div>
    <!-- 已取消 -->
    <div class="detail-action van-hairline--top" v-if="item.status === OrderStatus.ConsultCancel">
      <van-button type="default" round :loading="deleteLoading" @click="deleteConsultOrder(item)"
        >删除订单</van-button
      >
      <van-button type="primary" round to="/">咨询其他医生</van-button>
    </div>
    <!-- 支付抽屉 -->
    <cp-pay-sheet
      v-model:show="show"
      :order-id="item.id"
      :actual-payment="item.actualPayment"
      :on-click-overlay="onClickOverlay"
      pay-callback="/room"
    />
  </div>
  <div class="consult-detail-page" v-else>
    <van-skeleton title :row="4" style="margin-top: 30px"></van-skeleton>
    <van-skeleton title :row="4" style="margin-top: 30px"></van-skeleton>
    <van-skeleton title :row="4" style="margin-top: 30px"></van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.consult-detail-page {
  padding-top: 46px;
  padding-bottom: 109px;
  .detail-head {
    height: 140px;
    position: relative;
    padding: 15px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 135px;
      background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
      border-bottom-left-radius: 150px 20px;
      border-bottom-right-radius: 150px 20px;
    }
    .text {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 10px 3px;
      padding-right: 15px;
      sta {
        color: var(--cp-tag);
        font-weight: 500;
        font-size: 16px;
        &.green {
          color: var(--cp-primary);
        }
        &.orange {
          color: #f2994a;
        }
      }
      .tip {
        width: 100%;
        color: var(--cp-text3);
        margin-top: 5px;
      }
    }
    .card {
      height: 74px;
      background-color: #fff;
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 15px;
      box-shadow: 0 0 22px 0 rgba(229, 229, 229, 0.5);
      img {
        width: 38px;
        height: 38px;
      }
      .doc {
        flex: 1;
        padding-left: 15px;
        span {
          display: block;
          font-size: 16px;
          &:last-child {
            font-size: 13px;
            color: var(--cp-text3);
          }
        }
      }
      .van-cion {
        color: var(--cp-tip);
      }
    }
  }
  .detail-patient {
    &::after {
      content: '';
      display: block;
      height: 12px;
      background-color: var(--cp-bg);
    }
  }
  .detail-order {
    > h3 {
      padding: 10px 18px;
      font-weight: normal;
    }
    .copy {
      padding: 2px 10px;
      border: 1px solid var(--cp-primary);
      background-color: var(--cp-plain);
      color: var(--cp-primary);
      font-size: 12px;
      border-radius: 12px;
      margin-right: 10px;
    }
    :deep(.van-cell__title) {
      width: 70px;
      flex: none;
    }
    .price :deep(.van-cell__value) {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
  .detail-time {
    position: fixed;
    left: 0;
    bottom: 65px;
    width: 100%;
    height: 44px;
    background-color: #fff7eb;
    text-align: center;
    line-height: 44px;
    font-size: 13px;
    color: #f2994a;
    .van-count-down {
      display: inline;
      color: #f2994a;
    }
  }
  .detail-action {
    height: 65px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    justify-content: flex-end;
    padding: 0 15px;
    box-sizing: border-box;
    .price {
      flex: 1;
      > span:last-child {
        font-size: 18px;
        color: var(--cp-price);
        padding-left: 5px;
      }
    }
    .van-button {
      margin-left: 10px;
      padding-left: 17px;
      padding-right: 17px;
    }
    :deep(.van-button--default) {
      background-color: var(--cp-bg);
      color: var(--cp-text3);
    }
  }
  .van-cell {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
