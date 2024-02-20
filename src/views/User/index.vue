<script lang="ts" setup>
import { getUserInfo } from '@/services/user'
import type { UserInfo } from '@/types/user'
import { ref, onMounted } from 'vue'
import { showConfirmDialog } from 'vant'
import { useUserStore } from '@/stores'
import router from '@/router'

// 用户信息
const userInfo = ref<UserInfo>()

// 初始化快捷工具
const tools = [
  { label: '我的问诊', path: '/user/consult', icon: 'user-tool-01' },
  { label: '我的处方', path: '/', icon: 'user-tool-02' },
  { label: '家庭档案', path: '/user/patient', icon: 'user-tool-03' },
  { label: '地址管理', path: '/user/address', icon: 'user-tool-04' },
  { label: '我的评价', path: '/', icon: 'user-tool-05' },
  { label: '官方客服', path: '/', icon: 'user-tool-06' },
  { label: '设置', path: '/', icon: 'user-tool-07' }
]

const userStore = useUserStore()
const onLogout = () => {
  // 退出登录
  showConfirmDialog({
    title: '温馨提示',
    message: '您是否退出登录？'
  })
    .then(() => {
      userStore.delUser()
      router.push('/login')
    })
    .catch(() => {
      // on cancel
    })
}

onMounted(async () => {
  const { data: res } = await getUserInfo()
  userInfo.value = res
})
</script>

<template>
  <div class="user-page">
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="userInfo?.avatar" />
        <div class="name">
          <p>{{ userInfo?.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p style="font-weight: bold">{{ userInfo?.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p style="font-weight: bold">{{ userInfo?.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p style="font-weight: bold">{{ userInfo?.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p style="font-weight: bold">{{ userInfo?.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order">全部订单<van-icon name="arrow" /> </router-link>
      </div>
      <van-row>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.paidNumber || ''">
            <cp-icon name="user-paid" />
          </van-badge>
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.shippedNumber || ''">
            <cp-icon name="user-shipped" />
          </van-badge>
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.receiveNumber || ''">
            <cp-icon name="user-received" />
          </van-badge>
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.finishedNumber || ''">
            <cp-icon name="user-finished" />
          </van-badge>
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        v-for="(item, index) in tools"
        :key="index"
        :title="item.label"
        is-link
        :to="item.path"
      >
        <template #icon>
          <cp-icon :name="item.icon" />
        </template>
      </van-cell>
    </div>
    <div class="btn">
      <van-button type="primary" @click="onLogout" round>退出登录</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  padding: 0 15px 65px;
  min-height: calc(100vh - 50px);
  &-head {
    height: 200px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0.46), rgba(44, 181, 165, 0));
    margin: 0 -15px;
    padding: 0 15px;
    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;
      .van-image {
        width: 70px;
        height: 70px;
      }
      .name {
        padding-left: 10px;
        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }
    .van-col {
      text-align: center;
      p {
        font-size: 14px;
        padding-top: 8px;
      }
    }
  }
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-top: 15px;
    padding-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      a {
        color: var(--cp-tip);
      }
    }
    .van-row {
      margin-top: 10px;
    }
    .van-col {
      text-align: center;
      .cp-icon {
        font-size: 28px;
      }
      p {
        font-size: 14px;
      }
    }
  }
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      display: flex;
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }
  .btn {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    .van-button {
      width: 80%;
    }
  }
}
</style>
