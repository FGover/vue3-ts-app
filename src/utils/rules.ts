import type { FieldRule } from 'vant'

const mobileRules: FieldRule[] = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }
]

const passRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,14}$/, message: '密码必须是8-14个字符' }
]

const codeRules: FieldRule[] = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '验证码必须是6个数字' }
]

export { mobileRules, passRules, codeRules }
