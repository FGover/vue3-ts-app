<script setup lang="ts">
import { useUserStore } from './stores'
import type { User } from './types/user'
import { request } from './utils/request'
const userStore = useUserStore()

const getUserInfo = () => {
  // axios.request({
  //   url: 'patient/myUser'
  // })
  request('patient/myUser')
}

const login = () => {
  // 判断响应数据类型是否正确
  request<User>('/login/password', 'POST', {
    mobile: '13211112222',
    password: 'abc12345'
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <div>
    {{ userStore.user }}
    <van-button
      type="primary"
      @click="
        userStore.setUser({
          id: '1',
          avatar: '1',
          token: '1',
          mobile: '1',
          account: '1'
        })
      "
      >登录</van-button
    >
    <van-button type="primary" @click="userStore.delUser()">退出</van-button>
    <van-button type="primary" @click="getUserInfo">获取用户信息</van-button>
    <van-button type="primary" @click="login">用户登录</van-button>
  </div>
</template>

<style scoped></style>
