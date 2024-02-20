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

const nameRules: FieldRule[] = [
  { required: true, message: '请输入真实姓名' },
  { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '姓名必须是2-10个中文字符' }
]

const idCardRules: FieldRule[] = [
  { required: true, message: '请输入身份证号' },
  {
    pattern: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
    message: '身份格式不正确'
  }
]

export { mobileRules, passRules, codeRules, nameRules, idCardRules }
