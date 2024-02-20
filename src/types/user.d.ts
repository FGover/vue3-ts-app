export type User = {
  token: string
  id: string
  account: string
  mobile: string
  avatar: string
}

// login登录，register注册，changeMobile更换手机号，forgetPassword找回密码，bindMobile绑定第三方登录
export type codeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// 去掉token的类型
type OmitUser = Omit<User, 'token'>
// 个人用户信息
export type UserInfo = OmitUser & {
  // 关注
  likeNumber: number
  // 收藏
  collectionNumber: number
  // 积分
  score: number
  // 优惠券
  couponNumber: number
  orderInfo: {
    // 待付款
    paidNumber: number
    // 待发货
    receiveNumber: number
    // 待收货
    shippedNumber: number
    // 已完成
    finishedNumber: number
  }
}

// Omit Pick 是 ts的内置类型
// Omit 是从对象中排除一些属性，得到剩下的对象类型
// Pick 是从对象中摘取一些属性，得到属性
// 选两个属性
// type Person = Pick<User, 'id' | 'mobile'>
// type Person = {
// 性别只能是0 1
//   gender: 0 | 1
// }

// 家庭档案--患者信息
export type Patient = {
  id?: string
  name: string
  idCard: string
  defaultFlag: 0 | 1
  // 0 女 1 男
  gender: 0 | 1
  genderValue?: string
  age?: number
}

// 患者信息列表
export type PatientList = Patient[]
