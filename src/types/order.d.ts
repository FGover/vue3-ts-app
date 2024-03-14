import type { OrderStatus, ExpressStatus } from '@/enum'
import type { Medical } from './room'

export type OrderPre = {
  id: string
  couponId: string
  pointDeduction: number
  couponDeduction: number
  payment: number
  // 邮费
  expressFee: number
  actualPayment: number
  // 药品订单
  medicines: Medical[]
}

export type AddressItem = {
  id: string
  mobile: string
  receiver: string
  province: string
  city: string
  county: string
  addressDetail: string
  isDefault: 0 | 1
}

// 去除属性
type Address = Omit<AddressItem, 'isDefault'>

export type OrderDetail = {
  id: string
  orderNo: string
  type: number
  createTime: string
  prescriptionId: string
  status: OrderStatus
  statusValue: string
  medicines: Medical[]
  countDown: number
  addressInfo: Address
  expressInfo: {
    // 物流位置
    content: string
    time: string
  }
  payTime: string
  paymentMethod?: 0 | 1
  payment: number
  pointDeduction: number
  couponDeduction: number
  expressFee: number
  actualPayment: number
  roomId: string
}

export type Express = {
  // 物流信息ID
  id: string
  // 物流内容
  content: string
  // 创建时间
  createTime: string
  // 物流状态
  status: ExpressStatus
  // 状态文章
  statusValue: string
}

export type Location = {
  // 经度
  longitude: string
  // 纬度
  latitude: string
}

// 物流详情
export type Logistics = {
  // 预计送达时间
  estimatedTime: string
  // 物流公司名称
  name: string
  // 物流编号
  awbNo: string
  // 最新物流状态
  status: ExpressStatus
  // 最新物流状态文字
  statusValue: string
  // 物流信息数组
  list: Express[]
  // 轨迹信息数组
  logisticsInfo: Location[]
  // 当前运输位置
  currentLocationInfo: Location
}
