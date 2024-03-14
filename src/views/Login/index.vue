<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { mobileRules, passRules, codeRules } from '@/utils/rules'
import { loginByPassword, loginBySmsCode, sendSmsCode } from '@/services/user'
import { showToast, showSuccessToast, type FormInstance } from 'vant'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const mobile = ref('13230000001')
const password = ref('abc12345')
const checked = ref(false)
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 登录
const onSubmit = async () => {
  if (!checked.value) {
    return showToast('请勾选协议')
  }
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginBySmsCode(mobile.value, code.value)
  userStore.setUser(res.data)
  showSuccessToast('登录成功')
  router.replace((route.query.returnUrl as string) || '/user')
}

// 短信登录界面切换
const isPass = ref(true)
const code = ref('')

// 发送短信验证码
const time = ref(0)
const form = ref<FormInstance>()
let timer: any
const onSendSms = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  await sendSmsCode(mobile.value, 'login')
  showToast('发送成功')
  time.value = 60
  // 开启倒计时
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timer)
  }, 1000)
}

// 密码可见不可见
const isEyePass = ref(false)
const eyePass = () => {
  isEyePass.value = !isEyePass.value
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <cp-nav-bar @click-right="$router.push('/register')" right-text="注册" />
  <div class="login-page">
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow" />
      </a>
    </div>
    <!-- 表单 -->
    <van-form @submit="onSubmit" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入用户名"
        clearable
      />
      <van-field
        ref="pass"
        v-if="isPass"
        v-model="password"
        :rules="passRules"
        :type="isEyePass ? 'text' : 'password'"
        placeholder="请输入密码"
        clearable
      >
        <template #button>
          <cp-icon
            @click="eyePass"
            :name="isEyePass ? 'login-eye-on' : 'login-eye-off'"
            style="margin-right: 10px"
          ></cp-icon>
        </template>
      </van-field>
      <van-field v-else v-model="code" :rules="codeRules" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="onSendSms">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="checked">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div style="margin: 10px 30px">
        <van-button round block type="primary" native-type="submit">登录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="../../assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  padding: 46px 0;
}
.login-head {
  padding: 30px 30px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-weight: normal;
    font-size: 22px;
  }
  a {
    font-size: 15px;
  }
}
.van-form {
  padding: 0 14px;
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: #a3eee3;
    }
  }
  .cp-cell {
    padding: 14px 16px;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
}
.login-other {
  margin-top: 60px;
  padding: 0 30px;
  .icon {
    display: flex;
    justify-content: center;
    img {
      width: 36px;
      height: 36px;
      padding: 4px;
    }
  }
}
</style>
