<script lang="ts" setup>
import { createConsultOrder, getConsultOrderPrePayInfo } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPrePayInfo, PartialConsultRecord } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showDialog, showToast } from 'vant'
import { ref, onMounted } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
const router = useRouter()

const consultStore = useConsultStore()
// 获取预支付信息
const payInfo = ref<ConsultOrderPrePayInfo>()
const loadPayInfo = async () => {
  const { data: res } = await getConsultOrderPrePayInfo({
    type: consultStore.consultInfo.type,
    illnessType: consultStore.consultInfo.illnessType
  })
  payInfo.value = res
  consultStore.setCoupon(res.couponId)
}

// 获取患者详情
const patientInfo = ref<Patient>()
const loadPatientInfo = async () => {
  if (!consultStore.consultInfo.patientId) return
  const { data: res } = await getPatientDetail(consultStore.consultInfo.patientId)
  patientInfo.value = res
}

type Key = keyof PartialConsultRecord
onMounted(() => {
  // 生成订单信息不完整时校验字段信息
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  const valid = validKeys.every((key) => consultStore.consultInfo[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
  loadPayInfo()
  loadPatientInfo()
})

const agree = ref(false)
const loading = ref(false)
const show = ref(false)
// 支付方式
const orderId = ref('')
const onSubmit = async () => {
  if (!agree.value) return showToast('请同意支付协议')
  loading.value = true
  // 生成订单id
  const { data: res } = await createConsultOrder(consultStore.consultInfo)
  orderId.value = res.id
  show.value = true
  loading.value = false
  consultStore.clear()
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
      orderId.value = ''
      router.push('/user/consult')
    })
}
// 路由离开之前
onBeforeRouteLeave(() => {
  if (orderId.value) {
    return false
  }
})
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patientInfo">
    <cp-nav-bar title="支付"></cp-nav-bar>
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }}元</p>
      <img src="@/assets/avatar-doctor.svg" alt="" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动匹配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`- ${payInfo?.couponDeduction.toFixed(2)}`" />
      <van-cell title="积分抵扣" :value="`- ${payInfo?.pointDeduction.toFixed(2)}`" />
      <van-cell
        title="实付款"
        :value="`￥${payInfo?.actualPayment.toFixed(2)}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patientInfo?.name} | ${patientInfo?.genderValue} | ${patientInfo?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="consultStore.consultInfo.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意<span class="text">《支付协议》</span></van-checkbox>
    </div>
    <van-submit-bar
      :loading="loading"
      :price="payInfo?.actualPayment ? payInfo?.actualPayment * 100 : 0"
      button-text="立即支付"
      button-type="primary"
      @submit="onSubmit"
      text-align="left"
    />
    <cp-pay-sheet
      v-model:show="show"
      :order-id="orderId"
      :actual-payment="payInfo.actualPayment"
      :on-click-overlay="onClickOverlay"
      pay-callback="/room"
    />
  </div>
  <div class="consult-pay-page" v-else>
    <cp-nav-bar title="支付"></cp-nav-bar>
    <!-- 骨架组件 -->
    <van-skeleton title :row="13" style="margin-top: 18px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px;
  .pay-info {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      span {
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-tex2);
        }
      }
    }
  }
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
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
}
</style>
