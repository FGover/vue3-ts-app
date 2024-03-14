<script lang="ts" setup>
import type { AddressItem, OrderPre } from '@/types/order'
import { getAddressList, getMedicalOrderPre, createMedicalOrder } from '@/services/order'
import { onMounted, ref } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import MedicalItem from './components/MedicalItem.vue'
const route = useRoute()
const router = useRouter()

// 预支付信息
const orderPre = ref<OrderPre>()
const loadOrderPre = async () => {
  const { data: res } = await getMedicalOrderPre({
    prescriptionId: route.query.id as string
  })
  orderPre.value = res
}

// 收获地址信息
const address = ref<AddressItem>()
const orderAddress = async () => {
  const { data: res } = await getAddressList()
  if (res.length) {
    const defAds = res.find((item) => item.isDefault === 1) || res[0]
    address.value = defAds
  }
}

// 创建药品订单
const checked = ref(false)
const loading = ref(false)
const orderId = ref('')
const show = ref(false)
const onSubmit = async () => {
  if (!checked.value) return showToast('请勾选协议')
  if (!address.value?.id) return showToast('请选择地址')
  if (!orderPre.value?.id) return showToast('订单信息有误')
  if (!orderId.value) {
    try {
      loading.value = true
      const { data: res } = await createMedicalOrder({
        id: orderPre.value.id,
        addressId: address.value.id,
        couponId: orderPre.value.couponId
      })
      orderId.value = res.id
      loading.value = false
      show.value = true
    } catch {
      loading.value = false
    }
  } else {
    show.value = true
  }
}

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

onMounted(() => {
  loadOrderPre()
  orderAddress()
})
</script>

<template>
  <div class="order-pay-page" v-if="orderPre && address">
    <cp-nav-bar title="药品支付"></cp-nav-bar>
    <div class="order-address">
      <p class="area">
        <van-icon name="location"></van-icon>
        <span>{{ address?.province }}{{ address?.city }}{{ address?.county }}</span>
      </p>
      <p class="detail">{{ address?.addressDetail }}</p>
      <p>{{ address?.receiver }} {{ address?.mobile }}</p>
    </div>
    <div class="bg-gray"></div>
    <!-- 药品item组件 -->
    <medical-item :medicines="orderPre.medicines" />
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderPre?.payment.toFixed(2)}`" />
        <van-cell title="运费" :value="`￥${orderPre?.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderPre?.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderPre?.actualPayment.toFixed(2)}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
        不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="checked">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
      :price="orderPre.actualPayment * 100"
      button-text="立即支付"
      button-type="primary"
      text-align="left"
      :loading="loading"
      @click="onSubmit"
    ></van-submit-bar>
    <!-- 支付 -->
    <cp-pay-sheet
      v-model:show="show"
      :order-id="orderId"
      :actual-payment="orderPre.actualPayment"
      pay-callback="/order/pay/result"
      :on-click-overlay="onClickOverlay"
    />
  </div>
  <div class="order-pay-page" v-else>
    <cp-nav-bar title="药品支付"></cp-nav-bar>
    <van-skeleton title row="3" style="margin-top: 25px"></van-skeleton>
    <van-skeleton title row="4" style="margin-top: 50px"></van-skeleton>
    <van-skeleton title row="4" style="margin-top: 50px"></van-skeleton>
    <van-skeleton title row="4" style="margin-top: 50px"></van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);
  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff !important;
  }
}

.order-address {
  padding-top: 60px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  .area {
    .van-icon {
      color: #f57a10;
    }
    span {
      color: var(--cp-tag);
    }
  }
  .detail {
    font-size: 16px;
    font-weight: bold;
    padding: 5px 0;
    color: #333;
  }
  p {
    color: #333;
  }
}
.bg-gray {
  height: 15px;
  background-color: #f5f5f5;
}
.order-tip {
  padding-bottom: 65px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;
    margin-bottom: 15px;
  }
  a {
    color: var(--cp-primary);
  }
}
</style>
