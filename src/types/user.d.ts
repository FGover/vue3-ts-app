export type User = {
  token: string
  id: string
  account: string
  mobile: string
  avatar: string
}

// login登录，register注册，changeMobile更换手机号，forgetPassword找回密码，bindMobile绑定第三方登录
export type codeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'
