import type { User, codeType } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })

// 发送验证码
export const sendSmsCode = (mobile: string, type: codeType) =>
  request('code', 'GET', { mobile, type })

// 短信验证码登录
export const loginBySmsCode = (mobile: string, code: string) =>
  request<User>('login', 'POST', { mobile, code })
